package mongodb

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func (m *ItemModel) GetItemsByCategoryName(categoryName string, page, pageSize int) ([]*models.Item, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	skip := (page - 1) * pageSize

	matchStage := bson.D{
		{"$match", bson.D{
			{"categories", bson.D{
				{"$elemMatch", bson.D{{"category_name", categoryName}}},
			}},
		}},
	}

	skipStage := bson.D{{"$skip", skip}}
	limitStage := bson.D{{"$limit", pageSize}}

	cursor, err := m.C.Aggregate(ctx, mongo.Pipeline{matchStage, skipStage, limitStage})
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

func (m *ItemModel) GetItem(id string) (*models.Item, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var item *models.Item

	err = m.C.FindOne(ctx, bson.M{"_id": objID}).Decode(&item)
	if err != nil {
		return nil, err
	}

	return item, nil
}

func (m *ItemModel) ItemExists(itemId primitive.ObjectID) (bool, error) {
	var result bson.M
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := m.C.FindOne(ctx, bson.M{"_id": itemId}).Decode(&result)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

func (m *ItemModel) FindByID(itemId primitive.ObjectID) (*models.Item, error) {
	var item *models.Item
	err := m.C.FindOne(context.TODO(), bson.M{"_id": itemId}).Decode(&item)
	return item, err
}
