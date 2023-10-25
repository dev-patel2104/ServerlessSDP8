import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { promisify } from 'util';
import { uuid } from 'uuidv4';


const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const putItemAsync = promisify(dynamoDB.send).bind(dynamoDB);

const TABLE_NAME = "SDP8UserData";
const postOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: ""
};


export const handler = async (event) => {
  try {
    
    const req = JSON.parse(event.body);
    const email = req.email;
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email is required in the request body" }),
      };
    }

    const response = await fetch(`https://e4x258613e.execute-api.us-east-1.amazonaws.com/user/${email}`);
    const body = await response.json()
    const statusCode = response.status;
    
    console.log(email);
    console.log(body);
    
    if(statusCode)
    {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "The DB already contains this email address",
        }),
      };
    }
    
    const uuidValue = uuid();
    const params = {
      TableName: TABLE_NAME,
      Item: {
        email: { S: email },
        uuid: { S: uuidValue },

      },
    };

    const putCommand = new PutItemCommand(params);

    await putItemAsync(putCommand);

    postOptions.body = JSON.stringify({ UserId: uuidValue, email: email });
    await fetch('https://e4x258613e.execute-api.us-east-1.amazonaws.com/subscribe', postOptions);

    return {
      statusCode: 201, // 201 Created
      body: JSON.stringify({ message: "User added successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred" }),
    };
  }
};