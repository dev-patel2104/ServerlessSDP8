const AWS = require("aws-sdk");
const uuid = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "SDP8UserData";

exports.handler = async (event) => {
  try {
    // get email from request body
    const requestBody = JSON.parse(event.body);
    //add more parameters as per request body if modification is needed
    const { email } = requestBody;

    // if email was not sent in request body send bad request status
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password are required" }),
      };
    }

    //check if the email is present in DB already
    const params = {
      TableName: TABLE_NAME,
      Key: {
        email: email,
      },
    };
    const existingUser = await dynamoDB.get(params).promise();

    //return user already exists and close the lambda
    if (existingUser.Item) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "User with the same email already exists please login",
        }),
      };
    }

    //assign uuid
    const uuidValue = uuid.v4();

    //create the addition parameters
    const signupParams = {
      TableName: TABLE_NAME,
      Item: {
        uuid: uuidValue,
        email: email
        //add more parameters here if needed
      },
    };

    await dynamoDB.put(signupParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User added to dynamoDB" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Could not add data to DynamoDB" }),
    };
  }
};
