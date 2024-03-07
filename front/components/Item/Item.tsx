'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Group, Image, Stack, Text } from '@mantine/core';
import { ItemProps } from './Item.types';
import '@mantine/carousel/styles.css';
import classes from './Item.module.css';
import { FaStar } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { api } from '@/lib/api';
import { parseJwt } from '@/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
});

const Item: React.FC<ItemProps> = ({ item }) => {
    const token = localStorage.getItem('token');
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(
        localStorage.getItem('favorites') && JSON.parse(localStorage.getItem('favorites')).some((it) => it.ID === item.ID)
    );

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
                setIsFavorite(true);
            }
        } else {
            const res = await api.delete(`/v1/users/${tokenPayload.userId}/favorites/${item.ID}`, {
                headers: {
                    'X-Auth': token,
                },
            });
            if (res.status === 202) {
                setIsFavorite(false);
            }
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('favorites')) {
            localStorage.setItem('favorites', JSON.stringify([]));
        }

        let favorites = JSON.parse(localStorage.getItem('favorites'));
        if (!isFavorite) {
            favorites = favorites.map((fav) => fav !== item.ID);
        } else {
            favorites.push(item);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [isFavorite]);

    return (
        <Stack onClick={() => router.push(`/item/${item.ID}`)}>
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
                        style={{ zIndex: 1 }}
                        onClick={() => onClickFavorite(token)}
                    >
                        <MdFavorite
                            size={32}
                            fill={isFavorite ? 'red' : '#3967a7'}
                        />
                    </Box>
                )}
            </Box>
            <Stack gap={3}>
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
            </Stack>
        </Stack>
    );
};

export default Item;
