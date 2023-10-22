const AWS = require("aws-sdk");
const crypto = require("crypto");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "SDP8UserData";

exports.handler = async (event) => {
  try {
    // const requestBody = JSON.parse(event.body);
    // const email = requestBody.email;
    const email = event.queryStringParameters.email; //use either query parameter if get call or change to request body for post call

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Email is required to check for user",
        }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        email: email,
      },
    };

    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message:
            "No such email present in the database",
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          uuid: result.Item.uuid,
          email: result.Item.email
        }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred" }),
    };
  }
};