import BottonNavigation, { NavigationButton } from '@/components/BottomNavigation/BottomNavigation';
import Page from '@/components/Page/Page';
import { PropsWithChildren } from 'react';
import { AiOutlineHome, AiOutlineUnorderedList, AiOutlineShoppingCart } from 'react-icons/ai';
import { MdFavoriteBorder, MdPersonOutline } from 'react-icons/md';

interface BottomTabLayoutProps {}

const BottomTabLayout: React.FC<PropsWithChildren<BottomTabLayoutProps>> = ({ children }) => {
    return (
        <Page
            bottomNavigation={
                <BottonNavigation>
                    <NavigationButton
                        icon={AiOutlineHome}
                        to="/"
                        title="Home"
                    />
                    <NavigationButton
                        icon={AiOutlineUnorderedList}
                        to="/categories"
                        title="Categories"
                    />
                    <NavigationButton
                        icon={AiOutlineShoppingCart}
                        to="/cart"
                        title="Cart"
                    />
                    <NavigationButton
                        icon={MdFavoriteBorder}
                        to="/favorites"
                        title="Favorites"
                    />
                    <NavigationButton
                        icon={MdPersonOutline}
                        to="/profile"
                        title="Profile"
                    />
                </BottonNavigation>
            }
        >
            {children}
        </Page>
    );
};

export default BottomTabLayout;
