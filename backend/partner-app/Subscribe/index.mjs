
import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({})
const customerTopicArn = 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS';
const restaurantTopicArn = 'arn:aws:sns:us-east-1:263032025301:RestaurantTopic';

export const handler = async (event) => {

    let userId, email, userType;
    const subscribeAsync = promisify(sns.subscribe).bind(sns);
    const listSubscriptionsAsync = promisify(sns.listSubscriptionsByTopic).bind(sns);
    const getSubscriptionAttributesAsync = promisify(sns.getSubscriptionAttributes).bind(sns);
    const setSubscriptionAttributesAsync = promisify(sns.setSubscriptionAttributes).bind(sns);

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
        try {
            const listSubscriptionsParams = { TopicArn: restaurantTopicArn };
            const subscriptions = await listSubscriptionsAsync(listSubscriptionsParams);

            // Check if the user's email is already in the list of subscriptions
            const existingSubscription = subscriptions.Subscriptions.find(sub => sub.Endpoint === email);

            if (existingSubscription) {
                console.log('User is already subscribed to the restaurant topic.');

                // Get the current subscription attributes to obtain the current filter policy
                const getAttributesParams = { SubscriptionArn: existingSubscription.SubscriptionArn };
                const currentAttributes = await getSubscriptionAttributesAsync(getAttributesParams);
                const currentFilterPolicy = JSON.parse(currentAttributes.Attributes.FilterPolicy || '{}');

                // Update the filter policy with the new UserId
                currentFilterPolicy.UserId = Array.from(new Set([...currentFilterPolicy.UserId, userId, "-1"]));

                // Set the new filter policy for the subscription
                const setAttributesParams = {
                    SubscriptionArn: existingSubscription.SubscriptionArn,
                    AttributeName: 'FilterPolicy',
                    AttributeValue: JSON.stringify(currentFilterPolicy),
                };

                await setSubscriptionAttributesAsync(setAttributesParams);

                console.log('Filter policy updated successfully:', setAttributesParams);

                return { statusCode: 200, body: JSON.stringify('User is already subscribed. Filter policy updated successfully.') };
            }
        } catch (error) {
            console.error('Error checking existing subscriptions or updating filter policy:', error);
            return { statusCode: 500, body: JSON.stringify('Error checking existing subscriptions or updating filter policy') };
        }
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
