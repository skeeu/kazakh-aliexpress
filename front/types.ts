import { ObjectId } from 'bson';

export type Category = {
    _id: ObjectId;
    category_name: string;
};

export type Item = {
    _id: ObjectId;
    item_name: string;
    price: number;
    photos: string[];
    categories: Category[];
};
