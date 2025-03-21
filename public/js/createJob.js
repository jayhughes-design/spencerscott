// Preview Image For Image Upload
const previewImage = document.getElementById("preview-image");

function avoidSpace(event) {
    var k = event ? event.which : window.event.keyCode;
    if (k == 32) {
        return false;
    }
}

function labelStyles() {
    const firstDir = location.pathname.split('/')[1];
    const dirInput = document.getElementById("domain-url");
    if (dirInput) {
        dirInput.onkeypress = function() {
            return avoidSpace(event);
        };
    }
}

function limit55() {
    let limit55 = document.getElementById('limit55');

    limit55.addEventListener('keyup', () => {
        if (limit55.value.length > 55) {
            limit55.value = limit55.value.slice(0, 55);
        }
    })
}

limit55();

labelStyles();

function getJobImageUpload() {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
        document.getElementById("file-input").onchange = () => {
            const files = document.getElementById('file-input').files;
            const file = files[0];

            if (file == null) {
                return alert('No file selected.');
                previewImage.style.display = "none";
            }

            getSignedRequest(file);
        };
    }
}

function getSignedRequest(file) {
    const fileName = file.name.replace(/[/\\?%*:|"<>^ ]/g, '-');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/jobs/sign-s3?file-name=${fileName}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
            } else {
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}

function uploadFile(file, signedRequest, url) {

    // Container
    const el = document.getElementById("image-upload");
    const previewImageNew = document.createElement("IMG");
    previewImageNew.id = "preview-image";

    // Progress Bar
    const progressBar = document.getElementById("progress");

    // AJAX
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', signedRequest);

    xhr.upload.onprogress = function(e) {
        progressBar.style.display = "block";
        if (e.lengthComputable) {
            progressBar.max = e.total;
            progressBar.value = e.loaded;
        }
    }
    xhr.upload.onloadstart = function(e) {
        progressBar.value = 0;
    }
    xhr.upload.onloadend = function(e) {
        progressBar.value = e.loaded;
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                progressBar.style.display = "none";
                if (previewImage) {
                    console.log('check 1');
                    previewImage.src = url;
                } else {
                    console.log('check 2');
                    el.removeChild(el.lastChild);
                    previewImageNew.src = url;
                    el.appendChild(previewImageNew);
                }
            } else {
                console.log('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}

(() => {
    getJobImageUpload();
})();


froalaEditorStandardButtons = [
    'bold', 'italic', 'underline', 'strikeThrough', 'quote', 'insertLink', 'clearFormatting', '-', 'paragraphFormat', 'formatOL', 'formatUL', 'align', 'indent', 'outdent', 'emoticons'
]

// Initiate Froala Editor
$(function() {
    if ($('.froala').length) {
        $('.froala').froalaEditor({
            toolbarButtons: ['bold', 'italic', 'underline', '|', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertTable', '|', 'insertHR', 'selectAll', 'clearFormatting', ],
            quickInsertTags: [''],
            key: '7E4C3B3E3cA5A4B3F2E4C2B2E3C1A2vxC-11hh1lucapA-13abA1tvtC-21ss=='
        });
    }
});