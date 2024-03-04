package mongodb

import (
	"context"
	"crypto/rand"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"kazakh-aliexpress/backend/pkg/models"
	"math/big"
	"net/smtp"
	"time"
)

type UserModel struct {
	C *mongo.Collection
}

func NewUserModel(c *mongo.Collection) *UserModel {
	return &UserModel{C: c}
}

///////////// EMAIL SENDING LOGIC //////////////

func SendEmailWithCode(to, code string) error {
	from := "dauka8@gmail.com"
	password := "3142D1C955A5E76295E5A51E40ACA8C68616"
	smtpHost := "smtp.elasticemail.com"
	smtpPort := "2525"

	message := []byte("Subject: Your confirmation code\r\n\r\n" + "Confrimation code: " + code)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		return err
	}

	fmt.Println("Email sent successfully")
	fmt.Println([]string{to})
	return nil
}

func GenerateRandomCode() (string, error) {
	const codeLength = 6
	var code string
	for i := 0; i < codeLength; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			return "", err
		}
		code += fmt.Sprintf("%d", num.Int64())
	}
	return code, nil
}

func (m *UserModel) CheckCode(email, code string) (bool, error) {
	var user models.User
	err := m.C.FindOne(context.TODO(), bson.M{"email": email}).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		return false, err
	}

	if user.OTP.Code == code && user.OTP.Expires.After(time.Now()) {
		return true, nil
	}

	return false, nil
}

func (m *UserModel) IsEmailExists(email string) (bool, error) {
	var result models.User
	err := m.C.FindOne(context.TODO(), bson.M{"email": email}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

///////////// END OF EMAIL SENDING LOGIC //////////////

func (m *UserModel) SignUpEmail(email string) error {

	exists, err := m.IsEmailExists(email)
	if err != nil {
		return err
	}

	if exists {
		return models.ErrDuplicateEmail
	}

	code, err := GenerateRandomCode()
	if err != nil {
		return err
	}

	expires := time.Now().Add(time.Minute * 15)
	opts := options.Update().SetUpsert(true)

	filter := bson.M{"email": email}
	update := bson.M{
		"$set": bson.M{
			"otp.code":    code,
			"otp.expires": expires,
		},
	}

	_, err = m.C.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	err = SendEmailWithCode(email, code)
	if err != nil {
		return err
	}

	return nil
}

func (m *UserModel) SignUpConfirmCode(email, code string) (bool, error) {
	isValid, err := m.CheckCode(email, code)

	if err != nil {
		return false, err
	}

	return isValid, nil
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

	_, err = m.C.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	return nil
}

//////////////////////// SIGN IN ////////////////////////////
