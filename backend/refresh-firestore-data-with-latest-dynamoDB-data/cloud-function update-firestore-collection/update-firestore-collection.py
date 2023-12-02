import functions_framework

# import firebase SDK
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Cloud Function Entry Point 
@functions_framework.http
def hello_http(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    request_json = request.get_json(silent=True)
    request_args = request.args
    try:
        # Initialize Firebase Admin SDK
        cred = credentials.ApplicationDefault()
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred, {
                'projectId': 'csci5408-data-management',
            })
        else:
            firebase_admin.get_app(name='[DEFAULT]')
        # Reference: https://stackoverflow.com/questions/68426892/why-i-get-this-error-on-python-firebase-admin-initialize-app

        print("request_json -> ",request_json.keys())
        print("request json['body'] -> ",request_json['body'])
        data = request_json['body']

        firestore_db = firestore.client()
        all_restaurant_ids = []
        for restaurant_data in data:
            # Get restaurant ID
            restaurant_id = restaurant_data['restaurant_id']
            all_restaurant_ids.append(restaurant_id)

            # Get new document reference in firestore with a unique ID
            restaurant_ref = firestore_db.collection('restaurants').document(restaurant_id)

            # If already exist then update restaurant details
            if restaurant_ref.get().exists:
                restaurant_ref.update(restaurant_data)
            
            # Else add new restaurant details
            else:
                restaurant_ref.set(restaurant_data)

        # Get the restaurant ids not in DynamoDB but in Firestore collection and delete them
        all_collection_ids = [collection.id for collection in firestore_db.collection('restaurants').stream()]
        deleted_restaurant_ids = list(set(all_collection_ids) - set(all_restaurant_ids))
        for deleted_id in deleted_restaurant_ids:
            firestore_db.collection('restaurants').document(deleted_id).delete()
        
        return {
            "status":True,
            "message": "Firestore 'restaurants' collection updated successfully."
        }

    except Exception as error:
        return {
            "status":False,
            "message": "Unable to update Firestore 'restaurants' collection, error message: "+str(error)
        }
