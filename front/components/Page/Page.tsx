'use client';

import { PropsWithChildren } from 'react';
import { PageProps } from './Page.types';
import { AppShell } from '@mantine/core';

const Page: React.FC<PropsWithChildren<PageProps>> = ({ children, bottomNavigation, header, headerOptions, footerOptions }) => {
    return (
        <AppShell
            header={headerOptions || { height: 50 }}
            footer={footerOptions || { height: 50 }}
        >
            {header && <AppShell.Header>{header}</AppShell.Header>}
            {children && <AppShell.Main bg="#f7f8f9">{children}</AppShell.Main>}
            {bottomNavigation && <AppShell.Footer>{bottomNavigation}</AppShell.Footer>}
        </AppShell>
    );
};

export default Page;
