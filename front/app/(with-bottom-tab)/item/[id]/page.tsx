'use client';

import Page from '@/components/Page/Page';
import { Item } from '@/types';
import { Carousel } from '@mantine/carousel';
import { Box, Button, Dialog, Group, Image, Loader, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import '@mantine/carousel/styles.css';
import classes from '@/components/Item/Item.module.css';
import { api } from '@/lib/api';
import React from 'react';
import OptionsCard from '@/components/OptionsCard/OptionsCard';
import { parseJwt } from '@/utils';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

type Params = {
    id: string;
};

interface ItemPageProps {
    params: Params;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
});

const ItemPage: React.FC<ItemPageProps> = ({ params }) => {
    const token = localStorage.getItem('token');
    const [opened, { toggle, close }] = useDisclosure(false);
    const [item, setItem] = useState<Item | undefined>(undefined);

    const fetchItem = async () => {
        const res = await api.get(`/v1/item/${params.id}`);
        console.log(res);
        if (res.status === 200) {
            setItem(res.data);
        }
    };

    const addToCart = async (item: Item, token: string | null | undefined) => {
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
        } else {
            toggle();
        }
    };

    useEffect(() => {
        fetchItem();
    }, []);

    if (item === undefined) {
        return (
            <Loader
                size={46}
                w="100%"
                style={{ justifyContent: 'center', display: 'flex' }}
            />
        );
    }
    return (
        <Page headerOptions={{ height: 0 }}>
            <Stack gap={20}>
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
                <Stack px="sm">
                    <Title size="h4">{item.ItemName}</Title>
                    <Paper
                        shadow="sm"
                        radius="md"
                        withBorder
                        p="md"
                    >
                        <Title size="h3">{formatter.format(item.Price)}</Title>
                    </Paper>

                    <Stack>
                        {item.Options.map((o, i) => {
                            console.log(1, o);
                            return (
                                <OptionsCard
                                    key={i}
                                    title={o.Title}
                                    options={o.Options}
                                />
                            );
                        })}
                    </Stack>
                    <Stack>
                        <Title size="h4">Характеристики</Title>
                        <SimpleGrid
                            cols={2}
                            spacing="sm"
                            verticalSpacing="sm"
                        >
                            {item.Infos.map((info, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <Text
                                            fw={500}
                                            size="sm"
                                        >
                                            {info.Title}
                                        </Text>
                                        <Text
                                            fw={500}
                                            size="sm"
                                        >
                                            {info.Content}
                                        </Text>
                                    </React.Fragment>
                                );
                            })}
                        </SimpleGrid>
                    </Stack>
                </Stack>
            </Stack>
            <Box
                p="sm"
                pos="sticky"
                size="xl"
                bottom={50}
            >
                <Button
                    fullWidth
                    onClick={() => addToCart(item, token)}
                >
                    Қоржынға
                </Button>
            </Box>
            <Dialog
                opened={opened}
                withCloseButton
                onClose={close}
                size="lg"
                radius="md"
            >
                <Text
                    size="sm"
                    mb="xs"
                    fw={500}
                >
                    Sign up or Sign in to your account!
                </Text>
                <Group
                    gap={10}
                    justify="space-around"
                >
                    <Link href={{ pathname: '/signup' }}>
                        <Button>Sign up</Button>
                    </Link>
                    <Link href={{ pathname: '/login' }}>
                        <Button>Sign in</Button>
                    </Link>
                </Group>
            </Dialog>
        </Page>
    );
};

export default ItemPage;
