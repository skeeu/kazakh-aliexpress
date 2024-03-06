'use client';

import Page from '@/components/Page/Page';
import { api } from '@/lib/api';
import { parseJwt } from '@/utils';
import { Button, Flex, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = ({}) => {
    const token = localStorage.getItem('token');
    const [cart, useCart] = useState();

    const fetchCart = async (token: string) => {
        console.log(parseJwt(token).userId);
        const payload = parseJwt(token);
        const res = await api.get(`/v1/users/${payload.userId}/cart`, {
            headers: {
                'X-Auth': token,
            },
        });
        console.log(res);
    };

    useEffect(() => {
        if (token) {
            fetchCart(token);
        }
    }, []);

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
