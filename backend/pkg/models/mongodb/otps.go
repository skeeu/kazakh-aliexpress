package mongodb

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"kazakh-aliexpress/backend/pkg/models"
	"math/big"
	"net/smtp"
	"time"
)

type OtpModel struct {
	C *mongo.Collection
}

func NewOtpModel(c *mongo.Collection) *OtpModel {
	return &OtpModel{C: c}
}

///////////// EMAIL SENDING LOGIC //////////////

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

func (m *OtpModel) SignUpEmail(email string) error {
	code, err := GenerateRandomCode()
	if err != nil {
		return err
	}

	fmt.Println(code)

	expires := time.Now().Add(time.Minute * 15)
	opts := options.Update().SetUpsert(true)

	filter := bson.M{"email": email}
	update := bson.M{
		"$set": bson.M{
			"otp.code":    code,
			"otp.expires": expires,
			"verified":    false,
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

func (m *OtpModel) SignUpConfirmCode(email, code string) (bool, error) {
	isValid, err := m.CheckCode(email, code)

	if err != nil {
		return false, err
	}

	opts := options.Update().SetUpsert(true)
	filter := bson.M{"email": email}
	update := bson.M{
		"$set": bson.M{
			"verified": true,
		},
	}
	_, err = m.C.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return false, err
	}

	return isValid, nil
}

func (m *OtpModel) CheckCode(email, code string) (bool, error) {
	var otpRecord models.OTPs
	err := m.C.FindOne(context.TODO(), bson.M{"email": email}).Decode(&otpRecord)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return false, nil
		}
		return false, err
	}

	if otpRecord.OTP.Code == code && otpRecord.OTP.Expires.After(time.Now()) {
		return true, nil
	}

	return false, nil
}

func (m *OtpModel) IsEmailVerified(email string) (bool, error) {
	var otpRecord models.OTPs
	err := m.C.FindOne(context.TODO(), bson.M{"email": email}).Decode(&otpRecord)
	if err != nil {
		return false, err
	}

	return otpRecord.Verified, nil
}
