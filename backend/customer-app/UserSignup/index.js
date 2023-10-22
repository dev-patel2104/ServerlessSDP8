const AWS = require('aws-sdk');
const uuid = require('uuid');
const crypto = require('crypto');
const { stringify } = require('querystring');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
//const sns = new AWS.SNS(); 
const TABLE_NAME = 'SDP8UserData';

/*const postOptions = {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: ""
};*/

exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { email, password, username } = requestBody;

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

    const existingUser = await dynamoDB.get(params).promise();

    if (existingUser.Item) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'User with the same email already exists please login' }),
      };
    }

    const uuidValue = uuid.v4();
    const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const signupParams = {
      TableName: TABLE_NAME,
      Item: {
        uuid: uuidValue,
        email: email,
        username: username,
        password: encryptedPassword,
      },
    };

    //postOptions.body = JSON.stringify({UserId : uuidValue, email : email});
    
    await dynamoDB.put(signupParams).promise();
    //await fetch('https://vc22xmcbs7.execute-api.us-east-1.amazonaws.com/Prod/subscribe', postOptions);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registration successful' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred' }),
    };
  }
};