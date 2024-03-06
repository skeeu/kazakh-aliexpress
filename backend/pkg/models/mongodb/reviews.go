package mongodb

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ReviewModel struct {
	C *mongo.Collection
}

func NewReviewModel(c *mongo.Collection) *ReviewModel {
	return &ReviewModel{C: c}
}

func (m *ReviewModel) CreateReview(user_id primitive.ObjectID, rating float64, comment string) (interface{}, error) {
	insert := bson.M{
		"user_id": user_id,
		"rating":  rating,
		"comment": comment,
	}

	result, err := m.C.InsertOne(context.Background(), insert)
	if err != nil {
		return nil, err
	}

	return result.InsertedID, nil
}
