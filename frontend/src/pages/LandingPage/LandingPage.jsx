import { Flex, Text } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { theme } from "../../theme";
import Chatbot from "../../components/Navbar/Chatbot/Chatbot";

function LandingPage() {
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
      Mobile Landing Page
      <Chatbot />
    </Flex>
  ) : (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Text color={theme.primaryForeground} fontWeight="bold">
        Hello World!
      </Text>
      <div className="fixed bottom-0 right-0 mb-4 mr-4">
        <Chatbot />
      </div>
    </Flex>
  );
}

export default LandingPage;
