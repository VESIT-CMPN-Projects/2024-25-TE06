from flask import request,jsonify,make_response, Response
from DBmodels.user_model import user_collection,User;
from bson import ObjectId
import jwt
from datetime import datetime, timedelta, timezone
import os

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')

def generate_jwt_token(user_id):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.now(timezone.utc) + timedelta(days=7),  
        'iat': datetime.now(timezone.utc)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def decode_jwt_token(token):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return decoded_token
    except jwt.ExpiredSignatureError:
        return None  
    except jwt.InvalidTokenError:
        return None

def registerUser():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.find_by_email(email):
        return jsonify({'error': 'Email already exists'}), 400
    
    new_user = User(username=username, email=email, password=password)

    user_collection.insert_one(new_user.to_dict())

    registered_user = user_collection.find_one({'email': email})
    user_id = ObjectId(registered_user['_id'])

    print(registered_user,user_id)

    token = generate_jwt_token(user_id)

    response = make_response(jsonify({
        'message': f'User {username} registered Successfully!',
        'user': {
            'username': new_user.username,
            'email': new_user.email
        },
        'accessToken': token
    }))

    response.set_cookie('accessToken', token, max_age=7*24*60*60, path='/', domain=None, secure=False, httponly=False, samesite=None)
    return response,201


def loginUser():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user_data = User.find_by_email(email)

    if user_data is None:
        return jsonify({'error': 'User not found'}), 404

    if User.verify_password(user_data['password'], password):
        user_data['_id'] = str(user_data['_id'])
        token = generate_jwt_token(user_data['_id'])
        user_data.pop('password', None)

        response = make_response(jsonify({'message': f"Login successful {user_data['username']}", 'user': user_data,'accessToken': token}))

        response.set_cookie('accessToken', token,max_age=7*24*60*60, path='/', domain=None, secure=False, httponly=False, samesite=None)
        return response, 200
    else:
        return jsonify({'error': 'Invalid password'}), 401
    

def accessUser():
    user_id = request.user_id

    if not user_id:
        return jsonify({'error': 'No user id found'}), 400
    
    try:
        user_object_id = ObjectId(user_id)
    except:
        return jsonify({'error': 'Invalid user ID format'}), 400

    profile_data = user_collection.find_one({'_id': user_object_id})

    if not profile_data:
        return jsonify({'error': 'User not found'}), 404

    profile_data['_id'] = str(profile_data['_id'])

    return jsonify({
        'message': 'User found successfully',
        'user_profile': profile_data
    }), 200

def logoutUser():
    user_id = request.user_id

    if not user_id:
        return jsonify({'error': 'No user id found'}), 400
    
    response = make_response(jsonify({
        'message': f'User Logged Out Succesfull',
    }))
    response.delete_cookie('accessToken')
    return response,200