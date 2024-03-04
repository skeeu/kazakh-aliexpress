import { PropsWithChildren } from 'react';
import { Box } from '@mantine/core';
import classes from './PageBackground.module.css';

interface PageBackgroundProps {}

const PageBackground: React.FC<PropsWithChildren<PageBackgroundProps>> = ({ children }) => {
  return <Box className={classes.wrapper}>{children}</Box>;
};

export default PageBackground;
