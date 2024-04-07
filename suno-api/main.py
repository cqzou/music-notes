# -*- coding:utf-8 -*-

import json
import time

from fastapi import Depends, FastAPI, Form, HTTPException, Request, status, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import PyPDF2
import schemas
import io
from deps import get_token
from utils import generate_id, generate_lyrics, generate_music, get_feed, get_lyrics, generate_music_from_text, save_song
from topic_segment import TopicSegmenter
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from db_utils import create_empty_project, delete_project, update_audio_url, update_project_completion_status
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


async def __background_generate_songs(client, userid, segmented_data, theme, title, token, projectid):
    aids = []
    for data in segmented_data:
        print(f"data: {data}")
        print(f"lyrics: {data['lyrics']}")
        lyrics = data["lyrics"]
        topicname = data["topicname"]
        aid1, aid2 = await generate_music_from_text(lyrics, theme=theme, title=title, token=token)
        aids.append((topicname, aid1))
    print(f"aids: {aids}")
    for topicname, aid in aids:
        try:
            audio_url, metadata, image_url = await save_song(aid, token)
        except TimeoutError as err: 
            print("timeout error sadpag")
            audio_url = f"https://cdn1.suno.ai/{aid}.mp3"
            image_url = f"https://cdn1.suno.ai/image_{aid}.png"

        # response = await update_audio_url(client, userid, projectid, topicname, audio_url)
        response = await update_audio_url(client, userid, projectid, topicname, audio_url, aid)
    response = await update_project_completion_status(client, userid, projectid, image_url)
    print(f"response: {response}")

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
        print(resp)
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
async def create_upload_files(background_tasks: BackgroundTasks, file: UploadFile = File(), userid: str = Form(), description: str = Form(), theme: str = Form(), projectname: str = Form(), token: str = Depends(get_token)):
    try:
        pdf_bytes = await file.read()  # Read file as binary data
        text = extract_text_from_pdf(pdf_bytes)  # Extract text from PDF
        print(text)
        segmenter = TopicSegmenter()
        segmented_data = segmenter.segment_topic(text)
        #segmented_data = None
        print(f"segmented_data:{segmented_data}")
        projectid = generate_id()
        topics = [schemas.Topic(topicname=data["topicname"], lyrics=data["lyrics"], mp3="").model_dump() for data in segmented_data]
        new_empty_project = schemas.Project(projectid=projectid, processingstatus="generating", projectname=projectname, description=description, thumbnail='', topics=topics)
        response = await create_empty_project(client, userid, new_empty_project)
        print(response)
        #return {"segmented_data": segmented_data, "audio_url": audio_url, "metadata": metadata}
        background_tasks.add_task(__background_generate_songs, client, userid, segmented_data[0:3], theme, projectname, token, projectid)
        return {"segmented_data": segmented_data}



    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="idk man"
        )



# Get user data
@app.get("/getallprojects/{userid}")
async def fetch_user_feed(userid: str):
    try:
        collection = client['thelasthackbackend']['users']
        result = collection.find_one({'userid':userid}, {'_id': 0})
        return result
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# destroy a project
@app.get("/delete_project/{userid}/{projectid}")
async def lebron(userid: str, projectid: str):
    try:
        result = await delete_project(client, userid, projectid)
        return result
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Get user data
@app.get("/lebronhames/{userid}")
async def lebronhames(userid: str):
    try:
        project = {
            "projectname": "Joe mama",
            "processingstatus": "complete",
            "projectid": "beeeeeeeeeeep",
            "description": "deez nuts",
            "thumbnail": "https://thumbs.dreamstime.com/b/cute-french-woman-striped-shirt-beret-funny-drawing-frenchwoman-typical-european-character-flag-cartoon-illustration-253980742.jpg",
            "topics": [
                {
                    "topicname": "balls in the balls",
                    "lyrics": "pee is stored in the balls",
                    "mp3": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
                },
                {
                    "topicname": "balls in the balls",
                    "lyrics": "pee is stored in the balls",
                    "mp3": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
                }
            ]
        }
        result = await create_empty_project(client, userid, project)
        return result
    except Exception as e:
        raise HTTPException(
            detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )