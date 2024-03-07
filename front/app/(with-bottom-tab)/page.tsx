'use client';

import Item from '@/components/Item/Item';
import { api } from '@/lib/api';
import { Item as ItemT } from '@/types';
import { SimpleGrid } from '@mantine/core';
import { useEffect, useState } from 'react';

interface HomePageProps {}

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
