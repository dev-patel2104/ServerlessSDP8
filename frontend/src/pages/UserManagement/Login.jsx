import {
  Flex,
  Input,
  Button,
  Text,
  Box,
  Image,
  FormControl,
  Divider,
} from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import logo from "../../assets/login.svg";
import { useState } from "react";
import { theme } from '../../theme';

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  function handleSubmit() {
    alert("Entered user name is " + email + " and password is " + password);
  }
  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });
  return isMobile ? (
    <Flex
      w="100%"
      minHeight="100vh"
      backgroundColor={theme.primaryBackground}
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      Mobile Login Page
    </Flex>
  ) : (
    <Flex
      w="100%"
      minHeight="100vh"
      backgroundColor={theme.primaryBackground}
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Flex
        w="100%"
        height="60vh"
        maxW="800px"
        p="10"
        borderRadius="lg"
        backgroundColor={theme.secondaryBackground}
        flexDir="row"
        alignItems="center"
      >
        <Flex flex="3" flexDir="column">
          <Box flex="3" display={{ base: "none", md: "block" }}>
            <Image src={logo} alt="Login Image" />
          </Box>
          <Button mt="4" variant="outline" as={Link} to="/" _hover={{backgroundColor: theme.primaryBackground}} color={theme.accent} borderColor={theme.accent}>
            Home Page
          </Button>
        </Flex>
        <Divider orientation="vertical" mr='4' ml='4' borderColor={theme.accent} borderWidth="1px" borderRadius="30px"/>
        <Flex flex="4" flexDir="column">
          <Flex justify="space-between" alignItems="center" mb="4">
            <Text fontSize="30px" color={theme.accent}>
              Sign In
            </Text>
            <Text as={Link} to="/user/passreset" fontSize="sm" color={theme.accent}>
              Forgot Password?
            </Text>
          </Flex>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Input
                color={theme.accent}
                placeholder="Email"
                mb="4"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
                style={{
                  borderColor: theme.accent
                }}
                _placeholder={{
                  color: theme.accent
                }}
              />
              <Input
                color={theme.accent}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                mb="4"
                required
                style={{
                  borderColor: theme.accent
                }}
                _placeholder={{
                  color: theme.accent
                }}
              />
              <Flex justify="space-between" alignItems="center" mb="4">
                <Button variant="outline" type="submit" _hover={{backgroundColor: theme.primaryBackground}} color={theme.accent} borderColor={theme.accent}>
                  Sign In
                </Button>
                <Text
                  as={Link}
                  to="/user/signup"
                  fontSize="sm"
                  color={theme.accent}
                >
                  No account? Sign Up
                </Text>
              </Flex>
            </FormControl>
          </form>
          <Button variant="outline" _hover={{backgroundColor: theme.primaryBackground}} color={theme.accent} borderColor={theme.accent}>
            Sign In with Google
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Login;
