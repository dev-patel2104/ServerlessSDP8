import {
  Flex,
  Image,
  Box,
  Text,
  Input,
  Button,
  FormControl,
  Divider
} from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import logo from "../../assets/signup.svg";
import { useState } from "react";
import PasswordChecklist from "react-password-checklist";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [disabled, setDisabled] = useState(true);
  function handleSubmit() {
    alert("Username: " + email + " Password: " + password);
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
      Mobile Signup Page
    </Flex>
  ) : (
    <Flex
      w="100%"
      minHeight="100vh"
      backgroundColor="#000C66"
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Flex
        w="100%"
        maxW="800px"
        height="70vh"
        p="10"
        borderRadius="lg"
        backgroundColor="black"
        flexDir="row"
        alignItems="center"
      >
        <Flex flex="3" flexDir="column">
          <Box display={{ base: "none", md: "block" }} mr="4">
            <Image src={logo} alt="Login Image" />
          </Box>
          <Button mt="4" mr="4" variant="outline" as={Link} to="/">
            Home Page
          </Button>
        </Flex>
        <Divider orientation="vertical" mr='4' ml='4'/>
        <Flex flex="4" flexDir="column">
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Flex justify="space-between" alignItems="center" mb="4">
                <Text fontSize="30px" color="white">
                  Sign Up
                </Text>
                <Text as={Link} to="/user/login" fontSize="sm" color="blue.500">
                  Have an account? Sign In
                </Text>
              </Flex>
              <Input
                color="white"
                placeholder="Enter Email"
                mb="4"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                color="white"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter Password"
                mb="4"
              />
              <Input
                color="white"
                type="password"
                required
                placeholder="Re-enter Password"
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
                style={{ color: "white" }}
                onChange={(isValid) => {
                  setDisabled(!isValid);
                }}
              />
              <Flex justify="space-between">
                <Button
                  colorScheme="teal"
                  variant="outline"
                  isDisabled={disabled}
                  type="submit"
                  mt="4"
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
