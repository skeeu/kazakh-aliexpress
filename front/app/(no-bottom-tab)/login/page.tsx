'use client';

import InputContainer from '@/features/signup/components/InputContainer/InputContainer';
import PageBackground from '@/features/signup/components/PageBackground/PageBackground';
import { api } from '@/lib/api';
import { Button, Highlight, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = ({}) => {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (value && /^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value && value.length === 6 ? null : 'Invalid password'),
        },
    });

    const onLogin = async () => {
        const error = form.validate();
        if (error.hasErrors) {
            return;
        }
        try {
            const res = await api.post('/v1/login', {
                password: form.values.password,
                email: form.values.email,
            });
            const jwt = res.data['Token'];
            localStorage.setItem('token', jwt);
            notifications.show({
                title: 'Congratulation!',
                message: 'You sucessfully sign in! 🤥',
            });
            router.replace('/');
        } catch (e) {
            const res = e.response;
            if (res.status === 401) {
                form.setFieldError('password', 'Invalid password');
            }
            console.log(res.status);
            console.log(12313, e);
        }
    };

    return (
        <PageBackground>
            <InputContainer>
                <form onSubmit={form.onSubmit(onLogin)}>
                    <Stack gap={35}>
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

                        <Stack gap={35}>
                            <Stack gap={4}>
                                <TextInput
                                    label="Email"
                                    placeholder="example@email.com"
                                    {...form.getInputProps('email')}
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
                            >
                                Login
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </InputContainer>
        </PageBackground>
    );
};

export default LoginPage;
