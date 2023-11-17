import json
import boto3
import uuid
import logging

s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        key = f"{str(uuid.uuid4())}_{event['queryStringParameters']['imageFileName']}"

        url_params = {
            'Bucket': 'foodvaganza',
            'Key': key,
            'ContentType': 'image/jpeg', 
            'Expires': 10,
        }

        upload_url = s3.generate_presigned_url(
            'put_object',
            Params = url_params
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'upload_url': upload_url, 'key': key}),
        }
        
    except Exception as error:
        logging.error('Error generating pre-signed URL:', str(error))
        return {
            'statusCode': 500,
            'body': json.dumps('Error while generating url. Message: '+str(error)),
        }
