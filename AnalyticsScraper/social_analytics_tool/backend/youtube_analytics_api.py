import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors

# Define the scopes for YouTube Analytics and YouTube Data read-only access.
SCOPES = [
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    "https://www.googleapis.com/auth/youtube.readonly"
]

def main():
    # Allow insecure HTTP for local testing (remove this in production)
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    
    # Define API service name and version.
    api_service_name = "youtubeAnalytics"
    api_version = "v2"
    client_secrets_file = "client_secret.json"  # Place your downloaded credentials here

    # Run the OAuth flow to obtain credentials.
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, SCOPES)
    credentials = flow.run_console()

    # Build the YouTube Analytics API client.
    youtube_analytics = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)

    # Make an API call. This example retrieves daily aggregate data for January 2023.
    request = youtube_analytics.reports().query(
        ids="channel==MINE",          # Use 'MINE' to indicate the authenticated channel.
        startDate="2023-01-01",        # Update these dates as needed.
        endDate="2023-01-31",
        metrics="views,likes,dislikes,subscribersGained",
        dimensions="day"             # 'day' dimension breaks down the data daily.
    )
    
    try:
        response = request.execute()
        print("Analytics Data:")
        print(response)
    except googleapiclient.errors.HttpError as e:
        print("An HTTP error occurred: %s" % e)

if __name__ == "__main__":
    main()
