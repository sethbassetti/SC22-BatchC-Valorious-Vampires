from flask import Flask

app = Flask(__name__)

@app.route("/")
def hi():
    return "<h1>wow</h1>"

if __name__ == "__main__": app.run(port=21491, host = '0.0.0.0')

