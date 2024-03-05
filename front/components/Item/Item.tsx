import { Carousel } from '@mantine/carousel';
import { Group, Image, Stack, Text } from '@mantine/core';
import { ItemProps } from './Item.types';
import '@mantine/carousel/styles.css';
import classes from './Item.module.css';
import { FaStar } from 'react-icons/fa';

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
    return (
        <Stack key={item._id.toString()}>
            <Carousel
                withIndicators
                withControls={false}
                classNames={classes}
                slideSize="100%"
                loop
            >
                {item.photos.map((photo, i) => (
                    <Carousel.Slide>
                        <Image
                            src={photo}
                            style={{ borderRadius: '16px' }}
                        />
                    </Carousel.Slide>
                ))}
            </Carousel>
            <Stack gap={1}>
                <Text
                    fw={700}
                    lts={-1}
                >
                    {formatter.format(item.price)}
                </Text>
                <Text
                    fw={400}
                    style={{ fontSize: 14 }}
                    truncate
                >
                    {item.item_name}
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
