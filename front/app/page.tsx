'use client';

import InputContainer from '@/features/signup/components/InputContainer/InputContainer';
import PageBackground from '@/features/signup/components/PageBackground/PageBackground';
import { Box, Button, Flex, Highlight, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
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
      // code: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      // code: (value) => (value.length && value.length === 6 ? null : 'Invalid code'),
    },
  });

  const onSubmit = (props) => {
    console.log(props);
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
          <Flex direction="column" gap={35}>
            <Highlight component="a" href="/" target="_blank" fw={500} size="xl" highlight="kazakh">
              Kazakh Aliexpress
            </Highlight>
            {signupStage === SignupStage.enterEmail && (
              <Flex gap={20} direction="column">
                <TextInput label="Email" placeholder="Email" {...form.getInputProps('email')} />
                <Button type="button" onClick={() => form.err} size="md" mt="sm">
                  Signup
                </Button>
              </Flex>
            )}

            {signupStage === SignupStage.enterCode && (
              <Flex direction="column">
                <TextInput
                  label="Code"
                  placeholder="Enter code from email"
                  {...form.getInputProps('code')}
                />
                <Button type="submit" size="md" mt="sm">
                  Submit
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
