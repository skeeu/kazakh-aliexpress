'use client';

import InputContainer from '@/features/signup/components/InputContainer/InputContainer';
import PageBackground from '@/features/signup/components/PageBackground/PageBackground';
import { api } from '@/lib/api';
import { Button, Flex, Highlight, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SignupPageProps {}

enum SignupStage {
    enterEmail = 'enterEmail',
    enterCode = 'enterCode',
    enterFullData = 'enterFullData',
}

const SignupPage: React.FC<SignupPageProps> = ({}) => {
    const router = useRouter();
    const [signupStage, setSignupStage] = useState<SignupStage>(SignupStage.enterEmail);

    const form = useForm({
        initialValues: {
            email: '',
            code: '',
            password: '',
            name: '',
        },

        validate: {
            email: (value) => (value && /^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            code: (value) => (value && value.length === 6 ? null : 'Invalid code'),
            password: (value) => (value && value.length === 6 ? null : 'Weak password'),
            name: (value) =>
                value
                    ? value.length < 2 || value.length > 15
                        ? 'Length must be between 2 and 15'
                        : !/^[a-zA-Z]+$/.test(value)
                          ? 'Name must contain letter only'
                          : null
                    : 'Please write your name',
        },
    });

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
            const res = e.response;
            if (res.status === 409) {
                notifications.show({
                    title: 'You`re already registered!',
                    message: 'Login to your account! 🤥',
                });
                router.push('/login');
            }
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
                email: form.values.email,
                code: form.values.code,
            });
            setSignupStage(SignupStage.enterFullData);
        } catch (e) {
            const res = e.response;
            if (res.status === 401) {
                form.setFieldError('code', 'Invalid code');
            }
            console.log(res.status);
            console.log(12313, e);
        }
    };
    const processCodeFullDataStage = async () => {
        const error = form.validate();
        if (error.hasErrors) {
            return;
        }

        try {
            const res = await api.post('/v1/signup', {
                name: form.values.name,
                password: form.values.password,
                email: form.values.email,
                // code: form.values.code,
            });
            console.log('s', res);
            notifications.show({
                title: 'Congratulation!',
                message: 'You sucessfully sign up! 🤥',
            });
            router.replace('/login');
        } catch (e) {
            const res = e.response;
            console.log(res.status);
            console.log(12313, e);
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
                <form onSubmit={form.onSubmit(processCodeFullDataStage)}>
                    <Flex
                        direction="column"
                        gap={35}
                    >
                        <Highlight
                            component="a"
                            href="/home"
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
                                <Stack gap={4}>
                                    <TextInput
                                        label="Name"
                                        placeholder="Alex"
                                        {...form.getInputProps('name')}
                                    />
                                    <TextInput
                                        label="Password"
                                        placeholder="Enter your password"
                                        {...form.getInputProps('password')}
                                    />
                                </Stack>
                                <Button
                                    type="submit"
                                    size="md"
                                    // onClick={() => console.log(form.values)}
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

export default SignupPage;
