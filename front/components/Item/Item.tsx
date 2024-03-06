import { Carousel } from '@mantine/carousel';
import { Box, Group, Image, Stack, Text } from '@mantine/core';
import { ItemProps } from './Item.types';
import '@mantine/carousel/styles.css';
import classes from './Item.module.css';
import { FaStar } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { api } from '@/lib/api';
import { parseJwt } from '@/utils';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    // currencySign: '₸',
    currencyDisplay: 'symbol',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const Item: React.FC<ItemProps> = ({ item }) => {
    const token = localStorage.getItem('token');

    const addToFavorites = async (token: string) => {
        const tokenPayload = parseJwt(token);
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
        console.log(res);
    };

    return (
        <Stack>
            <Box pos="relative">
                <Carousel
                    withIndicators
                    withControls={false}
                    classNames={classes}
                    slideSize="100%"
                    loop
                >
                    {item.Photos.map((photo, i) => (
                        <Carousel.Slide>
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
                        onClick={() => addToFavorites(token)}
                    >
                        <MdFavorite
                            size={32}
                            fill="#3967a7"
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
                    // truncate
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
