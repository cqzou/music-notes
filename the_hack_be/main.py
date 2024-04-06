from typing import Annotated, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse
import os, io
import PyPDF2

app = FastAPI()

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

@app.post("/uploadfiles/")
async def create_upload_files(file: UploadFile):
    pdf_bytes = await file.read()  # Read file as binary data
    text = extract_text_from_pdf(pdf_bytes)  # Extract text from PDF
    print(text)  # Print the extracted text
    return {"text": text}


@app.get("/")
async def main():
    content = """
    <body>
    <form action="/files/" enctype="multipart/form-data" method="post">
    <input name="files" type="file" multiple>
    <input type="submit">
    </form>
    <form action="/uploadfiles/" enctype="multipart/form-data" method="post">
    <input name="file" type="file" multiple>
    <input type="submit">
    </form>
    </body>
    """
    return HTMLResponse(content=content)