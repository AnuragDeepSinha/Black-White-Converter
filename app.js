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

    const formData = new FormData();
    formData.append('file', fileInput);
    formData.append('mode', fileInput.type.startsWith('image') ? 'image' : 'video');
    formData.append('brightness', brightness);
    formData.append('contrast', contrast);
    formData.append('sharpness', sharpness);

    const response = await fetch('http://127.0.0.1:5000/upload', { method: 'POST', body: formData });
    if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (fileInput.type.startsWith('image')) {
            document.getElementById("original").innerHTML = `
                <img src="${URL.createObjectURL(fileInput)}" alt="Original Image" style="max-width: 100%; border-radius: 8px;">
            `;
            document.getElementById("processed").innerHTML = `
                <div class="slider-container">
                    <img src="${url}" alt="Processed Image" class="before" style="max-width: 100%; border-radius: 8px;">
                    <img src="${URL.createObjectURL(fileInput)}" alt="Original Image" class="after" style="max-width: 100%; border-radius: 8px;">
                    <input type="range" id="slider" min="0" max="100" value="50">
                </div>
                <button id="downloadBtn">Download Processed Image</button>
            `;

            // Slider functionality
            document.getElementById('slider').addEventListener('input', (e) => {
                const value = e.target.value;
                document.querySelector('.before').style.width = `${value}%`;
                document.querySelector('.after').style.width = `${100 - value}%`;
            });

            // Download functionality
            document.getElementById('downloadBtn').addEventListener('click', () => {
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = 'processed_image.jpg';
                downloadLink.click();
            });

        } else {
            document.getElementById('original').innerHTML = `
                <video controls>
                    <source src="${URL.createObjectURL(fileInput)}" type="video/mp4">
                </video>
            `;
            document.getElementById('processed').innerHTML = `
                <video controls>
                    <source src="${url}" type="video/mp4">
                </video>
                <button id="downloadBtn">Download Processed Video</button>
            `;

            // Download video functionality
            document.getElementById('downloadBtn').addEventListener('click', () => {
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = 'processed_video.mp4';
                downloadLink.click();
            });
        }
    } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
    }
});
