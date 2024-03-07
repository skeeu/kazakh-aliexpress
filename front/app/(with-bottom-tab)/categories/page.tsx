'use client';

import Page from '@/components/Page/Page';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { ActionIcon, Box, Group, SimpleGrid, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

interface CategoriesPageProps {}

const CategoriesPage: React.FC<CategoriesPageProps> = ({}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();

    const fetchCategories = async () => {
        const res = await api.get('/v1/categories');
        console.log(res.data);
        setCategories(res.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Page headerOptions={{ height: 0 }}>
            <Stack py={18}>
                {categories.map((category) => {
                    return (
                        <Group
                            key={category.ID}
                            justify="space-between"
                            bg="white"
                            px={10}
                            py={16}
                            style={{ borderRadius: 16 }}
                            onClick={() => router.push(`/categories/${category.CategoryName}`)}
                        >
                            <Title size="h4">{category.CategoryName}</Title>
                            <ActionIcon style={{ flexShrink: 'none', flexBasis: '10%' }}>
                                <FaChevronRight />
                            </ActionIcon>
                        </Group>
                    );
                })}
            </Stack>
        </Page>
    );
};

export default CategoriesPage;
