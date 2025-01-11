
const sliderHandle = document.getElementById('slider-handle');
const beforeImage = document.getElementById('before-image');
const afterImage = document.getElementById('after-image');

let isDragging = false;

sliderHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
    });
});

function handleMouseMove(e) {
    if (!isDragging) return;

    const sliderContainer = document.getElementById('image-slider-container');
    const offsetX = e.clientX - sliderContainer.offsetLeft;
    const containerWidth = sliderContainer.offsetWidth;
    const position = Math.max(0, Math.min(offsetX, containerWidth));

    sliderHandle.style.left = position + 'px';
    beforeImage.style.width = position + 'px';
}
