document.addEventListener('DOMContentLoaded', function() {
    updateRateInput(5);
    updateScoreInput(500);

    // Event listeners for button2 (mousedown and touchstart)
    document.getElementById('button2').addEventListener('mousedown', handleButtonDown);
    document.getElementById('button2').addEventListener('touchstart', function(event) {
        isTouchDevice = true;
        handleButtonDown(event);
    });

    // Event listeners for mouseup and touchend on document
    document.addEventListener('mouseup', handleButtonUp);
    document.addEventListener('touchend', handleButtonUp);

    // Event listener for button1-add
    document.getElementById('button1-add').addEventListener('click', function() {
        adjustRateInput(5);
    });

    // Event listener for button1-subtract
    document.getElementById('button1-subtract').addEventListener('click', function() {
        adjustRateInput(-5);
    });
});

let isButtonDown = false;
let animationTimeout = null;
let isTouchDevice = false; // Flag to distinguish between touch and mouse events

function handleButtonDown(event) {
    // Prevent default touch behavior to avoid duplicate events
    if (event.type === 'touchstart') {
        event.preventDefault();
    }

    if (isButtonDown) {
        return;
    }

    isButtonDown = true;
    checkWinLoop();
}

function handleButtonUp() {
    isButtonDown = false;
    clearTimeout(animationTimeout);
}

function updateScoreInput(value) {
    updateInput('scoreInput', `Score: ${value}`);
}

function updateRateInput(value) {
    updateInput('rateInput', `Rate: ${value}`);
}

function updateInput(inputId, text) {
    var input = document.getElementById(inputId);
    input.value = text;
    input.classList.add('bold-value');

    input.addEventListener('animationend', function() {
        input.classList.remove('zoom-in');
    }, { once: true });

    setTimeout(() => {
        input.classList.add('zoom-in');
    }, 100);
}

function adjustRateInput(change) {
    var rateInput = document.getElementById('rateInput');
    var rateValue = parseInt(rateInput.value.split(': ')[1]);

    console.log("Rate Value Before:", rateValue);

    if (!isNaN(rateValue) && rateValue + change >= 5) {
        rateValue += change;
        updateRateInput(rateValue);
        console.log("Rate Value After:", rateValue);
    } else {
        console.log("Invalid rate input.");
    }
}

function checkWinLoop() {
    if (isButtonDown) {
        const rateInput = document.getElementById('rateInput');
        const scoreInput = document.getElementById('scoreInput');

        let rateValue = parseInt(rateInput.value.split(': ')[1]);
        let scoreValue = parseInt(scoreInput.value.split(': ')[1]);

        if (scoreValue >= rateValue) {
            scoreValue -= rateValue;
            updateScoreInput(scoreValue);
        } else {
            isButtonDown = false;
            clearTimeout(animationTimeout);
            alert('Nie masz wystarczającej ilości punktów!');
            return;
        }

        stopFlashing();

        const paragraphs = document.querySelectorAll('.styled-p');
        paragraphs.forEach(p => {
            const symbols = ['🍒', '🍋', '🔔', '🍇', '🍉', '⭐', '🌵', '🐴', '7️⃣', '🤠'];
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            const offsetX = Math.random() * 50 - 25;
            p.style.transform = `translateX(${offsetX}px)`;

            setTimeout(() => {
                p.innerText = randomSymbol;
                p.style.transform = 'translateX(0)';
            }, 500);
        });

        setTimeout(() => {
            const resultDisplays = document.querySelectorAll('.styled-p');
            const symbols = Array.from(resultDisplays).map(display => display.textContent);

            const lines = [
                [0, 3, 6], // First column
                [1, 4, 7], // Second column
                [2, 5, 8], // Third column
                [0, 4, 8], // Diagonal from top-left to bottom-right
                [2, 4, 6]  // Diagonal from top-right to bottom-left
            ];

            let hasWon = false;

            for (const line of lines) {
                const lineSymbols = line.map(index => symbols[index]);

                if (lineSymbols.every(symbol => symbol === lineSymbols[0])) {
                    let winMultiplier = 2;
                    if (['🍒', '🍋', '🔔', '🍇', '🍉'].includes(lineSymbols[0])) {
                        winMultiplier = 3;
                    } else if (['⭐', '🌵', '🐴'].includes(lineSymbols[0])) {
                        winMultiplier = 5;
                    } else if (['7️⃣', '🤠'].includes(lineSymbols[0])) {
                        winMultiplier = 10;
                    }

                    scoreValue += rateValue * winMultiplier;
                    updateScoreInput(scoreValue);

                    for (const index of line) {
                        resultDisplays[index].classList.add('flash-effect');
                    }

                    setTimeout(() => {
                        scoreInput.classList.remove('zoom-in');
                    }, 700);

                    hasWon = true;
                }
            }

            if (hasWon) {
                setTimeout(() => {
                    scoreInput.classList.remove('zoom-in');
                }, 700);
            }

            if (isButtonDown && !hasWon) {
                animationTimeout = setTimeout(checkWinLoop, 700);
            }
        }, 500);
    }
}

function stopFlashing() {
    const paragraphs = document.querySelectorAll('.styled-p');
    paragraphs.forEach(p => {
        p.classList.remove('flash-effect');
    });
}
