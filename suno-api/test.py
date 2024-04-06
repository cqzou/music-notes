import json
import os
import time

import requests
from requests import get as rget


def test_generate_music():
    data = {
    "prompt": "beep boop",
    "mv": "chirp-v3-0",
    "title": "waaaaa",
    "tags": "electronic",
    }

    r = requests.post(
        "http://127.0.0.1:8000/generate", data=json.dumps(data)
    )

    resp = r.text
    aid = None
    json_resp = json.loads(resp)
    clips = json_resp.get("clips", [])
    if clips:
        aid = clips[0].get("id", "")
        print(aid)
    else:
        aid = ""


def test_generate_music_with_description():
    data = {
        "gpt_description_prompt": "A Blues song about a person who is feeling happy and optimistic about the future.",
        "make_instrumental": False,
        "mv": "chirp-v3-0",
    }

    r = requests.post("http://127.0.0.1:8000/generate", data=json.dumps(data))

    resp = r.text
    print(resp)


def test_generate_lyrics():
    data = {"prompt": ""}

    r = requests.post("http://127.0.0.1:8000/generate/lyrics/", data=json.dumps(data))
    print(r.text)


def get_lyrics(lid):
    r = requests.get(f"http://127.0.0.1:8000/lyrics/{lid}")
    print(r.text)


def get_info(aid):
    response = requests.get(f"http://127.0.0.1:8000/feed/{aid}")

    data = json.loads(response.text)[0]

    return data["audio_url"], data["metadata"]


def save_song(aid, output_path="output"):
    start_time = time.time()
    while True:
        audio_url, metadata = get_info(aid)
        if audio_url:
            break
        elif time.time() - start_time > 90:
            raise TimeoutError("Failed to get audio_url within 90 seconds")
        time.sleep(30)
    response = rget(audio_url, allow_redirects=False, stream=True)
    if response.status_code != 200:
        raise Exception("Could not download song")
    index = 0
    while os.path.exists(os.path.join(output_path, f"suno_{index}.mp3")):
        index += 1
    path = os.path.join(output_path, f"suno_{index}.mp3")
    with open(path, "wb") as output_file:
        for chunk in response.iter_content(chunk_size=1024):
            # If the chunk is not empty, write it to the file.
            if chunk:
                output_file.write(chunk)

test_generate_music()
save_song("8d82a451-c6e2-49c8-898b-039ee40d454d", "output")