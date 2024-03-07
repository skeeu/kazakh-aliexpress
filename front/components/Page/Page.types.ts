import { AppShellFooterConfiguration, AppShellHeaderConfiguration } from '@mantine/core';

export type PageProps = {
    bottomNavigation?: JSX.Element;
    goBackTo?: string;
    header?: React.ReactNode;
    headerOptions?: AppShellHeaderConfiguration;
    footerOptions?: AppShellFooterConfiguration;
    showBackButton?: boolean;
};
