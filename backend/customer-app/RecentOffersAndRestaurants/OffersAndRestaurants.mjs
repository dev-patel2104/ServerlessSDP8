import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({});
const dynamoDB = new DynamoDB({});

const OffersTable = 'offers';
const restaurantTable = 'restaurants';

const putOptions = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: ""
};
export const handler = async (event, context) => {
  try {
    const tableParams = {
      TableName: "",
    };

    let message, params;

    tableParams.TableName = OffersTable;
    const response = await fetch('https://e4x258613e.execute-api.us-east-1.amazonaws.com/offers');
    const offers = await response.json()

    console.log(offers);
    message = 'This are following recent offers:\n';
    let cnt = 1;
    for (let i = 0; i < offers.length; i++) {
      if (offers[i].is_new) {
        message = message + (cnt) + ") " + offers[i].offer_description + '\n';
        offers[i].is_new = false;
        cnt++;
      }
    }

    let out;
    for (let i = 0; i < offers.length; i++) {
      putOptions.body = JSON.stringify(offers[i]);
      console.log(putOptions.body);
      out = await fetch('https://e4x258613e.execute-api.us-east-1.amazonaws.com/offers', putOptions);
    }


    // tableParams.TableName = restaurantTable;
    // const restaurants = await scanAsync(tableParams);
    // for(const temp of restaurants.Items)
    // {
    //   console.log(temp.is_new);  
    // }


    // const params = {
    //   Message: 'Hello, this is a test message from your Lambda function!',
    //   TopicArn: 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS'  // Replace with your SNS topic ARN
    // };

    // // Publish a message to the SNS topic
    // await publishAsync(params);

    // console.log('Message published to SNS topic.');


    return {
      statusCode: 200,
      body: 'Data fetched from DynamoDB tables.'
    };
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    return {
      statusCode: 500,
      body: 'Error fetching data from DynamoDB.'
    };
  }
};

