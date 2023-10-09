import { Flex } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';

function Login() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor="#000C66" flexDir="column" alignItems="center" justifyContent="start">
                Mobile Login Page
            </Flex>
            :
            <Flex w="100%" minHeight="90vh" backgroundColor="#000C66" alignItems="center" justifyContent="space-evenly">
                Desktop Login Page
            </Flex>
    );
}

export default Login;