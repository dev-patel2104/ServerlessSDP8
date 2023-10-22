import {SNS} from '@aws-sdk/client-sns';
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
    const reservation = event
    
    postOptions.body = JSON.stringify({email : reservation.customer_id});
    const response = await fetch('https://vc22xmcbs7.execute-api.us-east-1.amazonaws.com/Prod/user/getuser', postOptions);
    const body = await response.json()
    const userId = body.uuid;
    console.log(userId);
    try {
       
        let message, messageAttributes, params, date;
        date = new Date(reservation.reservation_time);

            // Also check whether the menu item has been changed or not if yes then do the following changes in the message accordingly
            if(reservation.type.toLowerCase() === 'created')
            {
              message = 'Your reservation for ' + reservation.restaurant_id + ' has been created for ' + date;  
            }
            else if(reservation.type.toLowerCase() === 'edited')
            {
              message = 'Your reservation for ' + reservation.restaurant_id + ' has been edited to ' + date;   
            }
            else if(reservation.type.toLowerCase() === 'deleted')
            {
              message = 'Your reservation for ' + reservation.restaurant_id + ' on ' + date + ' has been deleted.';   
            }
            
            
            messageAttributes = { "UserId": { DataType: "String", StringValue: userId } };
            params = {
                Message: message,
                MessageAttributes: messageAttributes,
                TopicArn: topicARN,
                Subject: "Your reservation update"
            }

            await publishAsync(params);

        return {
            statusCode: 200,
            body: 'All the customers with updated reservations have been notified fo their changed reservation'
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