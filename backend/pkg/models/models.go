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

type CartItem struct {
	Item     Item `bson:"item"`
	Quantity int  `bson:"quantity"`
}

type User struct {
	ID             primitive.ObjectID `bson:"_id,omitempty"`
	Email          string             `bson:"email"`
	Name           string             `bson:"name"`
	HashedPassword []byte             `bson:"hashedPassword"`
	Created        time.Time          `bson:"created"`
	Role           string             `bson:"role"`
	OTP            OTP                `bson:"otp,omitempty"`
	Favorites      []Item             `bson:"favorites,omitempty"`
	Cart           []CartItem         `bson:"cart,omitempty"`
}

type OTPs struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Email    string             `bson:"email"`
	OTP      OTP                `bson:"otp,omitempty"`
	Verified bool               `bson:"verified"`
}

type Category struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	CategoryName string             `bson:"category_name"`
}

type Item struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Categories []Category         `bson:"categories,omitempty"`
	Price      float64            `bson:"price"`
	ItemName   string             `bson:"item_name"`
	Photos     []string           `bson:"item_photos"`
	Reviews    []Review           `bson:"reviews"`
	Infos      []Info             `bson:"info"`
	Options    []Option           `bson:"options"`
}
type Review struct {
	ID      primitive.ObjectID `bson:"_id,omitempty"`
	UserId  primitive.ObjectID `bson:"user_id"`
	Rating  float64            `bson:"rating"`
	Comment string             `bson:"comment"`
}

type Info struct {
	Title   string `bson:"info_title"`
	Content string `bson:"info_content"`
}

type Option struct {
	Title   string   `bson:"option_title"`
	Options []string `bson:"option_options"`
}