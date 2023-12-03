import json
import requests
import os

def lambda_handler(event, context):
    # Get restaurant data
    restaurant_data = json.loads(event["body"])
    # POST data to cloud function
    response = requests.post(os.environ["CLOUD_FUNCTION_URL"] , json = {"body":restaurant_data})
    # return response result
    return response.json()
