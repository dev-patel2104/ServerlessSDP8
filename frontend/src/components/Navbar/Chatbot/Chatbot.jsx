import React, { useState } from "react";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";

import { theme } from "../../../theme";

import { AddIcon, CloseIcon } from "@chakra-ui/icons";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const { isOpen, onToggle } = useDisclosure();

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const newMessages = [
        ...messages,
        { type: "user", content: userInput.trim() },
      ];

      setMessages(newMessages);
      setUserInput("");

      // Initialize AWS SDK for Lex
      AWS.config.region = "us-east-1";
      AWS.config.credentials = new AWS.Credentials(
        process.env.AWS_ACCESS_KEY_ID,
        process.env.AWS_SECRET_ACCESS_KEY,
        process.env.AWS_SESSION_TOKEN
      );

      const lexruntime = new AWS.LexRuntime();
      const params = {
        botAlias: "TestBotAlias",
        botName: "Foodvaganza-bro",
        inputText: userInput.trim(),
        userId: uuidv4(),
        sessionAttributes: {},
      };

      lexruntime.postText(params, (err, data) => {
        if (err) {
          console.error("Error sending message to Lex:", err);
          setMessages([
            ...newMessages,
            { type: "bot", content: "Sorry, I encountered an error." },
          ]);
        } else {
          setMessages([...newMessages, { type: "bot", content: data.message }]);
        }
      });
    }
  };

  return (
    <>
      <Box position="fixed" bottom="4" right="4">
        <Button
          bgColor={theme.secondaryBackground}
          leftIcon={<AddIcon />}
          color="white"
          _hover={{ bgColor: theme.secondaryHover }}
          onClick={onToggle}
        >
          Chat with Foodvaganza Bot
        </Button>
      </Box>
      {isOpen && (
        <Box
          position="fixed"
          bottom="16"
          right="4"
          maxW="96"
          bg="white"
          shadow="md"
          rounded="lg"
        >
          <Box
            p="4"
            borderBottom="1px"
            borderColor="gray.200"
            bgColor={theme.secondaryBackground}
            color="white"
            roundedTop="lg"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="lg" fontWeight="semibold">
              Foodvaganza Bot
            </Text>
            <IconButton
              icon={<CloseIcon />}
              aria-label="Close chat"
              variant="unstyled"
              color="gray.300"
              _hover={{ color: "gray.400" }}
              onClick={onToggle}
            />
          </Box>
          <VStack p="4" h="80" overflowY="auto" spacing="2">
            {messages.map((message, index) => (
              <Box
                key={index}
                w="100%"
                display="flex"
                justifyContent={
                  message.type === "user" ? "flex-end" : "flex-start"
                }
                mt={message.type === "user" ? "2" : "0"}
              >
                <Box
                  display="inline-block"
                  bg={
                    message.type === "user"
                      ? theme.secondaryBackground
                      : "gray.200"
                  }
                  color={message.type === "user" ? "white" : "gray.700"}
                  p="2"
                  rounded="lg"
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </VStack>
          <Box p="4" borderTop="1px" borderColor="gray.200" display="flex">
            <Input
              flex="1"
              placeholder="Type a message"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button
              ml="2"
              bgColor={theme.secondaryBackground}
              color="white"
              _hover={{ bgColor: theme.secondaryHover }}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Chatbot;
