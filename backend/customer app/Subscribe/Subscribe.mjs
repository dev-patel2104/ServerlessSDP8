
import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({})
const topicArn = 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS';

export const handler = async (event) => {

    /* This is the JSON input that my code require
     * UserId is the uuid of the new user that has signed up
     * email is the email of the user
     {
         "UserId": "2",
         "email": "rockmyworld.aa@gmail.com"
       } */

    let userId, email;

    try {
        userId = event.UserId;
        email = event.email;
    }
    catch (error) {
        console.error("error parsing JSON body:", error);
        return { statusCode: 400, body: JSON.stringify('Invalud JSON body') };
    }
    const subscribeParams = {
        Protocol: 'email',  // e.g., 'email', 'sms', etc.
        TopicArn: topicArn,
        Endpoint: email,  // e.g., email address or phone number
        Attributes: {
            'FilterPolicy': JSON.stringify({ "UserId": [userId, "-1"] })  // Example filter policy based on user_id
        }
    };

    const subscribeAsync = promisify(sns.subscribe).bind(sns);

    try {
        const data = await subscribeAsync(subscribeParams);
        console.log('User subscribed successfully:', data);
        return { statusCode: 200, body: JSON.stringify('User subscribed successfully') };
    } catch (error) {
        console.error('Error subscribing user:', error);
        return { statusCode: 500, body: JSON.stringify('Error subscribing user') };
    }
};
