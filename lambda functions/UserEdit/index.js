const AWS = require("aws-sdk");
const crypto = require("crypto");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "SDP8UserData";

exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { email, password, username } = requestBody;
    var editParams;

    const params = {
      TableName: TABLE_NAME,
      Key: {
        email: email,
      },
    };

    const existingUser = await dynamoDB.get(params).promise();

    if (!username) {
      const encryptedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      editParams = {
        TableName: TABLE_NAME,
        Item: {
          uuid: existingUser.Item.uuid,
          email: existingUser.Item.email,
          username: existingUser.Item.username,
          password: encryptedPassword,
        },
      };
    }

    if (!password) {
      editParams = {
        TableName: TABLE_NAME,
        Item: {
          uuid: existingUser.Item.uuid,
          email: existingUser.Item.email,
          username: username,
          password: existingUser.Item.password,
        },
      };
    }

    await dynamoDB.put(editParams).promise();

    if (!username) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Password changed successfully" }),
      };
    }
    if (!password) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Username changed successfully" }),
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
