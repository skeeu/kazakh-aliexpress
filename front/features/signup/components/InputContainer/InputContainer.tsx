import { Box } from '@mantine/core';
import { PropsWithChildren } from 'react';
import classes from './InputContainer.module.css';

interface InputContainerProps {}

const InputContainer: React.FC<PropsWithChildren<InputContainerProps>> = ({ children }) => {
  return <Box className={classes.container}>{children}</Box>;
};

export default InputContainer;
