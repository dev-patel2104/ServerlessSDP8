import { Flex, Text, Button, Input, useToast } from "@chakra-ui/react";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { partnerAuth } from "../../config/firebase";
import { theme } from "../../theme";
import { useNavigate } from "react-router-dom";

function PartnerResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loggedIn, setLoggedIn] = useState(null);
  const [email, setEmail] = useState(null);

  function handleForgotPassword() {
    sendPasswordResetEmail(partnerAuth, email)
      .then(() => {
        toast({
          title: "Success",
          description:
            "Password reset email sent, please reset your password and login again!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description:
            "Could not send password reset email, please check the email and try again!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
    navigate("/partner/login");
  }

  useEffect(() => {
    const listen = onAuthStateChanged(partnerAuth, (user) => {
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
      {!loggedIn ? (
        <>
          <Input
            m="4"
            color={theme.accent}
            placeholder="Email"
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
          <Button
            m="4"
            onClick={() => {
              handleForgotPassword();
            }}
          >
            Submit
          </Button>
        </>
      ) : (
        <>
          <Text>
            You are already logged in, please change password from your profile
            page
          </Text>
        </>
      )}
    </Flex>
  );
}

export default PartnerResetPassword;
