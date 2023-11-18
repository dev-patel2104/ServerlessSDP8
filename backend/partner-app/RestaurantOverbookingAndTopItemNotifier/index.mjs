import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({});
const topicARN = 'arn:aws:sns:us-east-1:263032025301:RestaurantTopic';
const publishAsync = promisify(sns.publish).bind(sns);

export const handler = async (event) => {
    try {
        let response, restaurants, reservations, menuData, messageAttributes = "";
        let message = "";
        let bookingThreshold = 20, maxBooking;
        let itemReservation = {};
        let startTime, endTime, result, cnt;

        response = await fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants`);
        restaurants = await response.json();

        const params = {
            Message: message,
            MessageAttributes: messageAttributes,
            TopicArn: topicARN,
            Subject: "Your booking statistics"
        };
        console.log("Restaurants:" + restaurants.length);


        for (const restaurant of restaurants) {

            cnt = 0;
            itemReservation = {};
            message = "";
            messageAttributes = "";
            maxBooking = 0;

            if (!restaurant.start_time || !restaurant.end_time) {
                continue;
            }

            startTime = restaurant.start_time.split(":");
            endTime = restaurant.end_time.split(":");
            startTime = parseInt(startTime);
            endTime = parseInt(endTime);
            result = endTime - startTime;
            //console.log("Result:" + result);

            response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations/restaurants/${restaurant.restaurant_id}`);
            reservations = await response.json();

            if (reservations.error) {
                continue;
            }
            else {
                if (!restaurant.max_booking_capacity) {
                    return {
                        statusCode: 404,
                        body: 'No information is available about the max booking capacity'
                    };
                }
                maxBooking = result * parseInt(restaurant.max_booking_capacity);
                if (reservations.length >= maxBooking - bookingThreshold) {
                    message += "You are being overbooked. Currently, you have " + reservations.length + " reservations and the max booking capacity is " + maxBooking + ".\n";
                }

                for (const reservation of reservations) {
                    // fetching information of the menu items booked for that particular reservation
                    response = await fetch(`https://p4mp4ngglh.execute-api.us-east-1.amazonaws.com/items/${reservation.reservation_id}`);
                    menuData = await response.json();

                    if (menuData.error) {
                        continue;
                    }
                    else {
                        menuData.items.forEach(item => {
                            const itemId = parseInt(item.item_id);
                            const quantity = parseInt(item.item_quantity);
                            const itemName = item.item_name;
                            itemReservation[itemId] = (itemReservation[itemId])
                                ? { item_name: itemReservation[itemId].item_name, quantity: itemReservation[itemId].quantity + quantity }
                                : { item_name: itemName, quantity: quantity };
                        });
                    }
                }

                if (Object.keys(itemReservation).length !== 0) {
                    const entries = Object.entries(itemReservation);
                    console.log(entries);

                    entries.sort((a, b) => b[1].quantity - a[1].quantity);

                    message += "Following are the top booked items: \n";
                    for (const entry of entries) {
                        if (cnt >= 3) {
                            break;
                        }
                        cnt++;
                        message += cnt + ") " + entry[1].item_name + "\n";
                    }
                }

                if (message !== "") {
                    messageAttributes = { "UserId": { DataType: "String", StringValue: restaurant.restaurant_id } };
                    params.Message = message;
                    params.MessageAttributes = messageAttributes;
                    console.log(params);
                    publishAsync(params);
                }

            }
        }
    }
    catch (err) {
        console.log("Some error has occurred", err);
        return {
            statusCode: 500,
            body: 'Error publishing message to SNS. Internal Server Error'
        };
    }


};
