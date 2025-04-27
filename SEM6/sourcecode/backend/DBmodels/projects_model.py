from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

client = MongoClient(MONGODB_URI)

db = client.get_database('mapmyforest')
project_collection = db.get_collection('projects')

project_collection.create_index('project_name',unique=True)
# ["Incomplete", "In Progress", "Completed"]
class Project:
    def __init__(self, project_name, location , jurisdiction, currentStatus ,user_id, project_area=None, custom_prompt="", tree_images=None, tree_types=None, videoURL="", project_intention=""):
        self.project_name = project_name
        self.location = location
        self.jurisdiction = jurisdiction
        self.currentStatus = currentStatus
        self.tree_images = tree_images if tree_images else []
        self.tree_types = tree_types if tree_types else []
        self.annotated_images = []
        self.videoURL= videoURL
        self.created_at = datetime.now()
        self.user_id = user_id
        self.project_intention = project_intention
        self.project_area = project_area
        self.custom_prompt = custom_prompt

    def add_annotatedimage_data(self, url, count, percentage, classifications):
        annotated_image = {
            'url': url,
            'count': count,
            'percentage': percentage,
            'classifications': classifications
        }
        self.annotated_images.append(annotated_image)

    def to_dict(self):
        return {
            'project_name': self.project_name,
            'location': self.location,
            'jurisdiction': self.jurisdiction,
            'currentStatus': self.currentStatus,
            'created_at': self.created_at.isoformat(),
            'tree_images': self.tree_images,
            'tree_types': self.tree_types,
            'annotated_images': self.annotated_images,
            'videoURL': self.videoURL,
            'user_id': self.user_id,
            'project_area': self.project_area,
            'project_intention': self.project_intention,
            'custom_prompt': self.custom_prompt
        }