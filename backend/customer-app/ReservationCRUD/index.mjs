// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import {
//     DynamoDBDocumentClient,
//     ScanCommand,
//     PutCommand,
//     GetCommand,
//     DeleteCommand,
// } from "@aws-sdk/lib-dynamodb";
import { uuid } from 'uuidv4';

// const client = new DynamoDBClient({});

// const dynamo = DynamoDBDocumentClient.from(client);

// const tableName = "reservations";

export const handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        switch (event.routeKey) {
            case "DELETE /reservations/{reservation_id}":

                let options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            reservation_id: event.pathParameters.reservation_id,
                        })
                }
                try {
                    const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/reservation-delete`, options);
                    const responseData = await response.json();

                    let optionsSNS = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                restaurant_id: responseData.restaurant_id,
                                reservation_id: event.pathParameters.reservation_id,
                                reservation_time: responseData.reservation_time,
                                customer_id: responseData.customer_id,
                                type: "deleted"
                            })
                    }

                    try {
                        await fetch(`https://e4x258613e.execute-api.us-east-1.amazonaws.com/reservation-change`, optionsSNS);
                    } catch (error) {
                        console.error('Error deleting reservation:');

                    }
                } catch (error) {
                    console.error('Error deleting reservation:');

                }

                body = { reservation_id: event.pathParameters.reservation_id };
                break;
            case "GET /reservations/{reservation_id}":

                let optionsGetID = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            reservation_id: event.pathParameters.reservation_id,
                        })
                }
                try {
                    const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/reservation-get`, optionsGetID);
                    body = await response.json();

                } catch (error) {
                    console.error('Error deleting reservation:');

                }

                break;
            case "GET /reservations/restaurants/{restaurant_id}":

                let optionsGetResID = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            restaurant_id: event.pathParameters.restaurant_id,
                        })
                }
                try {
                    const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/reservation-get-all-restaurant-id`, optionsGetResID);
                    body = await response.json();

                } catch (error) {
                    console.error('Error getting reservation:');

                }

                break;
            case "GET /reservations":

                if (event.queryStringParameters?.customer_id) {
                    let optionsGetAllCustomerID = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                customer_id: event.queryStringParameters?.customer_id,
                            })
                    }
                    try {
                        const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/reservation-get-all-customer-id`, optionsGetAllCustomerID);
                        body = await response.json();

                    } catch (error) {
                        console.error('Error deleting reservation:');
                    }

                } else {
                    let optionsGetAll = {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                    try {
                        const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/reservation-get-all`, optionsGetAll);
                        body = await response.json();

                    } catch (error) {
                        console.error('Error deleting reservation:');
                    }
                }
                break;
            case "PUT /reservations":
                let requestJSON = JSON.parse(event.body);
                let r_id = requestJSON.reservation_id ?? uuid();

                let currentReservations;

                let optionsGetCount = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            restaurant_id: requestJSON.restaurant_id,
                            reservation_time: requestJSON.reservation_time,
                        })
                }

                try {
                    const resp = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/reservation-get-time`, optionsGetCount);
                    const data = await resp.json();
                    currentReservations = data.length;

                } catch (error) {
                    console.error('Error getting current reservations:');
                }
                let maxCapacity;
                try {
                    const restRes = await fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants/${requestJSON.restaurant_id}`);
                    const resDet = await restRes.json();

                    maxCapacity = resDet.max_booking_capacity;

                } catch (error) {
                    console.error('Error getting max capacity:');
                }

                if (maxCapacity <= currentReservations) {
                    body = { error: "full-capacity" };
                    break;
                }

                if (requestJSON?.reservation_id) {

                    let optionsEdit = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                reservation_id: r_id,
                                restaurant_id: requestJSON.restaurant_id,
                                reservation_time: requestJSON.reservation_time,
                                customer_id: requestJSON.customer_id,
                                reservation_status: requestJSON.reservation_status,
                                is_notified: requestJSON.is_notified,
                                is_restaurant_notified: requestJSON.is_restaurant_notified
                            })
                    }
                    try {
                        await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/edit-reservation`, optionsEdit);

                    } catch (error) {
                        console.error('Error editing reservation:');

                    }
                } else {
                    let optionsCreate = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                reservation_id: r_id,
                                restaurant_id: requestJSON.restaurant_id,
                                reservation_time: requestJSON.reservation_time,
                                customer_id: requestJSON.customer_id,
                                reservation_status: requestJSON.reservation_status,
                                is_notified: requestJSON.is_notified,
                                is_restaurant_notified: requestJSON.is_restaurant_notified
                            })
                    }
                    try {
                        await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/reservation-create`, optionsCreate);

                    } catch (error) {
                        console.error('Error creating reservation:');

                    }
                }

                body = { reservation_id: r_id };
                let optionsP = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            restaurant_id: requestJSON.restaurant_id,
                            reservation_id: r_id,
                            reservation_time: requestJSON.reservation_time,
                            customer_id: requestJSON.customer_id,
                            type: requestJSON.reservation_id ? "edited" : "created"
                        })
                }

                try {
                    if (requestJSON.type === "variable") {
                        break;
                    }
                    await fetch(`https://e4x258613e.execute-api.us-east-1.amazonaws.com/reservation-change`, optionsP);
                } catch (error) {
                    console.error('Error creating reservation:');

                }
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};