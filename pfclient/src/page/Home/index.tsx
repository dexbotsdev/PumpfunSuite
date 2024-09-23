import { Title, Text, Anchor, Center } from '@mantine/core';
import   './Home.module.css';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Group, Button } from '@mantine/core';

export function Home() {

  const { login, register } = useKindeAuth();


  return (
    <>
      <Title className='title' ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'green', to: 'blue' }}>
          PF-Verse  
        </Text>
      </Title>
      <Text variant="gradient" ta="center" size="lg" maw={580} mx="auto" mt="xl" gradient={{ from: 'red', to: 'violet' }}>
        PF-Verse is the one stop tool to launch your pftoken as a bundle.{' '} <br />
        <Anchor href="/signup" size="lg">
          We are Here to Stay
        </Anchor>
        . Signup To get started .
      </Text>
      <br /><br />
      <Center  h={100} >

      <Group >
        <Button variant="gradient"
      gradient={{ from: 'cyan', to: 'green', deg: 143 }} onClick={() => register()}  >Sign up</Button>
        <Button variant="gradient"
      gradient={{ from: 'grape', to: 'orange', deg: 143 }} onClick={() => login()} >Sign In</Button>
      </Group>
      </Center>

    </>
  );
}
