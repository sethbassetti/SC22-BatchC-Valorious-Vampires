# import requirements needed
from flask import Flask, render_template, request, redirect, url_for
from utils import get_base_url
import json
import openai
import os
import pandas as pd

# setup the webserver
# port may need to be changed if there are multiple flask servers running on same server
port = 12347
base_url = get_base_url(port)

# if the base url is not empty, then the server is running in development, and we need to specify the static folder so that the static files are served
if base_url == '/':
    app = Flask(__name__)
else:
    app = Flask(__name__, static_url_path=base_url+'static')

# set up the routes and logic for the webserver
@app.route(f'{base_url}')
def home():
    return render_template('index.html')

@app.route(f'{base_url}', methods=["GET", "POST"])
def my_function():
    if request.method == "POST":
        data = request.json['input']
        
        os.environ['OPENAI_API_KEY'] = "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"
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.Completion.create(
            engine="babbage:ft-personal-2022-07-28-21-36-07",
            prompt= data,
            temperature=0.4,
            max_tokens=256,
            #top_p=1,
            frequency_penalty=0.26,
            presence_penalty=0.7
        )
        response = response.get("choices")[0]['text']
        response = response.split(" END")[0]
        print(response)
        
        return response
    else:
        return render_template('index.html')
        
        

# define additional routes here
# for example:
# @app.route(f'{base_url}/team_members')
# def team_members():
#     return render_template('team_members.html') # would need to actually make this page

if __name__ == '__main__':
    # IMPORTANT: change url to the site where you are editing this file.
    website_url = 'cocalc22.ai-camp.dev'
    
    print(f'Try to open\n\n    https://{website_url}' + base_url + '\n\n')
    app.run(host = '0.0.0.0', port=port, debug=True)
