import { SNS } from '@aws-sdk/client-sns';
import { promisify } from 'util';

const sns = new SNS({});
const publishAsync = promisify(sns.publish).bind(sns);
const restaurantTopicARN = 'arn:aws:sns:us-east-1:263032025301:RestaurantTopic';

export const handler = async (event) => {

    try {

        let response;
        const reservation = JSON.parse(event.body);
        console.log(reservation);
        const email = reservation.customer_id;

        // Add a call to fetch the customer name if we are saving it somewhere in the database.
        // response = await fetch(`https://e4x258613e.execute-api.us-east-1.amazonaws.com/user/${email}`);
        // const body = await response.json()
        // const userId = body.uuid;
        // console.log(userId);
        
        let message, messageAttributes, params, date;
        date = new Date(reservation.reservation_time);
        // Also check whether the menu item has been changed or not if yes then do the following changes in the message accordingly
        // just add a statement in the message saying with the menu items xyz if the menu items are selected by the customer.
        if (reservation.type.toLowerCase() === 'created') {
            message = 'A reservation has been done by ' + email + ' for ' + date;
        }
        else if (reservation.type.toLowerCase() === 'edited') {
            message = 'The reservation done by ' + email + ' has been changed to ' + date;
        }
        else if (reservation.type.toLowerCase() === 'deleted') {
            message = 'The reservation done by ' + email + ' on ' + date + ' has been deleted.';
        }

        console.log(reservation.restaurant_id);
        messageAttributes = { "UserId": { DataType: "String", StringValue: reservation.restaurant_id } };
        params = {
            Message: message,
            MessageAttributes: messageAttributes,
            TopicArn: restaurantTopicARN,
            Subject: "Your reservation update"
        }

        await publishAsync(params);

        return {
            statusCode: 200,
            body: JSON.stringify('The restaurant has been notified about the updated reservations information.')
        };
    }
    catch (err) {
        console.log("Some error has occurred", err);
        return {
            statusCode: 500,
            body: 'Error publishing message to SNS. Internal Server Error'
        };
    }
};