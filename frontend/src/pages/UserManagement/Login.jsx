import {
  Flex,
  Input,
  Button,
  Text,
  Box,
  Image,
  FormControl,
} from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import logo from "../../assets/login.svg";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  function handleSubmit() {
    alert("Entered user name is " + email+" and password is " + password);
  }
  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });
  return isMobile ? (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor="#000C66"
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      Mobile Login Page
    </Flex>
  ) : (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor="#000C66"
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Flex
        w="100%"
        maxW="800px"
        p="10"
        borderRadius="lg"
        backgroundColor="black"
        flexDir="row"
        alignItems="center"
      >
        <Box flex="3" display={{ base: "none", md: "block" }} mr="4">
          <Image src={logo} alt="Login Image" />
        </Box>
        <Flex flex="4" flexDir="column">
          <Flex justify="space-between" alignItems="center" mb="4">
            <Text fontSize="30px" color="white">
              Sign In
            </Text>
            <Text as={Link} to="/user/passreset" fontSize="sm" color="blue.500">
              Forgot Password?
            </Text>
          </Flex>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Input
                color="white"
                placeholder="Email"
                mb="4"
                type="email"
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
                required
              />
              <Input
                color="white"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
                mb="4"
                required
              />
              <Flex justify="space-between" alignItems="center" mb="4">
                <Button colorScheme="teal" variant="outline" type="submit">
                  Sign In
                </Button>
                <Text
                  as={Link}
                  to="/user/signup"
                  fontSize="sm"
                  color="blue.500"
                >
                  No account? Sign Up
                </Text>
              </Flex>
            </FormControl>
          </form>
          <Button colorScheme="blue" variant="outline">
            Sign In with Google
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Login;
