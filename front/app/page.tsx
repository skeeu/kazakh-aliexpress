'use client';

import InputContainer from '@/features/signup/components/InputContainer/InputContainer';
import PageBackground from '@/features/signup/components/PageBackground/PageBackground';
import { api } from '@/lib/api';
import { Button, Flex, Highlight, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

interface HomePageProps {}

enum SignupStage {
    enterEmail = 'enterEmail',
    enterCode = 'enterCode',
    enterFullData = 'enterFullData',
}

const HomePage: React.FC<HomePageProps> = ({}) => {
    const [signupStage, setSignupStage] = useState<SignupStage>(SignupStage.enterEmail);

    const form = useForm({
        initialValues: {
            email: '',
            code: '',
            password: '',
            name: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            code: (value) => (value && value.length === 6 ? null : 'Invalid code'),
            password: (value) => (value && value.length === 6 ? null : 'Weak password'),
            name: (value) => (value && value.length === 6 ? null : 'Invalid name'),
        },
    });

    const onSubmit = (props) => {
        console.log(props);
    };

    const processEmailStage = async () => {
        const error = form.validateField('email');
        if (error.hasError) {
            return;
        }

        try {
            await api.post('/v1/signup/email', {
                email: form.values.email,
            });
            notifications.show({
                title: 'Check your email!',
                message: 'We`ve sent registration code to your email! 🤥',
            });
            setSignupStage(SignupStage.enterCode);
        } catch (e) {
            console.log(e);
        }
    };

    const processCodeStage = async () => {
        const error = form.validateField('code');
        if (error.hasError) {
            return;
        }

        try {
            await api.post('/v1/signup/code', {
                // email: form.values.email,
                code: form.values.code,
            });
            // notifications.show({
            //     title: 'Check your email!',
            //     message: 'We`ve sent registration code to your email! 🤥',
            // });
            setSignupStage(SignupStage.enterFullData);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const storedValue = window.localStorage.getItem('user-form');
        if (storedValue) {
            try {
                form.setValues(JSON.parse(window.localStorage.getItem('user-form')!));
            } catch (e) {
                console.log('Failed to parse stored value');
            }
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem('user-form', JSON.stringify(form.values));
    }, [form.values]);

    return (
        <PageBackground>
            <InputContainer>
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <Flex
                        direction="column"
                        gap={35}
                    >
                        <Highlight
                            component="a"
                            href="/"
                            target="_blank"
                            fw={500}
                            size="xl"
                            highlight="kazakh"
                        >
                            Kazakh Aliexpress
                        </Highlight>
                        {signupStage === SignupStage.enterEmail && (
                            <Flex
                                gap={20}
                                direction="column"
                            >
                                <TextInput
                                    label="Email"
                                    placeholder="Email"
                                    {...form.getInputProps('email')}
                                />
                                <Button
                                    type="button"
                                    onClick={processEmailStage}
                                    size="md"
                                >
                                    Signup
                                </Button>
                            </Flex>
                        )}

                        {signupStage === SignupStage.enterCode && (
                            <Flex
                                direction="column"
                                gap={35}
                            >
                                <TextInput
                                    label="Code"
                                    placeholder="Enter code from email"
                                    {...form.getInputProps('code')}
                                />
                                <Button
                                    type="button"
                                    size="md"
                                    onClick={processCodeStage}
                                >
                                    Submit
                                </Button>
                            </Flex>
                        )}

                        {signupStage === SignupStage.enterFullData && (
                            <Flex
                                direction="column"
                                gap={35}
                            >
                                <TextInput
                                    label="Password"
                                    placeholder="Enter your password"
                                    {...form.getInputProps('password')}
                                />
                                <TextInput
                                    label="Name"
                                    placeholder="Alex"
                                    {...form.getInputProps('name')}
                                />
                                <Button
                                    type="button"
                                    size="md"
                                    onClick={() => console.log(form.values)}
                                >
                                    Create Account
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                </form>
            </InputContainer>
        </PageBackground>
    );
};

export default HomePage;
