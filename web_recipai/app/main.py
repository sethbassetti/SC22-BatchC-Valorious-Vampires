# import requirements needed
from flask import Flask, render_template, request, redirect, url_for
from flask_utils import get_base_url
import json
import openai
import os
import pandas as pd
import torch

# setup the webserver
# port may need to be changed if there are multiple flask servers running on same server
port = 12348
base_url = get_base_url(port)

# if the base url is not empty, then the server is running in development, and we need to specify the static folder so that the static files are served
if base_url == '/':
    app = Flask(__name__)
else:
    app = Flask(__name__, static_url_path=base_url+'static')
    
model = torch.hub.load("ultralytics/yolov5", "custom", path = 'static/cv_model/best1.pt')
app.config["UPLOAD_FOLDER"] = "static/"

os.environ['OPENAI_API_KEY'] = "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"
openai.api_key = os.getenv("OPENAI_API_KEY")

# set up the routes and logic for the webserver
@app.route(f'{base_url}')
def home():
    return render_template('index.html', recipe=json.dumps(""))

@app.route(f'{base_url}', methods=["POST"])
def my_function():
    
    # If we are posting data, use it to generate a recipe and return that recipe
    if request.method == "POST":
        data = request.json['input']
        response = generate_recipe(data)
        return response

@app.route(f'{base_url}/upload', methods=["GET", "POST"])
def upload_file():
    if request.method == 'POST':
        
        # Receive the uploaded file and save it to the static folder
        f = request.files['file']
        f.save(app.config['UPLOAD_FOLDER'] + f.filename)
        
        # Use the current path to obtain where the image was saved
        here = os.getcwd()
        image_path = os.path.join(here, app.config["UPLOAD_FOLDER"], f.filename)
        
        # Send the image through the model
        results = model(image_path)
        
        # Turn the result into a json object
        results = json.loads(results.pandas().xyxy[0].to_json(orient="records"))
        ingredients = []
        
        # Loop through the json dictionary, adding the name of the ingredient to an ingredients list
        for result in results:
            ingredient = result["name"]
            ingredients.append(ingredient)
            
        # Delete duplicates
        ingredients = list(set(ingredients))
        
        # Create a string for the prompt and send it into the model
        ingredient_string = ", ".join(ingredients) + "->"
        
        response = generate_recipe(ingredient_string)
        
        return render_template("index.html", recipe=json.dumps(response))
    
    else:
        return render_template("index.html", recipe=json.dumps(""))
    
def generate_recipe(prompt):
    """ Helper function to use openai's API to generate a recipe"""
    response = openai.Completion.create(
            engine="babbage:ft-personal-2022-07-28-21-36-07",
            prompt=prompt,
            temperature=0.4,
            max_tokens=256,
            #top_p=1,
            frequency_penalty=0.26,
            presence_penalty=0.7
        )
    response = response.get("choices")[0]['text']
    response = response.split(" END")[0]
    return response
    

if __name__ == '__main__':
    # IMPORTANT: change url to the site where you are editing this file.
    website_url = 'cocalc22.ai-camp.dev'
    
    print(f'Try to open\n\n    https://{website_url}' + base_url + '\n\n')
    app.run(host = '0.0.0.0', port=port, debug=True)


