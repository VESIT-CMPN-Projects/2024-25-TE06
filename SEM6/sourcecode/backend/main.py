from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

# ENV Vars
PORT = os.environ['PORT']

# Blueprints
from blueprints.treeEnum.treeEnum import treeEnum
from routes.user_routes import register_user,login_user,create_new_or_update_analysis, fetch_analysis, access_user, logout_user
from routes.project_routes import create_project, access_all_project, find_one_project_and_update, add_or_update_image, add_new_video, fetch_project, add_annotated_images, completed_status

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024 * 1024  # 1GB
# CORS(app)
# CORS(app, origins=["http://localhost:5173"])
CORS(app,supports_credentials=True)

app.register_blueprint(treeEnum)
app.register_blueprint(register_user)
app.register_blueprint(login_user)
app.register_blueprint(logout_user)
app.register_blueprint(access_user)
app.register_blueprint(create_new_or_update_analysis)
app.register_blueprint(fetch_analysis)
app.register_blueprint(create_project)
app.register_blueprint(access_all_project)
app.register_blueprint(find_one_project_and_update)
app.register_blueprint(add_or_update_image)
app.register_blueprint(fetch_project)
app.register_blueprint(add_new_video)
app.register_blueprint(add_annotated_images)
app.register_blueprint(completed_status)

if __name__ == "__main__":
    app.run(port=PORT, debug=False)