const imageUploaderBtnElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

function setImagePreview() {
    const files = imageUploaderBtnElement.files;

    if(!files || files.length === 0) {
        imagePreviewElement.style.display = 'none';
        return;
    }

    const imageFile = files[0];

    imagePreviewElement.src = URL.createObjectURL(imageFile);
    imagePreviewElement.style.display = 'block';
}

imageUploaderBtnElement.addEventListener('change', setImagePreview);