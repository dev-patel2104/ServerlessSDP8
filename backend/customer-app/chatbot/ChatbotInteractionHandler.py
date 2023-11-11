import boto3
import json

# Initialize Amazon Lex client
lex_client = boto3.client('lexv2-runtime', region_name='us-east-1')


def communicate_with_lex(user_input, session_state):
    lex_params = {
        'botId': 'SVYMTURWHG',
        'botAliasId': 'TSTALIASID',
        'localeId': 'en_US',
        'sessionId': '300251322367761',
        'text': user_input,
        'sessionState': session_state.get('sessionState') if session_state else None
    }

    try:
        data = lex_client.recognize_text(**lex_params)
        if 'messages' in data and len(data['messages']) > 0:
            # Combine all responses
            response_texts = '~'.join([msg['content']
                                      for msg in data['messages']])
            new_session_state = data.get('sessionState')

            return {'responseTexts': response_texts, 'newSessionState': new_session_state}
        else:
            return {'responseTexts': "No response from Lex.", 'newSessionState': None}
    except Exception as err:
        raise


def handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        user_input = body.get('userInput')
        session_state = body.get('sessionState')

        if not user_input:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'missing input in request'
                })
            }

        response = communicate_with_lex(user_input, session_state)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'responseTexts': response['responseTexts'],
                'sessionState': json.dumps(response['newSessionState']) if response['newSessionState'] else None
            })
        }
    except Exception as err:
        print("Error:", err)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'An error occurred.'})
        }
