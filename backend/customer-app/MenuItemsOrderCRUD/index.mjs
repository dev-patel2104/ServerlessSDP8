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

                    let optionsSNS = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                reservation_id: event.pathParameters.reservation_id,
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
            case "GET /items-count":

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
                        const itemsList = await response.json();
                        
                        if(itemsList?.error){
                            body = [];
                            break
                        }

                        const itemMap = new Map();

                        itemsList.forEach((reservation) => {
                            reservation.items.forEach((item) => {
                                const { item_id, item_quantity } = item;
                                if (itemMap.has(item_id)) {
                                    itemMap.set(item_id, itemMap.get(item_id) + item_quantity);
                                } else {
                                    itemMap.set(item_id, item_quantity);
                                }
                            });
                        });

                        const itemList = [];

                        itemMap.forEach((item_quantity, item_id) => {
                            itemList.push({ item_id, item_quantity });
                        });
                        
                        body = itemList;
                    } catch (error) {
                        console.error('Error getting items:');
                    }

                } else {
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
                } else {
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
                let optionsP = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            reservation_id: requestJSON.reservation_id,
                            restaurant_id: requestJSON.restaurant_id,
                            type: requestJSON.type === "new" ? "created":"edited"
                        })
                }

                try {
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