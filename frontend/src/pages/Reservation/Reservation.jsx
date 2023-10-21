import { Flex, Text } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';
import { useParams } from 'react-router-dom';

function Reservation() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const {reservation_id} = useParams();

    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                Reservation Page
            </Flex>
            :
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} alignItems="center" justifyContent="space-evenly">
                <Text color={theme.primaryForeground} fontWeight="bold">{reservation_id}</Text>
            </Flex>
    );
}

export default Reservation;