'use client';

import Item from '@/components/Item/Item';
import { api } from '@/lib/api';
import { Category, Item as ItemT } from '@/types';
import { SimpleGrid } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface HomePageProps {}

// const categories: Category[] = [{ _id: '12313', category_name: 'Clothes' }];

// const items: ItemT[] = [
//     {
//         _id: '65e72b88375c87c257b760cd',
//         item_name: 'Long name for jeans from database and api sdsflskdnflsknlfdsknlfdknlsldf;sldf;slkdf;slkdf;slfk',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
//     {
//         _id: '65e72b88375c87c257b760ce',
//         item_name: 'Long name for jeans from database and api',
//         photos: [
//             'https://ae04.alicdn.com/kf/Sb2198669bb2244409e0ed74686df0fccK.jpg_640x640.jpg_.webp',
//             'https://ae04.alicdn.com/kf/S08a5848635734770a6578de2203fcd5aa.jpg_640x640.jpg_.webp',
//         ],
//         price: 3000,
//         categories: categories,
//     },
// ];

const HomePage: React.FC<HomePageProps> = ({}) => {
    const [items, setItems] = useState<ItemT[]>([]);

    const fetchItems = async () => {
        const res = await api.get('/v1/items');
        console.log(res.data);
        setItems(res.data);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <SimpleGrid
            cols={{ base: 2, lg: 6 }}
            spacing="lg"
            p="md"
        >
            {items.map((item) => {
                return (
                    <Item
                        key={item.ID}
                        item={item}
                    />
                );
            })}
        </SimpleGrid>
    );
};

export default HomePage;
