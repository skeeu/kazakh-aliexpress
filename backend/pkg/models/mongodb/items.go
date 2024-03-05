package mongodb

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"kazakh-aliexpress/backend/pkg/models"
	"time"
)

type ItemModel struct {
	C *mongo.Collection
}

func NewItemModel(c *mongo.Collection) *ItemModel {
	return &ItemModel{C: c}
}

func (m *ItemModel) GetItemsByCategoryName(categoryName string) ([]*models.Item, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	matchStage := bson.D{
		{"$match", bson.D{
			{"categories", bson.D{
				{"$elemMatch", bson.D{{"category_name", categoryName}}},
			}},
		}},
	}

	cursor, err := m.C.Aggregate(ctx, mongo.Pipeline{matchStage})
	if err != nil {
		return nil, models.ErrNoRecord
	}
	defer cursor.Close(ctx)

	var items []*models.Item
	if err = cursor.All(ctx, &items); err != nil {
		return nil, models.ErrNoRecord
	}

	return items, nil
}
