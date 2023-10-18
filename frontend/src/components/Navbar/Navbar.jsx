import { Button, Flex, Text } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { theme } from "../../theme";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function NavBar() {
  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });

  const [loggedIn, setLoggedIn] = useState(null);

  function handleSignout() {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(user);
      } else {
        setLoggedIn(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return isMobile ? (
    <Flex
      as="nav"
      alignItems="center"
      justify="space-between"
      h="10vh"
      w="100%"
      backgroundColor={theme.secondaryBackground}
    >
      Mobile Navbar
    </Flex>
  ) : (
    <Flex
      alignItems="center"
      as="nav"
      h="10vh"
      w="100%"
      backgroundColor={theme.secondaryBackground}
    >
      <Flex flex="1" ml="4">
        <Link to="/">
          <Text color={theme.secondaryForeground} fontWeight="bold">
            Reserve Table
          </Text>
        </Link>
      </Flex>
      {loggedIn ? (
        <>
          <Flex mr="4">
            <Button
              onClick={() => {handleSignout();}}
              _hover={{ backgroundColor: theme.primaryBackground }}
              color={theme.accent}
              borderColor={theme.accent}
              variant="outline"
              mr="2"
            >
              Logout
            </Button>
            <Button
              as={Link}
              to="/user/profile"
              _hover={{ backgroundColor: theme.primaryBackground }}
              color={theme.accent}
              borderColor={theme.accent}
              variant="outline"
            >
              Profile
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Flex mr="4">
            <Button
              as={Link}
              to="/user/login"
              _hover={{ backgroundColor: theme.primaryBackground }}
              color={theme.accent}
              borderColor={theme.accent}
              variant="outline"
              mr="2"
            >
              Login
            </Button>
            <Button
              as={Link}
              to="/user/signup"
              _hover={{ backgroundColor: theme.primaryBackground }}
              color={theme.accent}
              borderColor={theme.accent}
              variant="outline"
            >
              Signup
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
}

export default NavBar;
