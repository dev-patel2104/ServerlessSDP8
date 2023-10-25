import {
  Flex,
  Image,
  Box,
  Text,
  Input,
  Button,
  FormControl,
  Divider,
  useToast
} from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import logo from "../../assets/signup.svg";
import { useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { theme } from "../../theme";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

function Signup() {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [disabled, setDisabled] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        //call AddEmailToDynamoDB API here
        toast({
          title: "Success!",
          description: "Your account was successfully created!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem('foodvaganzaUser', auth.currentUser.email);
        navigate("/user/profile");
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "The account wasn't created, please try again!",
          status: "error",
          duration: 3000,
          isClosable: false,
        });
      });
  }

  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });

  return isMobile ? (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      Mobile Signup Page
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
        maxW="800px"
        height="70vh"
        p="10"
        borderRadius="lg"
        backgroundColor={theme.secondaryBackground}
        flexDir="row"
        alignItems="center"
      >
        <Flex flex="3" flexDir="column">
          <Box display={{ base: "none", md: "block" }}>
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
        <Divider orientation="vertical" mr="4" ml="4" borderColor={theme.accent} borderWidth="1px" borderRadius="30px"/>
        <Flex flex="4" flexDir="column">
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Flex justify="space-between" alignItems="center" mb="4">
                <Text fontSize="30px" color={theme.accent}>
                  Sign Up
                </Text>
                <Text
                  as={Link}
                  to="/user/login"
                  fontSize="sm"
                  color={theme.accent}
                >
                  Have an account? Sign In
                </Text>
              </Flex>
              <Input
                color={theme.accent}
                placeholder="Enter Email"
                mb="4"
                type="email"
                required
                value={email}
                style={{
                  borderColor: theme.accent,
                }}
                _placeholder={{
                  color: theme.accent,
                }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                color={theme.accent}
                type="password"
                required
                value={password}
                style={{
                  borderColor: theme.accent,
                }}
                _placeholder={{
                  color: theme.accent,
                }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter Password"
                mb="4"
              />
              <Input
                color={theme.accent}
                type="password"
                required
                placeholder="Re-enter Password"
                style={{
                  borderColor: theme.accent,
                }}
                _placeholder={{
                  color: theme.accent,
                }}
                value={passwordAgain}
                onChange={(e) => {
                  setPasswordAgain(e.target.value);
                }}
                mb="4"
              />
              <PasswordChecklist
                rules={[
                  "minLength",
                  "specialChar",
                  "number",
                  "capital",
                  "match",
                ]}
                minLength={8}
                value={password}
                valueAgain={passwordAgain}
                style={{ color: theme.accent }}
                onChange={(isValid) => {
                  setDisabled(!isValid);
                }}
              />
              <Flex justify="space-between">
                <Button
                  variant="outline"
                  isDisabled={disabled}
                  type="submit"
                  mt="4"
                  _hover={{ backgroundColor: theme.primaryBackground }}
                  color={theme.accent}
                  borderColor={theme.accent}
                >
                  Sign Up
                </Button>
              </Flex>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Signup;
