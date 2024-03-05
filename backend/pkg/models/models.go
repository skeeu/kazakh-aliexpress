package models

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

var ErrNoRecord = errors.New("models: no matching record found")
var ErrInvalidCredentials = errors.New("models: invalid credentials")
var ErrDuplicateEmail = errors.New("models: duplicate email")
var ErrEmailDoesNotExist = errors.New("models: email does not exist")

type OTP struct {
	Code    string    `bson:"code"`
	Expires time.Time `bson:"expires"`
}

type User struct {
	ID             primitive.ObjectID   `bson:"_id,omitempty"`
	Email          string               `bson:"email"`
	Name           string               `bson:"name"`
	HashedPassword []byte               `bson:"hashedPassword"`
	Created        time.Time            `bson:"created"`
	Role           string               `bson:"role"`
	OTP            OTP                  `bson:"otp,omitempty"`
	Cart           []primitive.ObjectID `bson:"cart,omitempty"`
}

type OTPs struct {
	ID    primitive.ObjectID `bson:"_id,omitempty"`
	Email string             `bson:"email"`
	OTP   OTP                `bson:"otp,omitempty"`
}

type Category struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	CategoryName string             `bson:"category_name"`
}

type Item struct {
	ID primitive.ObjectID `bson:"_id,omitempty"`
}
