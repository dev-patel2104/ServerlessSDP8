import json
import boto3
import logging

def deserailise_dynamodb_json(restaurant_data):
    # restaurant_data = json.loads(open('data.json','r').read())["Item"]
    final_response=[]
    dynamo_to_json_data = {}
    for key, value in restaurant_data.items():
        if key == "menu":
            for _,menu in value.items():
                menu_items={}
                for menu_key,menu_value in menu[0]["M"].items():
                    if menu_key == "item_size_price":
                        item_size_price = []
                        for size_value in menu_value['L']:
                            print("size_value -->",size_value['M'])
                            size_attribute = {}
                            for size_key, size_map in size_value['M'].items():
                                size_attribute[size_key] = list(size_map.values())[0]
                            item_size_price.append(size_attribute)
                        menu_items["item_size_price"] = item_size_price
                    else:
                        menu_items[menu_key] = list(menu_value.values())[0]
            dynamo_to_json_data[key] = menu_items
        else:
            dynamo_to_json_data[key] = list(value.values())[0]
        final_response.append(dynamo_to_json_data)
    return final_response

def lambda_handler(event, context):    
    try:
        dynamodb_client = boto3.client('dynamodb')
        # https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
        # max- 1MB data
        print(event.keys())
        logging.error(event.keys())
        logging.error(event)
        print(event)
        restaurant_data = dynamodb_client.get_item( TableName='restaurant',
                                                Key={'restaurant_id': {'N': event["body"]["restaurant_id"]}}
                                            )
        final_response = deserailise_dynamodb_json(restaurant_data["Item"])
        print("final_response -> ", final_response[0].keys())
        return {
            'statusCode': 200,
            'body': json.dumps(final_response)
        }
    except KeyError as e:
        return {
            'statusCode': 400,  # Bad Request
            'body': json.dumps({'error': 'restaurant_id is missing'})
        }
