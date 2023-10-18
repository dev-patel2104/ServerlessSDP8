const AWS = require('aws-sdk');
const crypto = require('crypto');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'SDP8UserData';

exports.handler = async (event) => {
  try {
    const email = event.queryStringParameters.email;
    const password = event.queryStringParameters.password;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password are required' }),
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
        body: JSON.stringify({ message: 'No such email present in the database, please sign up instead' }),
      };
    }

    const storedPassword = result.Item.password;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (storedPassword === hashedPassword) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful for uuid ' + result.Item.uuid }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred' }),
    };
  }
};