const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'SDP8UserData';

exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email is required' }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        email: email,
      },
    };

    await dynamoDB.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred' }),
    };
  }
};
