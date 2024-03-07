'use client';

import Page from '@/components/Page/Page';
import { api } from '@/lib/api';
import { parseJwt } from '@/utils';
import { Flex, Group, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { MdFavorite } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';
import Item from '@/components/Item/Item';

interface FavoritesPageProps {}

const FavoritesPage: React.FC<FavoritesPageProps> = ({}) => {
    const token = localStorage.getItem('token');
    const [favorites, setFavorites] = useState(undefined);

    const fetchFavorites = async (token: string) => {
        console.log(parseJwt(token).userId);
        const payload = parseJwt(token);
        const res = await api.get(`/v1/users/${payload.userId}/favorites`, {
            headers: {
                'X-Auth': token,
            },
        });
        setFavorites(res.data);
    };

    useEffect(() => {
        if (token) {
            fetchFavorites(token);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites || []));
    }, [favorites]);

    return (
        <Page
            headerOptions={{ height: 60 }}
            header={
                <Flex
                    align="center"
                    justify="center"
                    h="100%"
                >
                    <TextInput
                        leftSection={<IoIosSearch size={20} />}
                        variant="filled"
                        size="md"
                        radius="lg"
                        w="90%"
                        placeholder="Искать на KazAli"
                    />
                </Flex>
            }
        >
            {favorites && favorites.length > 0 ? (
                <SimpleGrid
                    cols={{ base: 2, lg: 6 }}
                    spacing="lg"
                    px="md"
                >
                    {favorites.map((item) => {
                        return (
                            <Item
                                key={item.ID}
                                item={item}
                            />
                        );
                    })}
                </SimpleGrid>
            ) : (
                <Stack align="center">
                    <Title size="md">В избранном пусто</Title>
                    <Group gap={6}>
                        <Text
                            c="rgba(0, 26, 52, 0.6)"
                            ta="center"
                        >
                            Добавляйте товары с помощью
                        </Text>
                        <MdFavorite
                            size={32}
                            fill={'#3967a7'}
                        />
                    </Group>
                </Stack>
            )}
        </Page>
    );
};

export default FavoritesPage;
