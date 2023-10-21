import { SNS } from "@aws-sdk/client-sns";
import { promisify } from 'util';

const sns = new SNS({});
const topicARN = 'arn:aws:sns:us-east-1:263032025301:DemoTopicSNS';
const message = "You have an upcoming reservation in 30 min";
const publishAsync = promisify(sns.publish).bind(sns);

export const handler = async (event) => {

    // call harsh's lamda that gives me all the information from the reservation table;
    // const reservations = [
    //     {
    //         id: "1",
    //         timeStamp: "1697838940",
    //         isNotified: true
    //     },
    //     {
    //         id: "2",
    //         timeStamp: "1697842240",
    //         isNotified: false
    //     },
    //     {
    //         id: "3",
    //         timeStamp: "1697839240",
    //         isNotified: false
    //     }
    // ];

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
        
        let date;
        let currentTime, messageAttributes, params, cnt = 0;
        const thirtyMinutesInMilliseconds = 30 * 60 * 1000;
        for(const reservation of reservations)
        {
          if (!reservation.is_notified) {
                currentTime = new Date();
                date = new Date(reservation.reservation_time);
                const timeDifference = date - currentTime;
                console.log("reservation Date:   " + timeDifference);
                if (timeDifference <= thirtyMinutesInMilliseconds && timeDifference >= 0) {
                    messageAttributes = { "UserId": { DataType: "String", StringValue: reservation.customer_id } };
                    
                    params = {
                        Message: message,
                        MessageAttributes: messageAttributes,
                        TopicArn: topicARN
                    };
                    cnt++;
                    await publishAsync(params);
                    reservation.is_notified = true;  // need to change this once fetched from harsh database
                    
                    putOptions.body = JSON.stringify(reservation);
                    const response2 = await fetch('https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations', putOptions);
                    
                    // console.log(reservation.id);
                    // console.log(Math.abs(timeDifference) + "----" + thirtyMinutesInMilliseconds);
                    // console.log("The time difference is less than 30 min");
                  
                }
            }  
        }
        if(cnt == 0)
        {
            return {
                statusCode: 200,
                body: 'No change has been made to reservations and no user has been notified.'
            };
        }
        else
        {
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