from flask import Flask, redirect, url_for, session, request, jsonify
import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import google.oauth2.credentials
import pathlib
import json

app = Flask(__name__)
app.secret_key = "YOUR_SECRET_KEY"  # Replace with a secure random key in production

# OAuth 2.0 configuration
# Use the environment variable for the client secret file path,
# defaulting to 'client_secret.json' in the current directory.
CLIENT_SECRETS_FILE = os.getenv("GOOGLE_CLIENT_SECRET_PATH", "client_secret.json")

SCOPES = [
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    "https://www.googleapis.com/auth/youtube.readonly"
]

# The URI to redirect to after a successful login
REDIRECT_URI = "http://localhost:5000/oauth2callback"  # Must match an authorized redirect URI in Google Cloud

@app.route("/")
def index():
    if "credentials" not in session:
        return redirect("authorize")
    return (
        "You are logged in. "
        "Visit <a href='/youtube_analytics'>/youtube_analytics</a> to view your analytics data."
    )

@app.route("/authorize")
def authorize():
    # Create the OAuth flow using the client secrets file.
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)
    flow.redirect_uri = REDIRECT_URI

    # Generate the authorization URL.
    authorization_url, state = flow.authorization_url(
        access_type="offline",  # This allows you to get a refresh token.
        include_granted_scopes="true"
    )

    # Save the state in the session to verify the auth server response later.
    session["state"] = state
    return redirect(authorization_url)

@app.route("/oauth2callback")
def oauth2callback():
    state = session.get("state")
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
    flow.redirect_uri = REDIRECT_URI

    # Fetch the OAuth 2.0 tokens using the authorization server's response.
    authorization_response = request.url
    flow.fetch_token(authorization_response=authorization_response)

    # Store the credentials in the session.
    credentials = flow.credentials
    session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes
    }
    return redirect(url_for("index"))

@app.route("/youtube_analytics")
def youtube_analytics():
    if "credentials" not in session:
        return redirect("authorize")
    
    # Load credentials from the session.
    credentials = google.oauth2.credentials.Credentials(
        **session["credentials"]
    )

    # Build the YouTube Analytics API client.
    youtube_analytics = googleapiclient.discovery.build(
        "youtubeAnalytics", "v2", credentials=credentials)

    # Example API call: Retrieve daily aggregate data for January 2023.
    request_api = youtube_analytics.reports().query(
        ids="channel==MINE",
        startDate="2023-01-01",
        endDate="2023-01-31",
        metrics="views,likes,dislikes,subscribersGained",
        dimensions="day"
    )

    try:
        response = request_api.execute()
        # Update the session with refreshed credentials (if applicable).
        session["credentials"] = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes
        }
        return jsonify(response)
    except googleapiclient.errors.HttpError as e:
        return f"An HTTP error occurred: {e}"

if __name__ == "__main__":
    # Run the Flask app on localhost:5000
    app.run(debug=True)
