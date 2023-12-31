import { Button, Flex, Text, useToast, Image } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { theme } from "../../theme";
import { partnerAuth, auth, adminAuth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../../assets/food-color-sushi-svgrepo-com.svg";
import { isAuthenticated } from "../../services/AuthenticationServices/AuthenticationServices";
import { updateRestaurantDetails } from "../../services/RestaurantServices/RestaurantService";
import { notifyUserAddRestaurant } from "../../services/NotificationServices/NotificationService";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function NavBar() {
  const navigate = useNavigate();
  const toast = useToast();
  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

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
        localStorage.setItem("foodvaganzaUser", "");
        localStorage.setItem("userType", "");
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
        localStorage.setItem("foodvaganzaUser", "");
        localStorage.setItem("userType", "");
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

  function handleAdminSignout() {
    signOut(adminAuth)
      .then(() => {
        toast({
          title: "Signed Out",
          description: "You have been signed out!",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem("foodvaganzaUser", "");
        localStorage.setItem("userType", "");
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

  async function create_restaurant() {
    let restaurant_id = uuidv4();
    let restaurant = {
      restaurant_id: restaurant_id,
      email_id: localStorage.getItem("foodvaganzaUser"),
      menu: {},
    };
    const restaurantResponse = await updateRestaurantDetails(restaurant);
    console.log(restaurantResponse);

    const response = await notifyUserAddRestaurant(
      localStorage.getItem("foodvaganzaUser"),
      restaurant["restaurant_id"]
    );
    console.log(response);

    navigate(`/editRestaurants/${restaurant_id}`);
  }

  useEffect(() => {
    let authToUse = auth; // Default auth object

    if (localStorage.userType === "partner") {
      authToUse = partnerAuth;
    }

    if (localStorage.userType === "admin") {
      authToUse = adminAuth;
    }

    const listen = onAuthStateChanged(authToUse, (user) => {
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
      h="10vh"
      w="100%"
      backgroundColor={theme.secondaryBackground}
    >
      <Image src={logo} alt="Login Image" boxSize="30px" mr="1" />
      {localStorage.getItem("userType") === "admin" && (
        <>
          <Text color={theme.accent} fontWeight="bold">
            Foodvaganza | Admin{" "}
          </Text>
        </>
      )}
      {localStorage.getItem("userType") === "partner" && (
        <>
          <Text color={theme.accent} fontWeight="bold">
            Foodvaganza | Partner{" "}
          </Text>
        </>
      )}
      {(localStorage.getItem("userType") === "user" || "") && (
        <>
          <Text color={theme.accent} fontWeight="bold">
            Foodvaganza
          </Text>
        </>
      )}
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
            {localStorage.getItem("userType") === "admin" && (
              <>
                <Text color={theme.accent} fontWeight="bold">
                  Foodvaganza | Admin{" "}
                </Text>
              </>
            )}
            {localStorage.getItem("userType") === "partner" && (
              <>
                <Text color={theme.accent} fontWeight="bold">
                  Foodvaganza | Partner{" "}
                </Text>
              </>
            )}
            {(localStorage.getItem("userType") === "user" || localStorage.getItem("userType") === "") && (
              <>
                <Text color={theme.accent} fontWeight="bold">
                  Foodvaganza
                </Text>
              </>
            )}
          </Flex>
        </Link>
      </Flex>
      {loggedIn ? (
        <>
          <Flex mr="4" gap="16px" alignItems="center">
            <NavLink to="/restaurants">
              <Text fontWeight="medium" color={theme.secondaryForeground}>
                {localStorage.getItem("userType") === "admin" && "View all Restaurants"}
                {localStorage.getItem("userType") === "partner" && "My Restaurants"}
                {localStorage.getItem("userType") === "user" && "Browse all Restaurants"}
              </Text>
            </NavLink>
            {localStorage.getItem("userType") === "partner" && (
              <NavLink to="/partner/dashboard">
                <Text fontWeight="medium" color={theme.secondaryForeground}>
                  My Dashboard
                </Text>
              </NavLink>
            )}
            {localStorage.getItem("userType") === "user" && (
              <NavLink to="/my-reservations">
                <Text fontWeight="medium" color={theme.secondaryForeground}>
                  My Reservations
                </Text>
              </NavLink>
            )}
            {localStorage.getItem("userType") === "admin" && (
              <NavLink to="/admin/statistics">
                <Text fontWeight="medium" color={theme.secondaryForeground}>
                  Statistics
                </Text>
              </NavLink>
            )}
            {localStorage.getItem("userType") === "partner" ? (
              <Button
                onClick={create_restaurant}
                _hover={{ backgroundColor: theme.primaryBackground }}
                color={theme.accent}
                borderColor={theme.accent}
                variant="outline"
              >
                {" "}
                Add Restaurant{" "}
              </Button>
            ) : (
              ""
            )}

            <Button
              onClick={() => {
                if (localStorage.getItem("userType") === "partner") {
                  handlePartnerSignout();
                }
                if (localStorage.getItem("userType") === "user") {
                  handleSignout();
                }
                if (localStorage.getItem("userType") === "admin") {
                  handleAdminSignout();
                }
              }}
              _hover={{ backgroundColor: theme.primaryBackground }}
              color={theme.accent}
              borderColor={theme.accent}
              variant="outline"
            >
              Logout
            </Button>
            {localStorage.getItem("userType") === "partner" && (
              <Button
                as={Link}
                to="/partner/profile"
                _hover={{ backgroundColor: theme.primaryBackground }}
                color={theme.accent}
                borderColor={theme.accent}
                variant="outline"
              >
                Profile
              </Button>
            )}
            {localStorage.getItem("userType") === "user" && (
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
            )}
            {localStorage.getItem("userType") === "admin" && (
              <Button
                as={Link}
                to="/admin/profile"
                _hover={{ backgroundColor: theme.primaryBackground }}
                color={theme.accent}
                borderColor={theme.accent}
                variant="outline"
              >
                Profile
              </Button>
            )}
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
