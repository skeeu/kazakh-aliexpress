'use client';

import Page from '@/components/Page/Page';
import { api } from '@/lib/api';
import { Item } from '@/types';
import { parseJwt } from '@/utils';
import { ActionIcon, Button, Checkbox, Flex, Group, Image, NumberInput, NumberInputHandlers, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
});

interface CartPageProps {}

type CartItem = {
    Item: Item;
    Quantity: number;
};

const CartPage: React.FC<CartPageProps> = ({}) => {
    const token = localStorage.getItem('token');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const handlersRef = useRef<NumberInputHandlers>(null);

    const fetchCart = async (token: string) => {
        const payload = parseJwt(token);
        const res = await api.get(`/v1/users/${payload.userId}/cart`, {
            headers: {
                'X-Auth': token,
            },
        });
        if (res.status === 200) {
            setCart(res.data);
            setSelected(res.data.map((i) => i.Item.ID));
        }
        console.log(res, 123132);
    };

    const incerement = async (item: Item, token: string) => {
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
        if (res.status === 202) {
            handlersRef.current?.increment();
            fetchCart(token);
        }
        console.log(res);
    };
    const decrement = async (token: string) => {
        const payload = parseJwt(token);
        const res = await api.delete(`/v1/users/${payload.userId}/cart`, {
            headers: {
                'X-Auth': token,
            },
        });
        if (res.status === 200) {
            setCart(res.data);
            setSelected(res.data.map((i) => i.Item.ID));
        }
        console.log(res);
    };

    useEffect(() => {
        if (token) {
            fetchCart(token);
        }
    }, []);

    if (cart.length > 0) {
        return (
            <Page
                header={
                    <Flex
                        h={'100%'}
                        p={22}
                        align="center"
                    >
                        <Title
                            fw={700}
                            size="h2"
                        >
                            Қоржын
                        </Title>
                    </Flex>
                }
            >
                <Checkbox.Group
                    value={selected}
                    onChange={setSelected}
                    px="sm"
                >
                    {cart.map((it) => {
                        return (
                            <Group
                                key={it.Item.ID}
                                wrap="nowrap"
                                align="flex-start"
                            >
                                <Group
                                    align="center"
                                    wrap="nowrap"
                                >
                                    <Checkbox value={it.Item.ID} />
                                    <Image
                                        w="64px"
                                        h="64px"
                                        src={it.Item.Photos[0]}
                                    />
                                </Group>
                                <Stack gap={8}>
                                    <Text
                                        bg="red"
                                        fw={700}
                                        size="sm"
                                        display="inline-block"
                                        w="fit-content"
                                        c="white"
                                        p="6px"
                                        style={{ borderRadius: '12px' }}
                                    >
                                        {formatter.format(it.Item.Price)}
                                    </Text>
                                    <Text
                                        fw={500}
                                        size="sm"
                                        lineClamp={3}
                                    >
                                        {it.Item.ItemName}
                                    </Text>
                                    <Group wrap="nowrap">
                                        <ActionIcon onClick={() => handlersRef.current?.decrement()}>
                                            <FaMinus />
                                        </ActionIcon>
                                        <NumberInput
                                            hideControls
                                            handlersRef={handlersRef}
                                            step={1}
                                            min={1}
                                            w="52px"
                                            value={it.Quantity}
                                            // defaultValue={it.Quantity}
                                        />
                                        <ActionIcon onClick={() => incerement(it.Item, token)}>
                                            <FaPlus />
                                        </ActionIcon>
                                    </Group>
                                </Stack>
                            </Group>
                        );
                    })}
                </Checkbox.Group>
                <Group
                    justify="space-between"
                    p={20}
                    my={16}
                >
                    <Title
                        fw={700}
                        size="h3"
                    >
                        Жалпы құны
                    </Title>
                    {formatter.format(
                        selected
                            .map((s) => {
                                const item = cart.find((c) => c.Item.ID === s);
                                return item?.Item.Price * item?.Quantity;
                            })
                            .reduce((a, b) => a + b, 0)
                    )}
                </Group>
            </Page>
        );
    }
    return (
        <Page
            headerOptions={{ height: 40 }}
            header={
                <Flex
                    justify="center"
                    align="center"
                    h="100%"
                >
                    <Title
                        size="md"
                        ta="center"
                    >
                        Корзина
                    </Title>
                </Flex>
            }
        >
            <Stack align="center">
                <Title size="md">Корзина пуста</Title>
                {token ? (
                    <>
                        <Text
                            c="rgba(0, 26, 52, 0.6)"
                            ta="center"
                        >
                            Воспользуйтесь поиском, чтобы найти всё, что нужно
                        </Text>
                        <Button>Начать покупки</Button>
                    </>
                ) : (
                    <>
                        <Text
                            c="rgba(0, 26, 52, 0.6)"
                            ta="center"
                        >
                            Воспользуйтесь поиском, чтобы найти всё, что нужно. Если в Корзине были товары, войдите, чтобы посмотреть список
                        </Text>
                        <Link href={{ pathname: '/login' }}>
                            <Button>Войти</Button>
                        </Link>
                    </>
                )}
            </Stack>
        </Page>
    );
};

export default CartPage;
