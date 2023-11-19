import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({});
const dynamoDB = new DynamoDB({});
const publishAsync = promisify(sns.publish).bind(sns);

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

    let message, params, response;

    tableParams.TableName = OffersTable;
    response = await fetch('https://e4x258613e.execute-api.us-east-1.amazonaws.com/offers');
    const offers = await response.json()

    console.log(offers);

    let cnt = 1, flag = false, isUpdate = false;
    for (let i = 0; i < offers.length; i++) {
      if (offers[i].is_new) {
        if (!flag) {
          message = 'This are following recent offers:\n';
          flag = true;
        }
        message = message + (cnt) + ") " + offers[i].offer_description + '\n';
        offers[i].is_new = false;
        cnt++;
        isUpdate = true;
      }
    }

    console.log(message);
    response = await fetch('https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants');
    const restaurants = await response.json()
    cnt = 1;
    flag = false;
    for (let i = 0; i < restaurants.length; i++) {
      if (restaurants[i].is_new) {
        if (!flag) {
          message += 'This are following recently opened restaurants:\n';
          flag = true;
        }
        message = message + (cnt) + ") " + restaurants[i].name + "--->" + restaurants[i].address + "\nfollow link:" + restaurants[i].store_link + '\n';
        restaurants[i].is_new = false;
        cnt++;
        isUpdate = true;
      }
    }

    console.log(message);
    let out;
    for (let i = 0; i < offers.length; i++) {
      putOptions.body = JSON.stringify(offers[i]);
      out = await fetch('https://e4x258613e.execute-api.us-east-1.amazonaws.com/offers', putOptions);
    }

    for (let i = 0; i < restaurants.length; i++) {
      putOptions.body = JSON.stringify(restaurants[i]);
      await fetch('https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants', putOptions);
    }


    let messageAttributes = { "UserId": { DataType: "String", StringValue: -1 } };

    params = {
      Message: message,
      MessageAttributes: messageAttributes,
      TopicArn: 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS',
      Subject: "About new restaurant and offers"
    };

    if (isUpdate) {
      await publishAsync(params);
      return {
        statusCode: 200,
        body: 'Notification of the new offers and restaurant sent successfully.'
      };
    }
    else {
      return {
        statusCode: 200,
        body: "No new updates to send."
      };
    }

  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    return {
      statusCode: 500,
      body: 'Error fetching data from DynamoDB.'
    };
  }
};

