# -*- coding:utf-8 -*-

import json

from fastapi import Depends, FastAPI, HTTPException, Request, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import PyPDF2
import schemas
import io
from deps import get_token
from utils import generate_lyrics, generate_music, get_feed, get_lyrics
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

# Create a new client and connect to the server
print(os.getenv('MONGO_URI'))
client = MongoClient(os.getenv('MONGO_URI'), server_api=ServerApi('1'), tlsCAFile=certifi.where())

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def get_root():
    return schemas.Response()


@app.post("/generate")
async def generate(
    data: schemas.CustomModeGenerateParam, token: str = Depends(get_token)
):
    try:
        resp = await generate_music(data.model_dump(), token)
        return resp
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@app.post("/generate/description-mode")
async def generate_with_song_description(
    data: schemas.DescriptionModeGenerateParam, token: str = Depends(get_token)
):
    try:
        resp = await generate_music(data.model_dump(), token)
        return resp
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@app.get("/feed/{aid}")
async def fetch_feed(aid: str, token: str = Depends(get_token)):
    try:
        resp = await get_feed(aid, token)
        return resp
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@app.post("/generate/lyrics/")
async def generate_lyrics_post(request: Request, token: str = Depends(get_token)):
    req = await request.json()
    prompt = req.get("prompt")
    if prompt is None:
        raise HTTPException(
            detail="prompt is required", status_code=status.HTTP_400_BAD_REQUEST
        )

    try:
        resp = await generate_lyrics(prompt, token)
        return resp
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@app.get("/lyrics/{lid}")
async def fetch_lyrics(lid: str, token: str = Depends(get_token)):
    try:
        resp = await get_lyrics(lid, token)
        return resp
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

#####################################
#Uploading Files 
#Extracts text from a PDF 
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text from a PDF binary data.
    """
    pdf_file = io.BytesIO(pdf_bytes)
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page_number in range(len(reader.pages)):
        page = reader.pages[page_number]
        text += page.extract_text()
    return text

#Read bytes from fileUpload, parse them and return text string 
@app.post("/uploadfiles/")
async def create_upload_files(file: UploadFile):
    pdf_bytes = await file.read()  # Read file as binary data
    text = extract_text_from_pdf(pdf_bytes)  # Extract text from PDF
    print(text)  # Print the extracted text
    return {"text": text}

# Get user data
@app.get("/getallprojects/{userid}")
async def fetch_feed(userid: str):
    try:
        collection = client['thelasthackbackend']['users']
        result = collection.find_one({'userid':userid}, {'_id': 0})
        print('result is', type(result))
        
        return result
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )