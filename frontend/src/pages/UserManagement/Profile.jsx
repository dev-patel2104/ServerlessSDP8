import {
  Flex,
  Text,
  Button,
  Divider,
  Box,
  Image,
  Input,
  InputGroup,
  IconButton,
  InputRightElement,
  Alert,
  AlertIcon,
  useToast,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import {
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  updatePassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { auth } from "../../config/firebase";
import { theme } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import { EditIcon, CheckIcon } from "@chakra-ui/icons";
import PasswordChecklist from "react-password-checklist";

function Profile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loggedIn, setLoggedIn] = useState(null);
  const [editUsername, setEditUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(user);
        setDisplayName(user.displayName);
        setEmail(user.email);
        setPhotoURL(user.photoURL);
        setEmailVerified(user.emailVerified);
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
    <>
      <Flex
        w="100%"
        minHeight="90vh"
        backgroundColor={theme.primaryBackground}
        alignItems="center"
        justifyContent="space-evenly"
      >
        {loggedIn ? (
          <>
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
                maxW="800px"
                p="10"
                borderRadius="lg"
                backgroundColor={theme.secondaryBackground}
                flexDir="row"
                alignItems="center"
              >
                <Flex flex="3" flexDir="column">
                  <Box flex="3" display={{ base: "none", md: "block" }}>
                    <Image src={photoURL} alt="Login Image" />
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
                    Change Picture
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
                  <Text fontSize="30px" color={theme.accent} mb={5}>
                    Profile
                  </Text>
                  <Input
                    color={theme.accent}
                    placeholder="Email"
                    mb="4"
                    isDisabled={true}
                    type="email"
                    value={email}
                    required
                    style={{
                      borderColor: theme.accent,
                    }}
                    _placeholder={{
                      color: theme.accent,
                    }}
                  />
                  <InputGroup>
                    <Input
                      color={theme.accent}
                      placeholder="Username"
                      mb="4"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      isDisabled={!editUsername}
                      required
                      style={{
                        borderColor: theme.accent,
                      }}
                      _placeholder={{
                        color: theme.accent,
                      }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="outline"
                        _hover={{ backgroundColor: theme.primaryBackground }}
                        color={theme.accent}
                        borderColor={theme.accent}
                        size="sm"
                        onClick={() => {
                          if (editUsername) {
                            updateProfile(auth.currentUser, {
                              displayName: displayName,
                            })
                              .then(() => {
                                toast({
                                  title: "Success",
                                  description: "Your username is updated",
                                  status: "success",
                                  duration: 2000,
                                  isClosable: true,
                                });
                              })
                              .catch((error) => {
                                console.error(error);
                              });
                          }
                          setEditUsername(!editUsername);
                        }}
                        icon={!editUsername ? <EditIcon /> : <CheckIcon />}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Flex justify="space-between" alignItems="center" mb="4">
                    {!emailVerified && (
                      <Button
                        variant="outline"
                        type="submit"
                        _hover={{ backgroundColor: theme.primaryBackground }}
                        color={theme.accent}
                        borderColor={theme.accent}
                        onClick={() => {
                          sendEmailVerification(auth.currentUser).then(() => {
                            toast({
                              title: "Verification Email Sent",
                              description:
                                "Please check your email, including junk and spam!",
                              status: "info",
                              duration: 3000,
                              isClosable: true,
                            });
                          });
                        }}
                      >
                        Verify
                      </Button>
                    )}
                    {!(
                      auth.currentUser.providerData[0].providerId ===
                      "google.com"
                    ) && (
                      <Button
                        variant="outline"
                        type="submit"
                        _hover={{ backgroundColor: theme.primaryBackground }}
                        color={theme.accent}
                        borderColor={theme.accent}
                        onClick={onOpen}
                      >
                        Change Password
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      type="submit"
                      _hover={{ backgroundColor: theme.primaryBackground }}
                      color={theme.accent}
                      borderColor={theme.accent}
                      onClick={() => {
                        deleteUser(auth.currentUser)
                          .then(() => {
                            toast({
                              title: "Success",
                              description:
                                "Your account was deleted, you cannot use this account anymore.",
                              status: "success",
                              duration: 2000,
                              isClosable: true,
                            });
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                          localStorage.setItem("foodvaganzaUser", "");
                          localStorage.setItem("userType", "");
                          window.location.reload();
                        navigate("/");
                      }}
                    >
                      Delete Account
                    </Button>
                  </Flex>
                  {emailVerified ? (
                    <>
                      {" "}
                      <Alert status="success">
                        <AlertIcon />
                        Your account is verified, you will receive email
                        notifications
                      </Alert>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Alert status="warning">
                        <AlertIcon />
                        You have not verified your account, you will not receive
                        any email notifications
                      </Alert>
                    </>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </>
        ) : (
          <>
            <Text>You are not logged in</Text>
          </>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Passwords</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              color={theme.accent}
              type="password"
              required
              value={password1}
              style={{
                borderColor: theme.accent,
              }}
              _placeholder={{
                color: theme.accent,
              }}
              onChange={(e) => {
                setPassword1(e.target.value);
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
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
              mb="4"
            />
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={password1}
              valueAgain={password2}
              style={{ color: theme.accent }}
              onChange={(isValid) => {
                setDisabled(!isValid);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabled}
              onClick={() => {
                updatePassword(auth.currentUser, password1)
                  .then(() => {
                    toast({
                      title: "Password Changed",
                      description:
                        "Please use your new password, from next login",
                      status: "info",
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
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
                    navigate("/user/login");
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
                onClose();
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Profile;
