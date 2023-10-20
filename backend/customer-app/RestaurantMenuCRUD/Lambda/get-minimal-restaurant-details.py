import json
import boto3
from boto3.dynamodb.types import TypeDeserializer
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

def ddb_deserialize(r, type_deserializer = TypeDeserializer()):
    return type_deserializer.deserialize({"M": r})

def lambda_handler(event, context):
    new_images = [ ddb_deserialize(r["dynamodb"]["NewImage"]) for r in event['Records'] ]
    print('Converted records', json.dumps(new_images, indent=2))

def from_dynamodb_to_json(item):
    d = TypeDeserializer()
    return {k: d.deserialize(value=v) for k, v in item.items()}


def function():
    with open('sample.json') as f:
        restaurant_data = json.loads(f.read())
        
    ## Usage:
    x = from_dynamodb_to_json(restaurant_data)
    print(x)
    
    
    # final_response=[]
    # for restaurant in restaurant_data:
    #     dynamo_to_json_data = {}
    #     for key, value in restaurant.items():
    #         if key == "menu":
    #             final_menu=[]
    #             for menu in value:
    #                 menu_items={}
    #                 for menu_key, menu_value in value.items():
    #                     if key == "item_size_price":
    #                         item_size_price = []
    #                         for size_key, size_value in value.items():
                                
                            
    #                     menu_items[menu_key] = list(menu_value.values())[0]
    #                 menu_items.append(menu)
    #         print("key -->",key)
    #         print("value -->",value)
            
            
            
    #         dynamo_to_json_data[key] = list(value.values())[0]
    #     final_response.append(dynamo_to_json_data)
        

def lambda_handler(event, context):
    
    dynamodb_client = boto3.client('dynamodb')
    
    # https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
    # max- 1MB data
    restaurant_data = dynamodb_client.scan(
        TableName='restaurant',
    )
    print("restaurant_data --> ",restaurant_data)
    
    
    # Convert DynamoDB response to JSON format
    final_response=[]
    for restaurant in restaurant_data["Items"]:
        dynamo_to_json_data = {}
        for key, value in restaurant.items():
            print("key -->",key)
            print("value -->",value)
            
            dynamo_to_json_data[key] = list(value.values())[0]
        final_response.append(dynamo_to_json_data)
        
    
    return {
        'statusCode': 200,
        'body': json.dumps(final_response)
    }


function()