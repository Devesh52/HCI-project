document.addEventListener("DOMContentLoaded", function () {
    let progressMatrix = JSON.parse(localStorage.getItem("progressMatrix")) || [
        [1, 1, 0, 0, 0, 0], // Row 1
        [0, 0, 0, 0, 0, 0], // Row 2
        [0, 0, 0, 0, 0], // Row 3
        [0, 0, 0, 0, 0], // Row 4
        [0, 0, 0, 0, 0], // Row 5
        [0, 0, 0, 0, 0], // Row 6
        [0, 0, 0, 0, 0], // Row 7
        [0, 0, 0, 0], // Row 8
        [0, 0, 0, 0], // Row 9
    ];

    function updateUI() {
        document.querySelectorAll(".row").forEach((row, rowIndex) => {
            row.querySelectorAll(".letter").forEach((letter, colIndex) => {
                if (progressMatrix[rowIndex][colIndex] === 1) {
                    letter.classList.add("progress"); // Apply green highlight
                } else {
                    letter.classList.remove("progress"); // Remove green if not learnt
                }
            });
        });
    }

    document.querySelectorAll(".row").forEach((row, rowIndex) => {
        row.addEventListener("click", function () {
            let nextIndex = progressMatrix[rowIndex].indexOf(0); // Find first unlearnt letter
            if (nextIndex === -1) nextIndex = 0; // If all are learnt, restart row

            localStorage.setItem("currentRow", rowIndex);
            localStorage.setItem("currentIndex", nextIndex);
            window.location.href = "/learn"; // Navigate to the learning page (Flask route)
        });
    });

    updateUI(); // Highlight learnt letters
});
