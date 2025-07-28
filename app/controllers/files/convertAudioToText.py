import assemblyai as aai
from werkzeug.datastructures import FileStorage
from Configs.config import Config
import os
import string
import random


def audioToText(audioFileLocation: str):
    aai.settings.api_key = Config.ASSEMBLY_AI_API_KEY

    config = aai.TranscriptionConfig(speech_model=aai.SpeechModel.best)
    transcript = aai.Transcriber(config=config).transcribe(audioFileLocation)

    if transcript.status == "error":
        raise RuntimeError(f"Transcription failed: {transcript.error}")

    return transcript.text



def sanitizeAudioFile(audioFile: FileStorage):
    if audioFile and audioFile.filename:
        filename = f"{generateRandomText()}.{audioFile.mimetype.split('/')[1]}"

        if not filename.endswith(tuple(Config.ALLOWED_AUDIO_MIMETYPE)):
            raise ValueError("Unsupported file type")
        
        audio_file_path = os.path.join('uploads', filename)
        return audio_file_path
    else:
        raise ValueError("No file provided or filename is empty")


def localFilePath(file: FileStorage):
    filePath = sanitizeAudioFile(file)
    file.save(filePath)
    
    return filePath

def cloudFilePath(file: FileStorage):
    # upload to local path
    # upload to cloudinary

    return filePath["https://example.com/"] + "uploads/"


filePath = {
        "http://localhost:5000/": localFilePath,
        "https://example.com/": cloudFilePath
    }

def generateRandomText(length=5):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choices(letters, k=length))