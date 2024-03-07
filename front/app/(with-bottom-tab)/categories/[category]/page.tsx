'use client';

import { Item as ItemT } from '@/types';
import { Button, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import React from 'react';
import Item from '@/components/Item/Item';
import Link from 'next/link';

type Params = {
    category: string;
};

interface CategoryPageProps {
    params: Params;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
    const [items, setItems] = useState<ItemT[]>([]);

    const fetchItems = async () => {
        const res = await api.get(`/v1/categories/${params.category}`);
        console.log(res.data, 123123);
        if (res.status === 200) {
            setItems(res.data || []);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    if (items.length === 0) {
        return (
            <Stack align="center">
                <Title size="md">Товаров этой категории нет</Title>
                <Text
                    c="rgba(0, 26, 52, 0.6)"
                    ta="center"
                >
                    Воспользуйтесь поиском, чтобы найти всё, что нужно
                </Text>
                <Link href={{ pathname: '/' }}>
                    <Button>Начать покупки</Button>
                </Link>
            </Stack>
        );
    }

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

export default CategoryPage;
