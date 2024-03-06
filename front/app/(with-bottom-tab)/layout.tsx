'use client';

import BottonNavigation, { NavigationButton } from '@/components/BottomNavigation/BottomNavigation';
import Page from '@/components/Page/Page';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { AiOutlineHome, AiOutlineUnorderedList, AiOutlineShoppingCart } from 'react-icons/ai';
import { MdFavoriteBorder, MdPersonOutline } from 'react-icons/md';

interface BottomTabLayoutProps {}

const bottomTabs = [
    { title: 'Басты', icon: AiOutlineHome, to: '/' },
    { title: 'Санаттар', icon: AiOutlineUnorderedList, to: '/categories' },
    { title: 'Қоржын', icon: AiOutlineShoppingCart, to: '/cart' },
    { title: 'Таңдаулы', icon: MdFavoriteBorder, to: '/favorites' },
    // { title: 'Профиль', icon: MdPersonOutline, to: '/profile' },
];

const BottomTabLayout: React.FC<PropsWithChildren<BottomTabLayoutProps>> = ({ children }) => {
    const pathname = usePathname();
    return (
        <Page
            bottomNavigation={
                <BottonNavigation>
                    {bottomTabs.map((tab) => {
                        const regex = new RegExp(`^${tab.to}$`);
                        const isActive = regex.test(pathname);

                        return (
                            <NavigationButton
                                icon={tab.icon}
                                to={tab.to}
                                title={tab.title}
                                active={isActive}
                            />
                        );
                    })}
                </BottonNavigation>
            }
        >
            {children}
        </Page>
    );
};

export default BottomTabLayout;
