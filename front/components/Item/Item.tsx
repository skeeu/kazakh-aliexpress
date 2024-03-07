'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Button, Group, Image, Stack, Text } from '@mantine/core';
import { ItemProps } from './Item.types';
import '@mantine/carousel/styles.css';
import classes from './Item.module.css';
import { FaStar } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { api } from '@/lib/api';
import { parseJwt } from '@/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Item as ItemT } from '@/types';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
});

const Item: React.FC<ItemProps> = ({ item }) => {
    const token = localStorage.getItem('token');
    const router = useRouter();
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites') || '[]'));

    const fetchFavorites = async (token: string) => {
        const payload = parseJwt(token);
        const res = await api.get(`/v1/users/${payload.userId}/favorites`, {
            headers: {
                'X-Auth': token,
            },
        });
        setFavorites(res.data);
    };

    const addToCart = async (item: ItemT, token: string | null | undefined) => {
        if (token) {
            const payload = parseJwt(token);
            const res = await api.patch(
                `/v1/users/${payload.userId}/cart`,
                {
                    itemId: item.ID,
                },
                {
                    headers: {
                        'X-Auth': token,
                    },
                }
            );
            console.log(res);
        }
    };

    const onClickFavorite = async (token: string) => {
        const tokenPayload = parseJwt(token);

        if (!isFavorite) {
            const res = await api.post(
                `/v1/users/${tokenPayload.userId}/favorites`,
                {
                    itemId: item.ID,
                },
                {
                    headers: {
                        'X-Auth': token,
                    },
                }
            );
            if (res.status === 202) {
                fetchFavorites(token);
            }
        } else {
            const res = await api.delete(`/v1/users/${tokenPayload.userId}/favorites/${item.ID}`, {
                headers: {
                    'X-Auth': token,
                },
            });
            if (res.status === 202) {
                fetchFavorites(token);
            }
        }
    };

    return (
        <Stack
            onClick={() => router.push(`/item/${item.ID}`)}
            justify="space-between"
            gap={12}
        >
            <Box pos="relative">
                <Carousel
                    withIndicators
                    withControls={false}
                    classNames={classes}
                    slideSize="100%"
                    loop
                >
                    {item.Photos.map((photo, i) => (
                        <Carousel.Slide key={i}>
                            <Image
                                src={photo}
                                style={{ borderRadius: '16px' }}
                            />
                        </Carousel.Slide>
                    ))}
                </Carousel>
                {token && (
                    <Box
                        pos="absolute"
                        right={6}
                        top={6}
                        style={{ zIndex: 10 }}
                        onClick={() => onClickFavorite(token)}
                    >
                        <MdFavorite
                            size={32}
                            fill={favorites.some((it) => it.ID === item.ID) ? 'red' : '#3967a7'}
                        />
                    </Box>
                )}
            </Box>
            <Stack
                gap={3}
                mt={10}
            >
                <Text
                    fw={700}
                    lts={-1}
                >
                    {formatter.format(item.Price)}
                </Text>
                <Text
                    fw={400}
                    style={{ fontSize: 14 }}
                    lineClamp={2}
                >
                    {item.ItemName}
                </Text>
                <Group
                    gap={4}
                    align="center"
                >
                    <FaStar fill="gold" />
                    <Text
                        c="rgba(0, 26, 52, 0.6)"
                        style={{ fontSize: 12 }}
                    >
                        4.8
                    </Text>
                </Group>
                {token && (
                    <Button
                        fullWidth
                        onClick={() => addToCart(item, token)}
                    >
                        Қоржынға
                    </Button>
                )}
            </Stack>
        </Stack>
    );
};

export default Item;
