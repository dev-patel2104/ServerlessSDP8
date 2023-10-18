import { Flex, Text, Button } from "@chakra-ui/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { auth } from "../../config/firebase";
import { theme } from "../../theme";

function Profile() {
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
      Mobile Profile Page
    </Flex>
  ) : (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      alignItems="center"
      justifyContent="space-evenly"
    >
      {loggedIn ? (
        <>
          <Text color={theme.primaryForeground} fontWeight="bold">
            {loggedIn.email}
          </Text>
          <Button onClick={() => {handleSignout();}}>Logout</Button>
        </>
      ) : (
        <>
          <Text>You are not logged in</Text>
        </>
      )}
    </Flex>
  );
}

export default Profile;
