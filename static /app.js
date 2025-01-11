document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const fileInput = form.file.files[0];
    const brightness = form.brightness.value;
    const contrast = form.contrast.value;
    const sharpness = form.sharpness.value;

    if (!fileInput) {
        alert("Please select a file.");
        return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB limit
    if (fileInput.size > maxSize) {
        alert("File size exceeds the 50MB limit.");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput);
    formData.append('mode', fileInput.type.startsWith('image') ? 'image' : 'video');
    formData.append('brightness', brightness);
    formData.append('contrast', contrast);
    formData.append('sharpness', sharpness);

    try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            if (fileInput.type.startsWith('image')) {
                const blob = await response.blob();
                const processedUrl = URL.createObjectURL(blob);
                const originalUrl = URL.createObjectURL(fileInput);

                document.getElementById('original').innerHTML = `
                    <h3>Original Image:</h3>
                    <img src="${originalUrl}" alt="Original" style="max-width: 100%; border-radius: 8px;">
                `;
                document.getElementById('processed').innerHTML = `
                    <h3>Processed Image:</h3>
                    <img src="${processedUrl}" alt="Processed" style="max-width: 100%; border-radius: 8px;">
                    <a href="${processedUrl}" download="processed_image.jpg">
                        <button>Download Processed Image</button>
                    </a>
                `;
            } else {
                const result = await response.json();
                const originalUrl = URL.createObjectURL(fileInput);

                document.getElementById('original').innerHTML = `
                    <h3>Original Video:</h3>
                    <video controls style="max-width: 100%; border-radius: 8px;">
                        <source src="${originalUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
                document.getElementById('processed').innerHTML = `
                    <h3>Processed Video:</h3>
                    <video controls style="max-width: 100%; border-radius: 8px;">
                        <source src="${result.video_url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <a href="${result.video_url}" download="processed_video.mp4">
                        <button>Download Processed Video</button>
                    </a>
                `;
            }
        } else {
            const error = await response.json();
            alert(error.error || "An error occurred during processing.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to upload or process the file. Please try again.");
    }
});
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const fileInput = form.file.files[0];
    const brightness = form.brightness.value;
    const contrast = form.contrast.value;
    const sharpness = form.sharpness.value;

    if (!fileInput) {
        alert("Please select a file.");
        return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB limit
    if (fileInput.size > maxSize) {
        alert("File size exceeds the 50MB limit.");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput);
    formData.append('mode', fileInput.type.startsWith('image') ? 'image' : 'video');
    formData.append('brightness', brightness);
    formData.append('contrast', contrast);
    formData.append('sharpness', sharpness);

    try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            if (fileInput.type.startsWith('image')) {
                const blob = await response.blob();
                const processedUrl = URL.createObjectURL(blob);
                const originalUrl = URL.createObjectURL(fileInput);

                document.getElementById('original').innerHTML = `
                    <h3>Original Image:</h3>
                    <img src="${originalUrl}" alt="Original" style="max-width: 100%; border-radius: 8px;">
                `;
                document.getElementById('processed').innerHTML = `
                    <h3>Processed Image:</h3>
                    <img src="${processedUrl}" alt="Processed" style="max-width: 100%; border-radius: 8px;">
                    <a href="${processedUrl}" download="processed_image.jpg">
                        <button>Download Processed Image</button>
                    </a>
                `;
            } else {
                const result = await response.json();
                const originalUrl = URL.createObjectURL(fileInput);

                document.getElementById('original').innerHTML = `
                    <h3>Original Video:</h3>
                    <video controls style="max-width: 100%; border-radius: 8px;">
                        <source src="${originalUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
                document.getElementById('processed').innerHTML = `
                    <h3>Processed Video:</h3>
                    <video controls style="max-width: 100%; border-radius: 8px;">
                        <source src="${result.video_url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <a href="${result.video_url}" download="processed_video.mp4">
                        <button>Download Processed Video</button>
                    </a>
                `;
            }
        } else {
            const error = await response.json();
            alert(error.error || "An error occurred during processing.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to upload or process the file. Please try again.");
    }
});
