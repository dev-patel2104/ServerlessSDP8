import { Flex } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';

function NavBar() {
  const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });

  return (
    isMobile ?
      <Flex as="nav" alignItems="center" justify="space-between" h="10vh" w="100%" backgroundColor="#050A30">
        Mobile Navbar
      </Flex>
      :
      <Flex as="nav" alignItems="center" justify="space-between" h="10vh" w="100%" backgroundColor="#050A30">
        Desktop Navbar
      </Flex>
  );
}

export default NavBar;