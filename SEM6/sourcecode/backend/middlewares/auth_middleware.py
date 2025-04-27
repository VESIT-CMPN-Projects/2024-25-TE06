from flask import request, jsonify
import jwt
from DBmodels.user_model import user_collection
from controller.user_controller import decode_jwt_token
import os
from bson.objectid import ObjectId

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')

def authenticate(f):
    def wrapper(*args, **kwargs):
        token = request.cookies.get('accessToken')
        
        if not token:
            return jsonify({'error': 'Authentication token is missing!'}), 401

        try:
            decoded_token = decode_jwt_token(token)
            user_id = decoded_token.get('user_id')


            if not ObjectId.is_valid(user_id):  # Ensure valid ObjectId
                return jsonify({'error': 'Invalid user ID format in token'}), 401

            user = user_collection.find_one({'_id': ObjectId(user_id)})

            if not user:
                return jsonify({'error': 'Invalid token or user not found'}), 401
            
            user['_id'] = str(user['_id'])

            request.user_id = user['_id']  # Attach user info to request
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired Login again'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper
