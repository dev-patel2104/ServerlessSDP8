import {
  Flex,
  Input,
  Button,
  Text,
  Box,
  Image,
  FormControl,
  Divider,
  useToast
} from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import logo from "../../assets/login.svg";
import { useState } from "react";
import { theme } from "../../theme";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function handleGoogleSignIn() {
  signInWithPopup(auth, googleProvider)
  .then(() => {
    toast({
      title: "Success",
      description: "You have been logged in!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/user/profile");
  }).catch((error) => {
    if(error.message.includes("popup-closed-by-use")){
      toast({
        title: "Failure!",
        description: "The google popup was closed",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
    else {
      toast({
        title: "Failed!",
        description: "Unable to login please try again later or use email and password!",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
  });
  }

  function handleSubmit(event) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast({
          title: "Success",
          description: "You have been logged in!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/user/profile");
      })
      .catch((error) => {
        if (error.message.includes('auth/invalid-login-credentials')){
          toast({
            title: "Failed!",
            description: "Unable to login, please check your credentials and try again!",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
        else if (error.message.includes('auth/user-not-found')){
          toast({
            title: "Failed!",
            description: "The user was not found, please sign up",
            status: "error",
            duration: 3000,
            isClosable: false,
          });
        }
      });
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
          <Button
            mt="4"
            variant="outline"
            as={Link}
            to="/"
            _hover={{ backgroundColor: theme.primaryBackground }}
            color={theme.accent}
            borderColor={theme.accent}
          >
            Home Page
          </Button>
        </Flex>
        <Divider
          orientation="vertical"
          mr="4"
          ml="4"
          borderColor={theme.accent}
          borderWidth="1px"
          borderRadius="30px"
        />
        <Flex flex="4" flexDir="column">
          <Flex justify="space-between" alignItems="center" mb="4">
            <Text fontSize="30px" color={theme.accent}>
              Sign In
            </Text>
            <Text
              as={Link}
              to="/user/passreset"
              fontSize="sm"
              color={theme.accent}
            >
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
                  borderColor: theme.accent,
                }}
                _placeholder={{
                  color: theme.accent,
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
                  borderColor: theme.accent,
                }}
                _placeholder={{
                  color: theme.accent,
                }}
              />
              <Flex justify="space-between" alignItems="center" mb="4">
                <Button
                  variant="outline"
                  type="submit"
                  _hover={{ backgroundColor: theme.primaryBackground }}
                  color={theme.accent}
                  borderColor={theme.accent}
                >
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
          <Button
            variant="outline"
            onClick={() => {handleGoogleSignIn();}}
            _hover={{ backgroundColor: theme.primaryBackground }}
            color={theme.accent}
            borderColor={theme.accent}
          >
            Sign In with Google
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Login;
