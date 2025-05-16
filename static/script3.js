document.addEventListener("DOMContentLoaded", function () {
    let rowIndex = parseInt(localStorage.getItem("currentRow"), 10) || 0;
    let colIndex = parseInt(localStorage.getItem("currentIndex"), 10) || 0;
    let progressMatrix = JSON.parse(localStorage.getItem("progressMatrix")) || [
        [1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];

    let letterImg = document.getElementById("letter-img");
    let letterImgTransparent = document.getElementById("letter-img-transparent");
    let backButton = document.getElementById("back-btn");
    let nextButton = document.getElementById("next-btn");
    let submitButton = document.getElementById("submit-btn");
    let retryButton = document.getElementById("retry-btn");
    let canvas = document.getElementById('drawingCanvas');
    let ctx = canvas.getContext('2d');

    // Flask-provided URLs (set these in web1.html)
    const backUrl = document.body.getAttribute('data-back-url');
    const dataUrl = document.body.getAttribute('data-data-url');

    let letters = [
        ["अ", "आ", "इ", "ई", "उ", "ऊ"],
        ["ए", "ऐ", "ओ", "औ", "अं", "अः"],
        ["क", "ख", "ग", "घ", "ङ"],
        ["च", "छ", "ज", "झ", "ञ"],
        ["ट", "ठ", "ड", "ढ", "ण"],
        ["त", "थ", "द", "ध", "न"],
        ["प", "फ", "ब", "भ", "म"],
        ["य", "र", "ल", "व"],
        ["श", "ष", "स", "ह"],
    ];

    function updateLetter() {
        if (letters[rowIndex] && letters[rowIndex][colIndex]) {
            let letterFileName = `${dataUrl}Devanagari_${letters[rowIndex][colIndex]}.svg.png`;
            letterImg.src = letterFileName;
            letterImgTransparent.src = letterFileName;

            resizeImage(letterImg);
            resizeImage(letterImgTransparent);

            resizeCanvas();
        } else {
            console.error("Invalid letter index", rowIndex, colIndex);
        }
    }

    function resizeImage(image) {
        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "contain";
        image.draggable = false;
    }

    function resizeCanvas() {
        canvas.width = letterImgTransparent.clientWidth;
        canvas.height = letterImgTransparent.clientHeight;
    }

    window.addEventListener('resize', resizeCanvas);

    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = backUrl; // Flask dynamic back URL
        });
    }

    function evaluateDrawing() {
        const isCorrect = Math.random() < 0.6; 
        if (isCorrect) {
            letterImg.parentElement.style.borderColor = "green";
            submitButton.style.display = "none";
            nextButton.style.display = "block";
            progressMatrix[rowIndex][colIndex] = 1;
            localStorage.setItem("progressMatrix", JSON.stringify(progressMatrix));
        } else {
            letterImg.parentElement.style.borderColor = "red";
            submitButton.style.display = "none";
            retryButton.style.display = "block";
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        letterImg.parentElement.style.borderColor = "#a4c2f4";
        retryButton.style.display = "none";
        submitButton.style.display = "block";
    }

    if (submitButton) {
        submitButton.addEventListener("click", evaluateDrawing);
    }

    if (retryButton) {
        retryButton.addEventListener("click", clearCanvas);
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            let nextIndex = progressMatrix[rowIndex].indexOf(0);
            if (nextIndex === -1) nextIndex = 0;

            localStorage.setItem("currentIndex", nextIndex);
            location.reload();
        });
    }

    // Drawing functionality
    let drawing = false;

    function getCanvasOffset(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function startDrawing(event) {
        const pos = getCanvasOffset(event);
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(event) {
        if (!drawing) return;
        const pos = getCanvasOffset(event);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    function stopDrawing() {
        drawing = false;
        ctx.closePath();
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        startDrawing(event.touches[0]);
    });

    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        draw(event.touches[0]);
    });

    canvas.addEventListener('touchend', stopDrawing);

    updateLetter();
});
