from flask import Blueprint, request, jsonify
from app.controllers.files.convertAudioToText import audioToText
import os
from app.controllers.files.convertAudioToText import filePath
import traceback

audio_to_text_bp = Blueprint('audio_to_text', __name__)

@audio_to_text_bp.route('/audio_to_text', methods=['POST'])
def audio_to_text():
    os.makedirs('uploads', exist_ok=True)
    
    try:
        hostUrl = request.host_url
        getFilePath = filePath[hostUrl]

        audioFile = request.files['file']
        audio_file_path = getFilePath(audioFile)
        
        transcript = audioToText(audio_file_path)

        """
        Clean up the uploaded file after processing
        TODO: 
            1) Also, delete the app from cloud storage in production
            2) store the transcript in a database
        """
        os.remove(audio_file_path)  

        return jsonify({"successful": transcript}), 200
    except Exception as e:
        traceback.print_exc() 
        return jsonify({"error": str(e)}), 500