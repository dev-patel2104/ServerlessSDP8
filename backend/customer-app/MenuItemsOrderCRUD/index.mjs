export const handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        switch (event.routeKey) {
            case "DELETE /items/{reservation_id}":

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
                    const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/items-delete`, options);
                    const responseData = await response.json();

                    // let optionsSNS = {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify(
                    //         {
                    //             restaurant_id: responseData.restaurant_id,
                    //             reservation_id: event.pathParameters.reservation_id,
                    //             reservation_time: responseData.reservation_time,
                    //             customer_id: responseData.customer_id,
                    //             type: "deleted"
                    //         })
                    // }

                    // try {
                    //     await fetch(`https://e4x258613e.execute-api.us-east-1.amazonaws.com/reservation-change`, optionsSNS);
                    // } catch (error) {
                    //     console.error('Error deleting reservation:');

                    // }
                } catch (error) {
                    console.error('Error deleting reservation:');

                }

                body = { reservation_id: event.pathParameters.reservation_id };
                break;
            case "GET /items/{reservation_id}":

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
                    const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/items-get`, optionsGetID);
                    body = await response.json();

                } catch (error) {
                    console.error('Error deleting reservation:');

                }

                break;
            case "GET /items":

                if (event.queryStringParameters?.restaurant_id) {
                    let optionsGetAllrestaurantID = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                restaurant_id: event.queryStringParameters?.restaurant_id,
                            })
                    }
                    try {
                        const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/items-get-restaurant`, optionsGetAllrestaurantID);
                        body = await response.json();

                    } catch (error) {
                        console.error('Error getting items:');
                    }

                } else {
                    // let optionsGetAll = {
                    //     method: 'GET',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     }
                    // }
                    // try {
                    //     const response = await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/reservation-get-all`, optionsGetAll);
                    //     body = await response.json();

                    // } catch (error) {
                    //     console.error('Error deleting reservation:');
                    // }
                    body = [];
                }
                break;
            case "PUT /items":
                let requestJSON = JSON.parse(event.body);

                if (requestJSON.type === "new") {
                    let optionsCreate = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                reservation_id: requestJSON.reservation_id,
                                restaurant_id: requestJSON.restaurant_id,
                                items: requestJSON.items
                            })
                    }
                    try {
                        await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/items-create`, optionsCreate);

                    } catch (error) {
                        console.error('Error creating items:');

                    }
                }else{
                    let optionsEdit = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                reservation_id: requestJSON.reservation_id,
                                restaurant_id: requestJSON.restaurant_id,
                                items: requestJSON.items
                            })
                    }
                    try {
                        await fetch(`https://us-central1-sdp-8-404403.cloudfunctions.net/items-edit`, optionsEdit);

                    } catch (error) {
                        console.error('Error editing items:');

                    }
                }

                body = { reservation_id: requestJSON.reservation_id };
                // let optionsP = {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(
                //         {
                //             restaurant_id: requestJSON.restaurant_id,
                //             reservation_id: r_id,
                //             reservation_time: requestJSON.reservation_time,
                //             customer_id: requestJSON.customer_id,
                //             type: requestJSON.reservation_id ? "edited" : "created"
                //         })
                // }

                // try {
                //     await fetch(`https://e4x258613e.execute-api.us-east-1.amazonaws.com/reservation-change`, optionsP);
                // } catch (error) {
                //     console.error('Error creating reservation:');

                // }
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