import boto3
import json
from credentials import *
# Initialize the DynamoDB client
dynamodb = boto3.client(
    'dynamodb',
    region_name=REGION,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    aws_session_token=SESSION_TOKEN)

file_to_upload = 'restaurant-data.json'

with open(file_to_upload) as json_file:
    data = json.load(json_file)

# Iterate each restaurant
for item in data:
    menu_items = []
    # Iterate all menu items
    for menu_item in item['menu']:
        item_size_price = menu_item.get('item_size_price')
        item_size_price_dynamo = []
        # Iterate item size prices 
        for size_price in item_size_price:
            # 'type' is optional attribute for a menu item
            item_size_dict = {
                'M': {
                    'size': {'S': size_price['size']},
                    'price': {'N': str(size_price['price'])}
                }
            }
            if menu_item.get('type'):
                item_size_dict['M']['type'] = {'S': menu_item.get('type')}
            
            item_size_price_dynamo.append(item_size_dict)
                
        menu_item_dict = {
            'M': {
                'item_id': {'N': menu_item['item_id']},
                'item_name': {'S': menu_item['item_name']},
                'item_description': {'S': menu_item['item_description']},
                'category': {'S': menu_item['category']},
                'item_image_path': {'S': menu_item['item_image_path']},
                'is_available': {'BOOL': menu_item['is_available']},
                'item_qty': {'N': str(menu_item['item_qty'])},
                'item_size_price': {'L': item_size_price_dynamo}
            }
        }
        if menu_item.get('item_type'):
            menu_item_dict['M']['item_type'] = {'S': menu_item.get('item_type')}
            
        menu_items.append(menu_item_dict)

    # Put each restaurant to DynamoDB Table
    # https://docs.aws.amazon.com/cli/latest/reference/dynamodb/put-item.html
    response = dynamodb.put_item(
        TableName='restaurant',
        Item={
            'restaurant_id': {'S': item['restaurant_id']},
            'name': {'S': item['name']},
            'address': {'S': item['address']},
            'start_time': {'S': item['start_time']},
            'end_time': {'S': item['end_time']},
            'contact': {'N': str(item['contact'])},
            'fb_link': {'S': item['fb_link']},
            'insta_link': {'S': item['insta_link']},
            'store_link': {'S': item['store_link']},
            'online_delivery': {'BOOL': item['online_delivery']},
            'tagline': {'S': item['tagline']},
            'max_booking_capacity': {'N': str(item['max_booking_capacity'])},
            'image_path': {'S': item['image_path']},
            'menu': {'L': menu_items},
            'is_new': {'BOOL': item['is_new']}
        }
    )

print("Pushed data successfully to DynamoDB table: 'restaurant'")