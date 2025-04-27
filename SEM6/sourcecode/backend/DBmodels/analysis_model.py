from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

client = MongoClient(MONGODB_URI)

db = client.get_database('mapmyforest')
analysis_collection = db.get_collection('analysis')

class Analysis:
    def __init__(self,project_id,user_id,analysis):
        self.project_id = project_id
        self.user_id = user_id
        self.analysis = analysis

    def to_dict(self):
        return{
            'project_id': self.project_id,
            'user_id': self.user_id,
            'analysis': self.analysis 
        }