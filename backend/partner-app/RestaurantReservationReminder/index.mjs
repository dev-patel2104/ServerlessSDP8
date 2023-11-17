import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({});
const topicARN = 'arn:aws:sns:us-east-1:263032025301:RestaurantTopic';
const publishAsync = promisify(sns.publish).bind(sns);

export const handler = async (event) => {

    try {
        const response = await fetch("https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations");
        const reservations = await response.json();

        const putOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: ""
        };

        let date, message;
        let currentTime, messageAttributes, params, cnt = 0;
        const oneHourInMilliseconds = 60 * 60 * 1000;
        const tenMinutesInMilliseconds = 10 * 60 * 1000;
        let menuResponse, menuData;
        for (const reservation of reservations) {
            if (reservation.is_restaurant_notified === undefined || reservation.is_restaurant_notified === null) {
                continue;
            }
            else {
                if (!reservation.is_restaurant_notified) {
                    currentTime = new Date();
                    date = new Date(reservation.reservation_time);
                    const timeDifference = date - currentTime;
                    console.log("reservation Date:   " + timeDifference);
                    menuResponse = await fetch(`https://p4mp4ngglh.execute-api.us-east-1.amazonaws.com/items/${reservation.reservation_id}`);
                    menuData = await menuResponse.json();

                    if (menuData.items === undefined || menuData.items === null || menuData.items.length === 0) {
                        if (timeDifference <= tenMinutesInMilliseconds && timeDifference >= 0) {
                            messageAttributes = { "UserId": { DataType: "String", StringValue: reservation.restaurant_id } };
                            message = "You have an upcoming reservation made by: " + reservation.customer_id + " in approximately 10 min without any menu items booked which is at " + date ;
                            params = {
                                Message: message,
                                MessageAttributes: messageAttributes,
                                TopicArn: topicARN
                            };
                            cnt++;
                            await publishAsync(params);
                            reservation.is_restaurant_notified = true;  // ask harsh to add this key-value pair in the reservation table

                            putOptions.body = JSON.stringify(reservation);
                            const response2 = await fetch('https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations', putOptions);

                            // console.log(reservation.id);
                            // console.log(Math.abs(timeDifference) + "----" + oneHourInMilliseconds);
                            // console.log("The time difference is less than 30 min");

                        }

                    }
                    else {
                        if (timeDifference <= oneHourInMilliseconds && timeDifference >= 0) {
                            messageAttributes = { "UserId": { DataType: "String", StringValue: reservation.restaurant_id } };
                            message = "You have an upcoming reservation made by: " + reservation.customer_id + " in approximately 1 hour which is at " + date + " with the following menu items " + menuData.items;
                            params = {
                                Message: message,
                                MessageAttributes: messageAttributes,
                                TopicArn: topicARN
                            };
                            cnt++;
                            await publishAsync(params);
                            reservation.is_restaurant_notified = true;  // ask harsh to add this key-value pair in the reservation table

                            putOptions.body = JSON.stringify(reservation);
                            const response2 = await fetch('https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations', putOptions);

                            // console.log(reservation.id);
                            // console.log(Math.abs(timeDifference) + "----" + oneHourInMilliseconds);
                            // console.log("The time difference is less than 30 min");

                        }
                    }
                    
                }
            }

        }
        if (cnt == 0) {
            return {
                statusCode: 200,
                body: 'No change has been made to reservations and no user has been notified.'
            };
        }
        else {
            return {
                statusCode: 200,
                body: 'Message published to corresponding SNS topics.'
            };
        }

        // store the changes reservation table back to the database
    }
    catch (err) {
        console.log("Some error has occurred", err);
        return {
            statusCode: 500,
            body: 'Error publishing message to SNS. Internal Server Error'
        };
    }

}