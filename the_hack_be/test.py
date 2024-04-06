import requests 

# For the /uploadfile/ endpoint
url = "http://127.0.0.1:8000/uploadfile/"
files = {"file": open("/path/to/your/file.txt", "rb")}
response = requests.post(url, files=files)
print(response.json())