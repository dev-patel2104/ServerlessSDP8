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
        
        let message, messageAttributes, params, date;
        date = new Date(reservation.reservation_time);
        
        if (reservation.type.toLowerCase() === 'created') {
            message = 'A reservation has been done by ' + email + ' for ' + date;
        }
        else if (reservation.type.toLowerCase() === 'edited') {
            message = 'The reservation done by ' + email + ' has been changed to ' + date;
        }
        else if (reservation.type.toLowerCase() === 'deleted') {
            message = 'The reservation done by ' + email + ' on ' + date + ' has been deleted';
        }

        if(reservation.menu_items === undefined || reservation.menu_items === null || reservation.menu_items.length === 0)
        {
            message += ". The reservation has no menu items associated with it.";
        }
        else
        {
            message += ". The reservation has been booked with the following menu item: \n" ;
            reservation.menu_items.forEach((item, index) => {
                message += (index + 1) + ") " + item.item_name + ": quantity -----> " + item.item_quantity + ".\n";
            })
            
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