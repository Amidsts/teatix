import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    ALLOWED_AUDIO_MIMETYPE = {'mp4', 'mkv', 'mov', 'gif'}
    ASSEMBLY_AI_API_KEY = os.getenv('ASSEMBLY_AI_API_KEY')

    def allowedFile(filename: str):
        return filename in Config.ALLOWED_EXTENSIONS