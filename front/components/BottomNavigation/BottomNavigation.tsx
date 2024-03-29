import { PropsWithChildren } from 'react';
import { Group, Stack, Text } from '@mantine/core';
import { IconProps } from './BottomNavigation.types';
import Link from 'next/link';

export const NavigationButton: React.FC<IconProps> = ({ title, icon, to, active }) => {
    const Icon = icon;
    const color = active ? '#005bff' : 'rgba(0,26,52,.6)';

    return (
        <Link
            href={to}
            style={{ textDecoration: 'none' }}
        >
            <Stack
                gap={0}
                style={{ height: '100%' }}
                justify="center"
                align="center"
            >
                <Icon
                    size={22}
                    color={color}
                />
                <Text
                    c={color}
                    size="sm"
                    fw={600}
                    style={{ textDecoration: 'none' }}
                >
                    {title}
                </Text>
            </Stack>
        </Link>
    );
};

const BottonNavigation: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Group
            grow
            style={{ height: '100%' }}
        >
            {children}
        </Group>
    );
};

export default BottonNavigation;
