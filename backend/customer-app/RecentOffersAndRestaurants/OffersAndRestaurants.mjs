
import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({});
const publishAsync = promisify(sns.publish).bind(sns);

export const handler = async (event, context) => {

  // fetch information about recent offers and restaurants from the database and then send the notification
  const params = {
    Message: 'Hello, this is a test message from your Lambda function!',
    TopicArn: 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS'  // Replace with your SNS topic ARN
  };

  try {
    // Publish a message to the SNS topic
    await publishAsync(params);

    console.log('Message published to SNS topic.');

    return {
      statusCode: 200,
      body: 'Message published to SNS topic using the lamda.'
    };
  } catch (error) {
    console.error('Error publishing message to SNS:', error);
    return {
      statusCode: 500,
      body: 'Error publishing message to SNS.'
    };
  }
};
