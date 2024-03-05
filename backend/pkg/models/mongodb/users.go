package mongodb

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"kazakh-aliexpress/backend/pkg/models"
	"time"
)

type UserModel struct {
	C *mongo.Collection
}

func NewUserModel(c *mongo.Collection) *UserModel {
	return &UserModel{C: c}
}

func (m *UserModel) IsEmailExists(email string) (bool, error) {
	var result models.User
	err := m.C.FindOne(context.TODO(), bson.M{"email": email}).Decode(&result)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

///////////// END OF EMAIL SENDING LOGIC //////////////

func (m *UserModel) CheckEmail(email string) error {

	exists, err := m.IsEmailExists(email)
	if err != nil {
		return err
	}

	if exists {
		return models.ErrDuplicateEmail
	}
	return nil
}
func (m *UserModel) SignUpComplete(email, name, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return err
	}

	filter := bson.M{"email": email}

	update := bson.M{
		"$set": bson.M{
			"name":           name,
			"hashedPassword": hashedPassword,
			"created":        time.Now(),
			"role":           "buyer",
		},
	}
	opts := options.Update().SetUpsert(true)

	_, err = m.C.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}

//////////////////////// SIGN IN ////////////////////////////

func (m *UserModel) Authenticate(email, password string) error {

	var result models.User
	err := m.C.FindOne(context.TODO(), bson.M{"email": email}).Decode(&result)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return models.ErrInvalidCredentials
		} else {
			return err
		}
	}

	err = bcrypt.CompareHashAndPassword(result.HashedPassword, []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return models.ErrInvalidCredentials
		}
		return err
	}

	return nil
}
