from flask import Flask, render_template
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html",
        firebase_api_key=os.getenv("FIREBASE_API_KEY"),
        firebase_auth_domain=os.getenv("FIREBASE_AUTH_DOMAIN"),
        firebase_project_id=os.getenv("FIREBASE_PROJECT_ID"),
        firebase_storage_bucket=os.getenv("FIREBASE_STORAGE_BUCKET"),
        firebase_messaging_sender_id=os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
        firebase_app_id=os.getenv("FIREBASE_APP_ID"),
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

if __name__ == "__main__":
    app.run(debug=True)
