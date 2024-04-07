import json
import os
import time

import aiohttp
from dotenv import load_dotenv
import requests
from requests import get as rget
from nanoid import generate

load_dotenv()

BASE_URL = os.getenv("BASE_URL")

COMMON_HEADERS = {
    "Content-Type": "text/plain;charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Referer": "https://app.suno.ai/",
    "Origin": "https://app.suno.ai",
}

def generate_id(length=6):
    return generate("1234567890abcdefghijklmnopqrstuvwxyz", length)

def get_info(aid):
    response = requests.get(f"http://127.0.0.1:8000/feed/{aid}")

    data = json.loads(response.text)[0]

    return data["audio_url"], data["metadata"]

async def generate_music_from_text(text: str, theme: str, title: str, token: str) -> str:

    data = {
        "prompt": text,
        "mv": "chirp-v3-0",
        "title": title,
        "tags": theme,
    }
    r = await generate_music(data, token)
    print(f"r: {r}")
   
    json_resp = r
    aid1 = None
    aid2 = None
    if isinstance(json_resp, dict):
        clips = json_resp.get("clips", [])
        if clips:
            aid1 = clips[0].get("id", "")
            aid2 = clips[1].get("id", "")
            status = "generating"
        else: 
            aid1 = "",
            aid2 = "",
            status = "error"
    else:
        aid1 = ""
        aid2 = "",
        status = "error"
    return aid1, aid2, status

async def fetch(url, headers=None, data=None, method="POST"):
    if headers is None:
        headers = {}
    headers.update(COMMON_HEADERS)
    if data is not None:
        data = json.dumps(data)

    print(data, method, headers, url)

    async with aiohttp.ClientSession() as session:
        try:
            async with session.request(
                method=method, url=url, data=data, headers=headers
            ) as resp:
                return await resp.json()
        except Exception as e:
            return f"An error occurred: {e}"

async def save_song(aid, token):
    if aid == "":
        return "", {}, ""
    start_time = time.time()
    while True:
        response = await get_feed(aid, token)
        print(f"response: {response}")
        if isinstance(response, list):
            break
            if response[0]["audio_url"] != "":
                break
            elif time.time() - start_time > 120:
                raise TimeoutError("Failed to get audio_url within 120 seconds")
        elif time.time() - start_time > 120:
            raise TimeoutError("Failed to get audio_url within 120 seconds")
        time.sleep(30)
    #print(f"final audio_url: {audio_url}")
    #print(f"final metadata: {metadata}")
    if response[0]["audio_url"] != "":
        audio_url = response[0]["audio_url"]
    else:
        audio_url = f"https://cdn1.suno.ai/{aid}.mp3"
    if response[0]["image_url"] is not None:
        image_url = response[0]["image_url"]
    else:
        image_url = f"https://cdn1.suno.ai/image_{aid}.png"
    return audio_url, response[0]["metadata"], image_url

async def get_feed(ids, token):
    headers = {"Authorization": f"Bearer {token}"}
    api_url = f"{BASE_URL}/api/feed/?ids={ids}"
    response = await fetch(api_url, headers, method="GET")
    return response


async def generate_music(data, token):
    headers = {"Authorization": f"Bearer {token}"}
    api_url = f"{BASE_URL}/api/generate/v2/"
    response = await fetch(api_url, headers, data)
    return response


async def generate_lyrics(prompt, token):
    headers = {"Authorization": f"Bearer {token}"}
    api_url = f"{BASE_URL}/api/generate/lyrics/"
    data = {"prompt": prompt}
    return await fetch(api_url, headers, data)


async def get_lyrics(lid, token):
    headers = {"Authorization": f"Bearer {token}"}
    api_url = f"{BASE_URL}/api/generate/lyrics/{lid}"
    return await fetch(api_url, headers, method="GET")
