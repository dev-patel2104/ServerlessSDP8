import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { uuid } from 'uuidv4';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "reservations";

export const handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        switch (event.routeKey) {
            case "DELETE /reservations/{reservation_id}":
                await dynamo.send(
                    new DeleteCommand({
                        TableName: tableName,
                        Key: {
                            reservation_id: event.pathParameters.reservation_id,
                        },
                    })
                );
                body = {reservation_id: event.pathParameters.reservation_id};
                break;
            case "GET /reservations/{reservation_id}":
                body = await dynamo.send(
                    new GetCommand({
                        TableName: tableName,
                        Key: {
                            reservation_id: event.pathParameters.reservation_id
                        },
                    })
                );
                body = body.Item;
                break;
            case "GET /reservations":
               
                if(event.queryStringParameters.customer_id){
                    body = await dynamo.send(
                        new ScanCommand({ TableName: tableName })
                    );
                    body = body.Items;
                    body = body.filter((item) => item.customer_id === event.queryStringParameters.customer_id);
                }else{
                    body = await dynamo.send(
                        new ScanCommand({ TableName: tableName })
                    );
                    body = body.Items;
                }
                break;
            case "PUT /reservations":
                let requestJSON = JSON.parse(event.body);
                let r_id = requestJSON.reservation_id ?? uuid();
                await dynamo.send(
                    new PutCommand({
                        TableName: tableName,
                        Item: {
                            reservation_id: r_id,
                            restaurant_id: requestJSON.restaurant_id,
                            customer_id: requestJSON.customer_id,
                            reservation_time: requestJSON.reservation_time,
                            reservation_status: requestJSON.reservation_status,
                            is_notified: requestJSON.is_notified
                        }
                    })
                );
                body = {reservation_id: r_id};
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