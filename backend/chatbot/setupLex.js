const AWS = require("aws-sdk");
AWS.config.update({ region: "YOUR_REGION" });

const lexmodels = new AWS.LexModelBuildingService();

// Intents, Utterances, and Slots
const listRestaurantUtterances = [
  "List restaurants",
  "Show available restaurants",
  "Which restaurants are there?",
];
const openingTimeUtterances = [
  "What are the opening times for {RestaurantName}",
  "When does {RestaurantName} open?",
];
const locationInfoUtterances = [
  "Where is {RestaurantName} located?",
  "Give me the location of {RestaurantName}",
];

const slots = [
  {
    name: "RestaurantName",
    description: "Name of the restaurant",
    slotType: "AMAZON.US_CITY",
    slotTypeVersion: "LATEST",
    sampleUtterances: [
      "I want to book at {RestaurantName}",
      "Show me {RestaurantName} menu",
    ],
    valueElicitationPrompt: {
      maxAttempts: 2,
      messages: [
        {
          contentType: "PlainText",
          content: "Which restaurant are you referring to?",
        },
      ],
    },
  },
];

async function createIntentsAndBot() {
  try {
    // ListRestaurants Intent
    const listRestaurantsIntent = await lexmodels
      .putIntent({
        name: "ListRestaurants",
        description: "Intent to list available restaurants",
        sampleUtterances: listRestaurantUtterances,
        slots: [], //
        fulfillmentActivity: {
          type: "CodeHook",
          codeHook: {
            uri: "YourLambdaARNForListRestaurants", // TODO: Lambda ARN
            messageVersion: "1.0",
          },
        },
      })
      .promise();

    // OpeningTimes Intent
    const openingTimesIntent = await lexmodels
      .putIntent({
        name: "OpeningTimes",
        description: "Intent to get opening times of restaurants",
        sampleUtterances: openingTimeUtterances,
        slots: slots,
        fulfillmentActivity: {
          type: "CodeHook",
          codeHook: {
            uri: "YourLambdaARNForOpeningTimes", // TODO: Lambda ARN
            messageVersion: "1.0",
          },
        },
      })
      .promise();

    // Create the main bot
    const bot = await lexmodels
      .putBot({
        name: "Foodvaganza Bot",
        description: "Bot for table reservations",
        intents: [
          {
            intentName: listRestaurantsIntent.name,
            intentVersion: listRestaurantsIntent.version,
          },
          {
            intentName: openingTimesIntent.name,
            intentVersion: openingTimesIntent.version,
          },
        ],
        abortStatement: {
          messages: [
            {
              contentType: "PlainText",
              content: "Sorry, I couldn’t understand that. Please rephrase.",
            },
          ],
        },
        idleSessionTTLInSeconds: 300,
        voiceId: "Salli",
        locale: "en-US",
        childDirected: false,
      })
      .promise();

    console.log("TableReservationBot created:", bot);
  } catch (error) {
    console.error("Error setting up Lex:", error);
  }
}

createIntentsAndBot();
