var fileUploadInput = document.getElementById('file-upload-input');
var fileNameElement = document.getElementById('file-name');
    fileUploadInput.addEventListener('change', function() {
        if (fileUploadInput.files.length > 0) {
            var fileName = fileUploadInput.files[0].name;
            fileNameElement.textContent = fileName;
        }
    });
    document.querySelector('.header-document .left button').addEventListener('click', function() {
        var content = document.querySelector('.table-document');
        if (content.style.maxHeight !== "0px"){
          content.style.maxHeight = "0px";
        } else {
          content.style.maxHeight = "100vh"; // or any large value
        } 
      });