from flask import Flask, request, render_template, jsonify, send_file
from flask_cors import CORS
from io import BytesIO
from PIL import Image, ImageEnhance
import cv2
import numpy as np

app = Flask(__name__, template_folder='frontend')  # Specify the custom template folder
CORS(app)

# Route to serve index.html from 'frontend' folder
@app.route('/')
def home():
    return render_template('index.html')  # Flask will look in the 'frontend' folder

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    mode = request.form['mode']  # 'image' or 'video'
    
    if mode == 'image':
        return process_image(file)
    elif mode == 'video':
        return process_video(file)
    else:
        return jsonify({"error": "Invalid mode"}), 400

def process_image(file):
    try:
        # Open the image and convert to grayscale
        img = Image.open(file.stream).convert('L')
        brightness = float(request.form.get('brightness', 1.0))
        contrast = float(request.form.get('contrast', 1.0))
        sharpness = float(request.form.get('sharpness', 1.0))

        # Apply enhancements
        img = ImageEnhance.Brightness(img).enhance(brightness)
        img = ImageEnhance.Contrast(img).enhance(contrast)
        img = ImageEnhance.Sharpness(img).enhance(sharpness)

        # Save the processed image to an in-memory buffer
        buffer = BytesIO()
        img.save(buffer, format="JPEG")
        buffer.seek(0)

        # Send the processed image to the client
        return send_file(buffer, mimetype='image/jpeg')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def process_video(file):
    try:
        # Read the uploaded video file
        video_data = file.read()
        np_video = np.frombuffer(video_data, np.uint8)
        video_stream = cv2.VideoCapture(cv2.imdecode(np_video, cv2.IMREAD_UNCHANGED))

        # Get enhancement settings
        brightness = float(request.form.get('brightness', 1.0))
        contrast = float(request.form.get('contrast', 1.0))
        sharpness = float(request.form.get('sharpness', 1.0))

        # Prepare in-memory video writer
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        fps = video_stream.get(cv2.CAP_PROP_FPS)
        frame_width = int(video_stream.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(video_stream.get(cv2.CAP_PROP_FRAME_HEIGHT))
        frame_size = (frame_width, frame_height)

        # Use a temporary memory buffer to save the output video
        output_stream = BytesIO()
        out = cv2.VideoWriter('appsrc ! videoconvert ! appsink', fourcc, fps, frame_size)

        while video_stream.isOpened():
            ret, frame = video_stream.read()
            if not ret:
                break

            # Convert each frame to grayscale
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Apply brightness, contrast, and sharpness adjustments
            gray_frame_pil = Image.fromarray(gray_frame)
            gray_frame_pil = ImageEnhance.Brightness(gray_frame_pil).enhance(brightness)
            gray_frame_pil = ImageEnhance.Contrast(gray_frame_pil).enhance(contrast)
            gray_frame_pil = ImageEnhance.Sharpness(gray_frame_pil).enhance(sharpness)

            # Convert back to OpenCV format and write the processed frame
            processed_frame = np.array(gray_frame_pil)
            processed_frame = cv2.cvtColor(processed_frame, cv2.COLOR_GRAY2BGR)
            out.write(processed_frame)

        video_stream.release()
        out.release()

        # Rewind output stream and send the processed video to the client
        output_stream.seek(0)
        return send_file(output_stream, mimetype='video/x-msvideo', as_attachment=False)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

