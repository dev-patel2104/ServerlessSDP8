import { Flex } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';

function BookTable() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor="#000C66" flexDir="column" alignItems="center" justifyContent="start">
                Mobile Landing Page
            </Flex>
            :
            <Flex w="100%" minHeight="90vh" backgroundColor="#000C66" alignItems="center" justifyContent="space-evenly">
                Desktop Landing Page
            </Flex>
    );
}

export default BookTable;