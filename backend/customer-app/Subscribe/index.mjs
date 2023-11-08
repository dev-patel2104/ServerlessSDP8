
import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({})
const customerTopicArn = 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS';
const restaurantTopicArn = 'arn:aws:sns:us-east-1:263032025301:RestaurantTopic';

export const handler = async (event) => {

    let userId, email, userType;
    const subscribeAsync = promisify(sns.subscribe).bind(sns);

    try {
        const request = JSON.parse(event.body);
        console.log(request);
        userId = request.UserId;
        email = request.email;
        userType = request.type;
        if (email === undefined || email === null || email.trim() === "") {
            console.log("Please provide a proper email value");
            return { statusCode: 422, body: JSON.stringify("Please provide a proper email value") };
        }

        if (userId === undefined || userId === null || userId.trim() === "") {
            console.log("Please provide a proper userId value");
            return { statusCode: 422, body: JSON.stringify("Please provide a proper userId value") };
        }
        if (userType === undefined || userType === null || userType.trim() === "") {
            console.log("Please provide a proper userType value");
            return { statusCode: 422, body: JSON.stringify("Please provide a proper userType value") };
        }
    }
    catch (error) {
        console.error("error parsing JSON body:", error);
        return { statusCode: 422, body: JSON.stringify('Please provide a proper JSON input') };
    }

    const subscribeParams = {
        Protocol: 'email',  // e.g., 'email', 'sms', etc.
        TopicArn: "",
        Endpoint: email,  // e.g., email address or phone number
        Attributes: {
            'FilterPolicy': JSON.stringify({ "UserId": [userId, "-1"] })  // Example filter policy based on user_id
        }
    };

    if (userType.toLowerCase() === 'customer') {
        subscribeParams.TopicArn = customerTopicArn;
        
    }
    else if (userType.toLowerCase() === 'partner') {
        subscribeParams.TopicArn = restaurantTopicArn;
    }

    

    try {
        const data = await subscribeAsync(subscribeParams);
        console.log('User subscribed successfully:', data);
        return { statusCode: 200, body: JSON.stringify('User subscribed successfully') };
    } catch (error) {
        console.error('Error subscribing user:', error);
        return { statusCode: 500, body: JSON.stringify('Error subscribing user') };
    }
};
