from flask import flash,request,jsonify
from DBmodels.projects_model import project_collection,Project
from bson import ObjectId
from pymongo import ReturnDocument
import json, requests

def createProject():
    data = request.get_json()
    project_name = data.get('project_name') 
    location = data.get('location')
    jurisdiction = data.get('jurisdiction')
    project_area = data.get("project_area")
    project_intention = data.get("project_intention")
    custom_prompt = data.get("custom_prompt")
    currentStatus = "Incomplete"
    

    user_id = request.user_id

    if not all([project_name, location, jurisdiction, user_id, project_area, project_intention]):
        return jsonify({'error': 'Missing required fields'}), 400

    if project_collection.find_one({"project_name": project_name}):
        return jsonify({'error': 'Project by same name exists'}), 400
    
    new_project = Project(
        project_name=project_name,
        location=location,
        jurisdiction=jurisdiction,
        currentStatus=currentStatus,
        project_area=project_area,
        project_intention=project_intention,
        custom_prompt=custom_prompt,
        user_id=user_id , 
    )

    project_collection.insert_one(new_project.to_dict())
    latest_created_project = project_collection.find_one({"project_name": project_name})
    latest_created_project['_id'] = str(latest_created_project['_id'])

    return jsonify({
        'message': f'Project "{project_name}" created successfully!',
        'project': latest_created_project
    }), 201

def accessAllProject():
    user_id = request.user_id

    if not user_id:
        return jsonify({'error': 'User Id not found please login again'}), 400
    
    project_group = list(project_collection.find({'user_id': user_id}))
    if not project_group:
        return jsonify({'error':'No Project found for the particular user'}), 200
    
    for project in project_group:
        project['_id'] = str(project['_id']) 

    return jsonify({
        'message': f'Project for the particular {user_id} found',
        'project_group': project_group
    }), 201

def fetchProject():
    data = request.get_json()
    project_id = data.get('project_id')

    if not project_id:
        return jsonify({'error': 'No project id found'}), 400
    
    try:
        user_object_id = ObjectId(project_id)
    except:
        return jsonify({'error': 'Invalid project ID format'}), 400

    project_data = project_collection.find_one({'_id': user_object_id})

    if not project_data:
        return jsonify({'error': 'User not found'}), 404

    project_data['_id'] = str(project_data['_id'])

    return jsonify({
        'message': 'User found successfully',
        'project_data': project_data
    }), 200

def findOneProjectAndUpdate():
    data = request.get_json()
    print(data)
    project_id = data.get('_id')

    if not ObjectId.is_valid(project_id):
        return jsonify({'error': 'Project with this id does not exists'})
    
    allowed_fields = [
        'project_name', 'location', 'jurisdiction', 'currentStatus',
        'project_area', 'project_intention', 'custom_prompt', 'tree_images', 'videoURL'
    ]
    update_data = {field: data[field] for field in allowed_fields if field in data}
    print(update_data)

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    update_project = project_collection.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$set': update_data},
        return_document=ReturnDocument.AFTER
    )
    
    if not update_project:
        return jsonify({'error': 'Project with this ID does not exist'}), 404

    update_project['_id'] = str(update_project['_id'])

    toSend = {'project_id': project_id, 'user_id': str(request.user_id)}
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post('http://localhost:5000/api/v1/project/analysis', json=toSend, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return jsonify({'message': 'Project updated, but analysis request failed', 'error': str(e)}), 500

    
    return jsonify({
        'message': 'Project Updated Successfully',
        'updated_project': update_project
    }), 200

def AddorUpdateImages():
    data = request.get_json()
    project_id = data.get('_id')

    if not ObjectId.is_valid(project_id):
        return jsonify({'error': 'Invalid project ID'}), 400
    
    new_images = data.get('tree_images')

    if not new_images or not isinstance(new_images, list):
        return jsonify({'error': 'Please provide a valid list of new images'}), 400

    updated_project = project_collection.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$push': {'tree_images': {'$each': new_images}}, '$set': {'currentStatus': 'In Progress'}},
        return_document=True
    )

    if not updated_project:
        return jsonify({'error': 'Project with this ID does not exist'}), 404

    updated_project['_id'] = str(updated_project['_id'])

    return jsonify({
        'message': 'Images added/updated successfully',
        'updated_project': updated_project
    }), 200

#dont execute its not working some issue with recursion depth
def AddNewVideo():
    data = request.get_json()
    project_id = data.get('_id')

    if not ObjectId.is_valid(project_id):
        return jsonify({'error': 'Invalid project ID'}), 400

    video_url = data.get('videoURL')

    if not video_url:
        return jsonify({'error': 'Please provide a valid video URL'}), 400

    updated_video_project = project_collection.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$set': {'videoURL': video_url}},
        return_document=True
    )

    if not updated_video_project:
        return jsonify({'error': 'Project with this ID does not exist'}), 404

    updated_video_project['_id'] = str(updated_video_project['_id'])

    return jsonify({
        'message': 'Video URL updated successfully',
        'updated_project': updated_video_project
    }), 200

def AddAnnotatedImages():
    data = request.get_json()
    project_id = data.get('project_id')
    annotated_data = json.loads(data.get('annotated_data'))

    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400
    
    if not ObjectId.is_valid(project_id):
        return jsonify({'error': 'Invalid project ID'}), 400
    
    print(annotated_data, type(annotated_data))

    if not annotated_data or not isinstance(annotated_data, list):
        return jsonify({'error': 'Annotated images should be a valid list'}), 400
    
    for entry in annotated_data:
        if not all(key in entry for key in ['url', 'count', 'percentage']):
            return jsonify({'error': 'Each annotated image must have url, count, and percentage'}), 400

    updated_project = project_collection.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$push': {'annotated_images': {'$each': annotated_data}}},
        return_document=True
    )

    if not updated_project:
        return jsonify({'error': 'Project with this ID does not exist'}), 404
    
    updated_project['_id'] = str(updated_project['_id'])

    toSend = {'project_id': project_id, 'user_id': str(request.user_id)}
    headers = {"Content-Type": "application/json"}
    print(toSend)
    response = requests.post('http://localhost:5000/api/v1/project/analysis', json=toSend, headers=headers)
    print(response.text)

    return jsonify({
        'message': 'Annotated images added successfully',
        'updated_project': updated_project
    }), 200

def completedStatus():
    data = request.get_json()
    project_id = data.get('project_id')

    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400
    
    if not ObjectId.is_valid(project_id):
        return jsonify({'error': 'Invalid project ID'}), 400

    updated_project = project_collection.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$set': {'currentStatus': 'Completed'}},
        return_document=True
    )

    if not updated_project:
        return jsonify({'error': 'Project with this ID does not exist'}), 404

    updated_project['_id'] = str(updated_project['_id'])

    return jsonify({
        'message': 'Project status updated to Completed',
        'updated_project': updated_project
    }), 200