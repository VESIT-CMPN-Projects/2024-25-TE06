from flask import flash,request,jsonify
from DBmodels.projects_model import project_collection,Project
from DBmodels.analysis_model import analysis_collection,Analysis
from bson import ObjectId
from controller.helperLLM import generate_Analysis;

def CreateNewOrUpdateAnalysis():
    data = request.get_json()
    project_id = data.get('project_id')
    # user_id = request.user_id
    user_id = data.get('user_id')

    new_project_id = ObjectId(project_id)

    projectData = project_collection.find_one({'_id': new_project_id})

    if not projectData:
        return jsonify({'error': 'Project not found'}), 404
    
    projectData['_id'] = str(projectData['_id'])

    classifications = set()
    for image in projectData['annotated_images']:
        classifications.union(set(image['classifications']))

    analysis = generate_Analysis({
                                    'location': projectData['location'], 
                                    'count': sum([image['count'] for image in projectData['annotated_images']]),
                                    'classifications': classifications,
                                    'percentage': sum([image['percentage'] for image in projectData['annotated_images']]) / len(projectData['annotated_images']),
                                    'jurisdiction': projectData['jurisdiction'],
                                    'project_intention': projectData['project_intention'],
                                    'custom_prompt': projectData['custom_prompt'],
                                    'project_area': projectData['project_area']
                                })

    if not analysis_collection.find_one({'project_id':project_id}):
        new_analysis = Analysis(
            project_id= project_id,
            user_id= user_id,
            analysis= analysis
        )
        analysis_collection.insert_one(new_analysis.to_dict())
        # new_analysis['_id'] = str(inserted_analysis['_id'])

        return jsonify({
            'message': 'New analysis created successfully',
            'new_analysis': new_analysis.to_dict()
        }), 201

    update_analysis = {
        'project_id': project_id,
        'user_id': user_id,
        'analysis': analysis
    }

    updated_analysis = analysis_collection.find_one_and_update(
        {'project_id': project_id}, 
        {'$set': update_analysis},
        upsert=True,
        return_document=True 
    )

    if not updated_analysis:
        return jsonify({'error': 'Analysis could not be updated or created'}), 500

    updated_analysis['_id'] = str(updated_analysis['_id'])

    return jsonify({
        'message': 'Analysis created or updated successfully',
        'updated_analysis': updated_analysis
    }), 200


def fetchAnalysis():
    data = request.get_json()

    if not data or 'project_id' not in data:
        return jsonify({
            'error': 'Project ID is required',
            'success': False
        }), 400
    
    project_id = data.get('project_id')

    analysis_json = analysis_collection.find_one({'project_id':project_id})

    if analysis_json is None:
        return jsonify({
            'error': 'No analysis found for the provided project ID',
            'success': False
        }), 404
    
    analysis_json['_id'] = str(analysis_json['_id'])

    return jsonify({
        'message': 'Analysis fetched successfully',
        'analysis_json': analysis_json
    })