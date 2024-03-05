'use client';

import { PropsWithChildren } from 'react';
import { PageProps } from './Page.types';
import { AppShell } from '@mantine/core';

const Page: React.FC<PropsWithChildren<PageProps>> = ({ children, bottomNavigation, header }) => {
    return (
        <AppShell
            header={{ height: 60 }}
            footer={{ height: 60 }}
            padding="md"
        >
            {header && <AppShell.Header>{header}</AppShell.Header>}
            {children}
            {bottomNavigation && <AppShell.Footer>{bottomNavigation}</AppShell.Footer>}
        </AppShell>
    );
};

export default Page;
