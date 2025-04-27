from flask import Blueprint
from controller.project_controller import createProject, accessAllProject,findOneProjectAndUpdate,AddNewVideo,AddorUpdateImages,fetchProject, AddAnnotatedImages, completedStatus
from middlewares.auth_middleware import authenticate

create_project = Blueprint('create_project',__name__)
access_all_project = Blueprint('accessAllProject',__name__)
find_one_project_and_update = Blueprint('find_one_project_and_update',__name__)
add_or_update_image = Blueprint('add_or_update_image',__name__)
add_new_video = Blueprint('add_new_video',__name__)
fetch_project = Blueprint('fetch_project',__name__)
add_annotated_images = Blueprint('add_annotated_images',__name__)
completed_status = Blueprint('completed_status',__name__)

@fetch_project.route('/api/v1/project/fetchproject',methods=['POST'])
@authenticate
def FetchProject():
    return fetchProject()

@create_project.route('/api/v1/project/createproject',methods=['POST'])
@authenticate
def create():
    return createProject()


@access_all_project.route('/api/v1/project/accessallproject',methods=['GET'])
@authenticate
def accessAll():
    return accessAllProject()

@find_one_project_and_update.route('/api/v1/project/findoneprojectandupdate',methods=['POST'])
@authenticate
def findOneProject():
    return findOneProjectAndUpdate()

@add_or_update_image.route('/api/v1/project/updateimage',methods=['POST'])
@authenticate
def UpdateImage():
    return AddorUpdateImages()

@add_new_video.route('/api/v1/project/addvideo',methods=['POST'])
@authenticate
def AddNewVideo():
    return AddNewVideo()

@add_annotated_images.route('/api/v1/project/addannotatedimages',methods=['POST'])
@authenticate
def handle_add_annotated_images():
    return AddAnnotatedImages()

@completed_status.route('/api/v1/project/completedstatus',methods=['POST'])
@authenticate
def handle_completed_status():
    return completedStatus()