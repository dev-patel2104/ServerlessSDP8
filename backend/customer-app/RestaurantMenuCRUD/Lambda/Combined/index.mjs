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

const tableName = "restaurant";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {

      case "DELETE /restaurants/{restaurant_id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              restaurant_id: event.pathParameters.restaurant_id,
            },
          })
        );
        body = {restaurant_id: event.pathParameters.restaurant_id};
        break;

      case "GET /restaurants/{restaurant_id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              restaurant_id: event.pathParameters.restaurant_id,
            },
          })
        );
        body = body.Item;
        break;

      case "GET /restaurants":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
        
      case "PUT /restaurants":
        let requestJSON = JSON.parse(event.body);
        let rest_id = requestJSON.restaurant_id ?? uuid()
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              restaurant_id: rest_id,
              menu: requestJSON.menu,
              contact: requestJSON.contact,
              image_path: requestJSON.image_path,
              address: requestJSON.address,
              start_time: requestJSON.start_time,
              end_time: requestJSON.end_time,
              store_link: requestJSON.store_link,
              name: requestJSON.name,
              max_booking_capacity: requestJSON.max_booking_capacity,
              tagline: requestJSON.tagline,
              fb_link: requestJSON.fb_link,
              x_link: requestJSON.x_link,
              is_new: requestJSON.is_new
            },
          })
        );
        body = {restaurant_id: rest_id};
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
// Reference: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html#http-api-dynamo-db-create-api