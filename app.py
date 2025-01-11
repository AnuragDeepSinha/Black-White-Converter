from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from PIL import Image, ImageEnhance
import os
import cv2
import numpy as np
from io import BytesIO
from werkzeug.exceptions import RequestEntityTooLarge

app = Flask(__name__)
CORS(app)

# Set max content length to 50 MB (50 * 1024 * 1024 bytes)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB

UPLOAD_FOLDER = './uploads'
PROCESSED_FOLDER = './processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.errorhandler(RequestEntityTooLarge)
def handle_file_too_large(error):
    return jsonify({"error": "File is too large. Max allowed size is 50 MB."}), 413

@app.route('/')
def home():
    return render_template('index.html')  # Adjust the path if needed


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files['file']
        mode = request.form['mode']  # 'image' or 'video'
        
        if mode == 'image':
            return process_image(file)
        elif mode == 'video':
            return process_video(file)
        else:
            return jsonify({"error": "Invalid mode"}), 400
    except Exception as e:
        app.logger.error(f"Error processing the file: {str(e)}")
        return jsonify({"error": "Failed to upload or process the file. Please try again."}), 500

def process_image(file):
    img = Image.open(file.stream).convert('L')  # Convert to grayscale
    brightness = float(request.form.get('brightness', 1.0))
    contrast = float(request.form.get('contrast', 1.0))
    sharpness = float(request.form.get('sharpness', 1.0))

    # Apply adjustments
    img = ImageEnhance.Brightness(img).enhance(brightness)
    img = ImageEnhance.Contrast(img).enhance(contrast)
    img = ImageEnhance.Sharpness(img).enhance(sharpness)

    # Save processed image
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    return send_file(buffer, mimetype='image/jpeg')

def process_video(file):
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(input_path)
    output_path = os.path.join(PROCESSED_FOLDER, f'processed_{file.filename}')
    cap = cv2.VideoCapture(input_path)
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = None

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert each frame to grayscale
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2BGR)

        if out is None:
            height, width, _ = frame.shape
            out = cv2.VideoWriter(output_path, fourcc, 20.0, (width, height))

        out.write(gray_frame)

    cap.release()
    out.release()
    return jsonify({"video_url": f"/processed/{os.path.basename(output_path)}"})

@app.route('/processed/<filename>')
def serve_processed_file(filename):
    return send_file(os.path.join(PROCESSED_FOLDER, filename), as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)





