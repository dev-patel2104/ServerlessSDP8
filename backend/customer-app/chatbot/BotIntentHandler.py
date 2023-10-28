# lamda function for chatbot

import boto3
from boto3.dynamodb.conditions import Key
import uuid

dynamodb = boto3.resource('dynamodb')
restaurant_table = dynamodb.Table('restaurant')
reviews_table = dynamodb.Table('reviews')
menu_item_reviews_table = dynamodb.Table('menu_item_reviews')
ratings_table = dynamodb.Table('ratings')
reservations_table = dynamodb.Table('reservations')


def FoodvaganzaIntentHandler(event, context):
    intent_name = event['sessionState']['intent']['name']

    if intent_name == "getMenuAvailability":
        return get_menu_availability(event)
    elif intent_name == "submitRestaurantReview":
        return submit_restaurant_review(event)
    elif intent_name == "submitMenuItemReview":
        return submit_menu_item_review(event)
    elif intent_name == "rateRestaurant":
        return rate_restaurant(event)
    elif intent_name == "bookReservation":
        return book_reservation(event)
    elif intent_name == "getOpeningTimes":
        return get_opening_times(event)
    elif intent_name == "getRestaurantLocation":
        return get_restaurant_location(event)
    elif intent_name == "bookReservationWithMenu":
        return book_reservation_with_menu(event)
    elif intent_name == "getRestaurants":
        return get_restaurants(event)
    elif intent_name == "getReservationAvailability":
        return get_reservation_availability(event)
    else:
        return {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Failed',
                'message': {
                    'contentType': 'PlainText',
                    'content': 'Sorry, I couldn’t follow that.'
                }
            }
        }


def get_restaurants(event):
    scan_results = restaurant_table.scan()
    restaurants = scan_results['Items']

    restaurant_names = [restaurant['name'].encode(
        'utf-8').decode('unicode_escape') for restaurant in restaurants]

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': f"Available restaurants are: {', '.join(restaurant_names)}"
            }
        }
    }


def get_reservation_availability(event):
    restaurant_id = event['currentIntent']['slots']['restaurant_id']
    date_time = event['currentIntent']['slots']['date_time']

    response = reservations_table.query(
        KeyConditionExpression=Key('restaurant_id').eq(
            restaurant_id) & Key('date_time').eq(date_time)
    )
    reservations = response['Items']

    if len(reservations) > 0:
        return {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Fulfilled',
                'message': {
                    'contentType': 'PlainText',
                    'content': "Sorry, the reservation slot is not available."
                }
            }
        }
    else:
        return {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Fulfilled',
                'message': {
                    'contentType': 'PlainText',
                    'content': "The reservation slot is available!"
                }
            }
        }


def get_menu_availability(event):
    restaurant_id = event['currentIntent']['slots']['restaurant_id']

    response = restaurant_table.get_item(Key={'restaurant_id': restaurant_id})

    if 'Item' not in response:
        return {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Failed',
                'message': {
                    'contentType': 'PlainText',
                    'content': 'Restaurant not found.'
                }
            }
        }

    menu_items = response['Item']['menu']
    available_items = [item['item_name']
                       for item in menu_items if item['is_available']]

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': f"Available menu items are: {', '.join(available_items)}"
            }
        }
    }


def submit_restaurant_review(event):
    review_text = event['currentIntent']['slots']['review_text']
    restaurant_id = event['currentIntent']['slots']['restaurant_id']

    reviews_table.put_item(
        Item={
            'review_id': str(uuid.uuid4()),
            'restaurant_id': restaurant_id,
            'review_text': review_text
        }
    )

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': "Thank you for your review!"
            }
        }
    }


def rate_restaurant(event):
    rating = event['currentIntent']['slots']['rating']
    restaurant_id = event['currentIntent']['slots']['restaurant_id']

    ratings_table.put_item(
        Item={
            'rating_id': str(uuid.uuid4()),
            'restaurant_id': restaurant_id,
            'rating': rating
        }
    )

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': "Thank you for rating the restaurant!"
            }
        }
    }


def book_reservation(event):
    number_of_people = event['currentIntent']['slots']['number_of_people']
    date_time = event['currentIntent']['slots']['date_time']
    restaurant_id = event['currentIntent']['slots']['restaurant_id']

    reservations_table.put_item(
        Item={
            'reservation_id': str(uuid.uuid4()),
            'restaurant_id': restaurant_id,
            'number_of_people': number_of_people,
            'date_time': date_time
        }
    )

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': "Your reservation has been booked!"
            }
        }
    }


def get_opening_times(event):
    restaurant_id = event['currentIntent']['slots']['restaurant_id']

    response = restaurant_table.get_item(Key={'restaurant_id': restaurant_id})

    if 'Item' not in response:
        return {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Failed',
                'message': {
                    'contentType': 'PlainText',
                    'content': 'Restaurant not found.'
                }
            }
        }

    start_time = response['Item']['start_time']
    end_time = response['Item']['end_time']

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': f"The restaurant opens at {start_time} and closes at {end_time}."
            }
        }
    }


def get_restaurant_location(event):
    restaurant_id = event['currentIntent']['slots']['restaurant_id']

    response = restaurant_table.get_item(Key={'restaurant_id': restaurant_id})

    if 'Item' not in response:
        return {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Failed',
                'message': {
                    'contentType': 'PlainText',
                    'content': 'Restaurant not found.'
                }
            }
        }

    address = response['Item']['address']

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': f"The restaurant is located at: {address}."
            }
        }
    }


def submit_menu_item_review(event):
    review_text = event['currentIntent']['slots']['review_text']
    item_id = event['currentIntent']['slots']['item_id']

    menu_item_reviews_table.put_item(
        Item={
            'review_id': str(uuid.uuid4()),
            'item_id': item_id,
            'review_text': review_text
        }
    )

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': "Thank you for your review on the menu item!"
            }
        }
    }


def book_reservation_with_menu(event):
    number_of_people = event['currentIntent']['slots']['number_of_people']
    date_time = event['currentIntent']['slots']['date_time']
    restaurant_id = event['currentIntent']['slots']['restaurant_id']
    # Assumed slot name
    menu_items = event['currentIntent']['slots']['menu_items']

    reservations_table.put_item(
        Item={
            'reservation_id': str(uuid.uuid4()),
            'restaurant_id': restaurant_id,
            'number_of_people': number_of_people,
            'date_time': date_time,
            'menu_items': menu_items
        }
    )

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': "Your reservation with menu choices has been booked!"
            }
        }
    }
