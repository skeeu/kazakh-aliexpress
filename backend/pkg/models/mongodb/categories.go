package mongodb

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"kazakh-aliexpress/backend/pkg/models"
	"time"
)

type CategoryModel struct {
	C *mongo.Collection
}

func NewCategoryModel(c *mongo.Collection) *CategoryModel {
	return &CategoryModel{C: c}
}

func (m *CategoryModel) GetAll() ([]*models.Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	findOptions := options.Find().SetSort(bson.D{{"category_name", 1}})

	cursor, err := m.C.Find(ctx, bson.D{}, findOptions)
	if err != nil {
		return nil, err
	}

	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			err = models.ErrNoRecord
			return
		}
	}(cursor, ctx)

	var categories []*models.Category

	for cursor.Next(ctx) {
		var category models.Category
		if err := cursor.Decode(&category); err != nil {
			return nil, err
		}
		categories = append(categories, &category)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}

func (m *CategoryModel) CategoryExists(categoryName string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	count, err := m.C.CountDocuments(ctx, bson.M{"category_name": categoryName})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (m *CategoryModel) CategoryExistsById(category_id string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(category_id)
	if err != nil {
		return false, err
	}
	count, err := m.C.CountDocuments(ctx, bson.M{"_id": objID})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
