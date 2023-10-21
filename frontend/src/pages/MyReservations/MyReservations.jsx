import { Flex, Text } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';

function MyReservations() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                Mobile Landing Page
            </Flex>
            :
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} alignItems="center" justifyContent="space-evenly">
                <Text color={theme.primaryForeground} fontWeight="bold">Hello World!</Text>
            </Flex>
    );
}

export default MyReservations;