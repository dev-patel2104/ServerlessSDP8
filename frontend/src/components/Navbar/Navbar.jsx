import { Button, Flex, Text, useToast, Image } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { theme } from "../../theme";
import { partnerAuth, auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../../assets/food-color-sushi-svgrepo-com.svg";
import { isAuthenticated } from "../../services/AuthenticationServices/AuthenticationServices";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const toast = useToast();
  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });

  const [loggedIn, setLoggedIn] = useState(null);

  function handleSignout() {
    signOut(auth)
      .then(() => {
        toast({
          title: "Signed Out",
          description: "You have been signed out!",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem("foodvaganzaUser","");
        localStorage.setItem("userType","");
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description:
            "We are unable to sign you out at the moment, please try again later.",
          status: "error",
          duration: 3000,
          isClosable: false,
        });
      });
  }

  function handlePartnerSignout() {
    signOut(partnerAuth)
      .then(() => {
        toast({
          title: "Signed Out",
          description: "You have been signed out!",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem("foodvaganzaPartner","");
        localStorage.setItem("userType","");
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description:
            "We are unable to sign you out at the moment, please try again later.",
          status: "error",
          duration: 3000,
          isClosable: false,
        });
      });
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
      <Flex flex="1" ml="4" flexDir="row" alignItems="center">
        <Link to="/">
          <Flex alignItems="center">
            <Image src={logo} alt="Login Image" boxSize="30px" mr="1" />
            {localStorage.getItem('userType') === 'partner' ? (<><Text color={theme.accent} fontWeight="bold">
              Foodvaganza | Partner
            </Text></>):(<><Text color={theme.accent} fontWeight="bold">
              Foodvaganza
            </Text></>)}
          </Flex>
        </Link>
      </Flex>
      {isAuthenticated() ? (
        <>
          <Flex mr="4" gap="16px" alignItems="center">
            <NavLink to='/restaurants'>
              <Text fontWeight="medium" color={theme.secondaryForeground} >Browse all Restaurants</Text>
            </NavLink>
            <NavLink to='/my-reservations'>
              <Text fontWeight="medium" color={theme.secondaryForeground} >My Reservations</Text>
            </NavLink>
            
            <Button
              onClick={() => {
                if(localStorage.getItem('userType') === 'partner'){
                  handlePartnerSignout();
                }
                if(localStorage.getItem('userType') === 'user'){
                  handleSignout();
                }
              }}
              _hover={{ backgroundColor: theme.primaryBackground }}
              color={theme.accent}
              borderColor={theme.accent}
              variant="outline"
              
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
              to="/login"
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
              to="/signup"
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
