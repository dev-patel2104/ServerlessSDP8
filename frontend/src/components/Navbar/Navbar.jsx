import { Button, Flex } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

function NavBar() {
  const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });

  return (
    isMobile ?
      <Flex as="nav" alignItems="center" justify="space-between" h="10vh" w="100%" backgroundColor="#050A30">
        Mobile Navbar
      </Flex>
      :
      <Flex alignItems="center" as="nav" h="10vh" w="100%" backgroundColor="#050A30">
      <Flex flex="1" ml="4">
      <Link to="/"><div>ReserveTable</div></Link>
      </Flex>
      <Flex mr="4">
        <Button as={Link} to="/user/login" colorScheme='teal' variant='outline' mr="2">Login</Button>
        <Button as={Link} to="/user/signup" colorScheme='teal' variant='outline'>Signup</Button>
      </Flex>
    </Flex>
  );
}

export default NavBar;