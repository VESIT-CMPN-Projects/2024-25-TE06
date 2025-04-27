from flask import Blueprint, request
from PIL import Image
import base64, io, json
from ultralytics import YOLO
from deepforest import main
from blueprints.treeEnum.helper import parallel_predictions
treeEnum = Blueprint("treeEnum", __name__, template_folder="templates")

@treeEnum.route("/")
def index():
    return "Tree Enumeration Model!"

@treeEnum.post("/enumerate")
def enumerateTrees():
    # TODO Clear previous output

    # Get image from request        
    # images = json.loads(request.form['imagesb64'])
    # conf = float(request.form['confidence'])
    # iou = float(request.form['iou'])
    # patch_size = int(request.form['patch_size'])

    data = request.get_json()
    print(data.keys())

    # if not all(key in data for key in ['images', 'patch_size']):
    #     return {"error" : "Required Fields missing!"}, 400

    predictions = parallel_predictions(json.loads(data['images']), int(data['patch_size']))

    # Generate response
    # response = {"annotated": annotatedImage, "count": len(results[0].boxes)}

    return json.dumps(predictions)
