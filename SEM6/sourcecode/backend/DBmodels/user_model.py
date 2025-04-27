from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash,check_password_hash
import os

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

client = MongoClient(MONGODB_URI)

db = client.get_database('mapmyforest')
user_collection = db.get_collection('users')

user_collection.create_index('email', unique=True)
user_collection.create_index('username', unique=True)
class User:
    def __init__(self,username,email,password):
        self.username = username
        self.email=email
        self.password = self.hash_password(password)

    def hash_password(self,password):
        return generate_password_hash(password)
    
    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'password': self.password
        }
    
    @staticmethod
    def verify_password(stored_pass,provided_pass):
        return check_password_hash(stored_pass,provided_pass)
    

    @staticmethod
    def find_by_email(email):
        return user_collection.find_one({'email': email})

