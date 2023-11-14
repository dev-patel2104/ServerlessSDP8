import { Flex, Button, Box, Image, Divider, Text } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { theme } from "../../theme";
import { Link } from "react-router-dom";
import user_logo from "../../assets/user_logo.svg";
import partner_logo from "../../assets/chef_logo.svg";
import admin_logo from "../../assets/admin_logo.svg";

function LoginPage() {
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
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Flex
        w="100%"
        height="60vh"
        maxW="700px"
        p="10"
        borderRadius="lg"
        backgroundColor={theme.secondaryBackground}
        flexDir="row"
        alignItems="center"
      >
        <Flex flexDir="column">
          <Box display={{ base: "none", md: "block" }}>
            <Image src={user_logo} alt="Login Image" width='200px' height='350px'/>
          </Box>
          <Button
            mt="1"
            variant="outline"
            as={Link}
            to="/user/login"
            _hover={{ backgroundColor: theme.primaryBackground }}
            color={theme.accent}
            borderColor={theme.accent}
          >
            User Login
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
        <Flex flexDir="column">
          <Box display={{ base: "none", md: "block" }}>
            <Image src={partner_logo} alt="Login Image" width='200px' height='350px'/>
          </Box>
          <Button
            mt="1"
            variant="outline"
            as={Link}
            to="/partner/login"
            _hover={{ backgroundColor: theme.primaryBackground }}
            color={theme.accent}
            borderColor={theme.accent}
          >
            Partner Login
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
        <Flex flexDir="column">
          <Box display={{ base: "none", md: "block" }}>
            <Image src={admin_logo} alt="Login Image" width='200px' height='350px'/>
          </Box>
          <Button
            mt="1"
            variant="outline"
            as={Link}
            to="/admin/login"
            _hover={{ backgroundColor: theme.primaryBackground }}
            color={theme.accent}
            borderColor={theme.accent}
          >
            Admin Login
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default LoginPage;
