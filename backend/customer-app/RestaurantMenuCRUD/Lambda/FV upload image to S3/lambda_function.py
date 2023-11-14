import json
import base64
import boto3

def lambda_handler(event, context):
    try:
        request_data = json.loads(event['body'])
        # get request data
        base64_data = request_data['base64_data']
        menu_item_id = request_data['menu_item_id']
        restaurant_id = request_data['restaurant_id']
        
        image_data = base64.b64decode(base64_data)

        s3_bucket = 'foodvaganza'
        s3_key = f'{restaurant_id}/{menu_item_id}.jpg'

        # (PUT) Upload image to S3
        s3 = boto3.client('s3')
        s3.put_object(Body=image_data, Bucket=s3_bucket, Key=s3_key)

        # Return menu item id for success operation
        return json.dumps({
            'statusCode': 200,
            'key': f'{menu_item_id}.jpg'
        })

    except Exception as e:
        print(f'Error: {str(e)}')
        return {
            'statusCode': 500,
            'body': json.dumps('Error uploading image to S3')
        }
