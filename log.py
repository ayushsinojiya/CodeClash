import boto3
import os
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

# S3 bucket details
BUCKET_NAME = 'bucketforloggingcode'
LOG_FILE_PATH = 'Server\combined.log'  # Provide the path to your combined.log file

# Initialize S3 client
s3_client = boto3.client('s3')

def upload_to_s3(file_path, bucket_name):
    try:
        # Check if the log file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Log file '{file_path}' not found")

        # Extract the file name
        file_name = os.path.basename(file_path)

        # Upload the file to S3
        print(f"Uploading '{file_name}' to S3 bucket '{bucket_name}'...")
        s3_client.upload_file(file_path, bucket_name, file_name)
        print(f"File '{file_name}' uploaded successfully to '{bucket_name}'!")

    except FileNotFoundError as e:
        print(f"Error: {e}")
    except NoCredentialsError:
        print("Error: No AWS credentials found. Please configure your AWS CLI.")
    except PartialCredentialsError:
        print("Error: Incomplete AWS credentials. Please configure your AWS CLI.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    # Upload the log file to S3
    upload_to_s3(LOG_FILE_PATH, BUCKET_NAME)
