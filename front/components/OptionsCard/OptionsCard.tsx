'use client';

import { Button, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';

interface OptionsCardProps {
    title: string;
    options: string[];
}

const OptionsCard: React.FC<OptionsCardProps> = ({ title, options }) => {
    const [activeOption, setActiveOption] = useState(options[0]);
    return (
        <Stack>
            <Text
                fw={600}
                size="sm"
            >
                {title}
            </Text>
            <Group>
                {options.map((option, i) => {
                    return (
                        <Button
                            key={i}
                            variant={activeOption === option ? 'outline' : 'default'}
                            onClick={() => setActiveOption(option)}
                        >
                            {option}
                        </Button>
                    );
                })}
            </Group>
        </Stack>
    );
};

export default OptionsCard;
