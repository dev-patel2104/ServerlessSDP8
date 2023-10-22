import SNS from '@aws-sdk/client-sns';
import { promisify } from 'util';

const sns = new SNS({});
const publishAsync = promisify(sns.publish).bind(sns);
const topicARN = 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS';

export const handler = async (event) => {

    // assuming that I will get the updated reservation and menu item changes in my event when it is called from edit reservation and menu item api

    const reservations = [
        {
            "restaurant_id": "1",
            "reservation_time": 1697858741141,
            "reservation_id": "a32bcbfb-c7c8-418f-9591-c9de52448652",
            "reservation_status": "unconfirmed",
            "customer_id": "1",
            "is_notified": true
        },
        {
            "restaurant_id": "1",
            "reservation_time": 1697858741141,
            "reservation_id": "a32bcbfb-c7c8-418f-9591-c9de52448652",
            "reservation_status": "unconfirmed",
            "customer_id": "1",
            "is_notified": true
        },
        {
            "restaurant_id": "1",
            "reservation_time": 1697858741141,
            "reservation_id": "a32bcbfb-c7c8-418f-9591-c9de52448652",
            "reservation_status": "unconfirmed",
            "customer_id": "1",
            "is_notified": true
        }
    ];

    try {
        const putOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: ""
        };
        let message, messageAttributes, params, newDate, oldDate;
        for (const reservation of reservations) {
            oldDate = new Date();  // this will later be changed to the actual previous timeStamp value once actual data is avaialable
            newdate = new Date(reservation.reservation_time)

            // Also check whether the menu item has been changed or not if yes then do the following changes in the message accordingly
            message = 'Your reservation has been updated from ' + oldDate + ' to the following time ' + newDate;
            messageAttributes = { "UserId": { DataType: "String", StringValue: reservation.customer_id } };
            params = {
                Message: message,
                MessageAttributes: messageAttributes,
                TopicArn: topicARN
            }

            //await publishAsync(params);
            // if the changes where not handler then I will call the put method for each reservation and make
            // the corresponding changes to the database for each reservation
        }

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
