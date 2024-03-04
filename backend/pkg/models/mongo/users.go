package mongo

import "go.mongodb.org/mongo-driver/mongo"

type UserModel struct {
	C *mongo.Collection
}
