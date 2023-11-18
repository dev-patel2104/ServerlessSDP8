import { SNS } from '@aws-sdk/client-sns';
import { promisify } from 'util';

const sns = new SNS({});
const publishAsync = promisify(sns.publish).bind(sns);
const topicARN = 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS';

export const handler = async (event) => {

    // assuming that I will get the updated reservation and menu item changes in my event when it is called from edit reservation and menu item api
    const postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: ""
    };


    try {

        let response, reservation, temp;
        reservation = JSON.parse(event.body);
        temp = reservation.type;
        console.log(reservation);
        
        response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations/${reservation.reservation_id}`);
        reservation = await response.json();
        reservation.type = temp;
        console.log(reservation);
        
        const email = reservation.customer_id;
        response = await fetch(`https://e4x258613e.execute-api.us-east-1.amazonaws.com/user/${email}`);
        const body = await response.json()
        const userId = body.uuid;
        console.log(userId);

        response = await fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants/${reservation.restaurant_id}`);
        const data = await response.json();
        const name = data.name;
        console.log(name);

        response = await fetch(`https://p4mp4ngglh.execute-api.us-east-1.amazonaws.com/items/${reservation.reservation_id}`);
        const menuData = await response.json();
        console.log(menuData);

        let message, messageAttributes, params, date;
        date = new Date(reservation.reservation_time);
        // Also check whether the menu item has been changed or not if yes then do the following changes in the message accordingly
        // just add a statement in the message saying with the menu items xyz if the menu items are selected by the customer.
        if (reservation.type.toLowerCase() === 'created') {
            message = 'Your reservation for ' + name + ' has been created for ' + date;
        }
        else if (reservation.type.toLowerCase() === 'edited') {
            message = 'Your reservation for ' + name + ' has been edited to ' + date;
        }
        else if (reservation.type.toLowerCase() === 'deleted') {
            message = 'Your reservation for ' + name + ' on ' + date + ' has been deleted';
        }

        if (menuData.items === undefined || menuData.items === null || menuData.items.length === 0) {
            message += ". The reservation has no menu items associated with it.";
        }
        else {
            message += ". The reservation has been booked with the following menu item: " + menuData.items;
            reservation.menu_items = menuData.items;
        }

        messageAttributes = { "UserId": { DataType: "String", StringValue: userId } };
        params = {
            Message: message,
            MessageAttributes: messageAttributes,
            TopicArn: topicARN,
            Subject: "Your reservation update"
        }
        
        // Notifying customer about the updated reservation
         await publishAsync(params);

            // Notifying restaurant about the updated reservation
            postOptions.body = JSON.stringify(reservation);
            response = await fetch('https://e4x258613e.execute-api.us-east-1.amazonaws.com/reservation-change-restaurant', postOptions);
            const newData = await response.json();
            console.log(newData);

            return {
                statusCode: 200,
                body: 'All the parties associated with updated reservations have been notified of their changed reservation'
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