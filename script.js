// Sample texts for typing test
const texts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
    "Programming is the art of telling another human being what one wants the computer to do. It requires logical thinking and creativity.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep moving forward and never give up.",
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle for less.",
    "Every challenge you encounter is an opportunity for growth. Embrace the hurdles, for they are not barriers but stepping stones. Each obstacle surmounted builds strength, character, and resilience. It’s through adversity that the most vibrant stories are written. Remember, diamonds are formed under pressure. Your greatest achievements will come from the toughest trials.",
    "Belief is a powerful tool. When you believe in yourself, you ignite a spark that can light up the darkest nights. Self-belief is not about arrogance; it’s about understanding your worth and capabilities. Trust in your abilities, and don’t be afraid to take bold steps. Every great journey begins with a single step, fueled by confidence.",
    "Dreams without actions are mere fantasies. Set clear, attainable goals and devise a plan to achieve them. Break down your aspirations into manageable tasks and tackle them one by one. Celebrate small victories along the way. Progress, no matter how small, is still progress. With consistent effort, those small steps will lead you to monumental achievements."

];

// DOM elements
const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const timer = document.querySelector('.timer');
const wpmDisplay = document.getElementById('wpm');
const cpmDisplay = document.getElementById('cpm');
const accuracyDisplay = document.getElementById('accuracy');
const resetButton = document.getElementById('resetButton');
const timeButtons = document.querySelectorAll('.time-btn');

// Variables for tracking
let timeLeft = 60;
let timeLimit = 60;
let isTyping = false;
let timer_interval = null;
let correctCharacters = 0;
let incorrectCharacters = 0;
let currentTextIndex = 0;
let currentCharIndex = 0;

// Initialize the test
function initTest() {
    const randomIndex = Math.floor(Math.random() * texts.length);
    const text = texts[randomIndex];
    
    textDisplay.innerHTML = text.split('').map(char => 
        `<span>${char}</span>`
    ).join('');
    
    // Highlight the first character
    textDisplay.firstChild.classList.add('current');
    
    // Reset variables
    timeLeft = timeLimit;
    isTyping = false;
    correctCharacters = 0;
    incorrectCharacters = 0;
    currentCharIndex = 0;
    
    // Reset displays
    timer.textContent = timeLeft;
    wpmDisplay.textContent = '0';
    cpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    
    // Clear input
    textInput.value = '';
    textInput.disabled = false;
    
    // Focus input
    textInput.focus();
}

// Update metrics
function updateMetrics() {
    const timeElapsed = timeLimit - timeLeft;
    const minutes = timeElapsed / 60;
    const totalCharacters = correctCharacters + incorrectCharacters;
    
    // Calculate WPM (assuming average word length of 5 characters)
    const wpm = Math.round((correctCharacters / 5) / minutes) || 0;
    
    // Calculate CPM
    const cpm = Math.round(correctCharacters / minutes) || 0;
    
    // Calculate accuracy
    const accuracy = Math.round((correctCharacters / totalCharacters) * 100) || 100;
    
    // Update displays
    wpmDisplay.textContent = wpm;
    cpmDisplay.textContent = cpm;
    accuracyDisplay.textContent = accuracy;
}

// Timer function
function startTimer() {
    timer_interval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        
        updateMetrics();
        
        if (timeLeft === 0) {
            finishTest();
        }
    }, 1000);
}

// Finish test
function finishTest() {
    clearInterval(timer_interval);
    textInput.disabled = true;
    isTyping = false;
    updateMetrics();
}

// Reset test
function resetTest() {
    clearInterval(timer_interval);
    initTest();
}

// Handle input
textInput.addEventListener('input', (e) => {
    const inputChar = e.target.value.slice(-1);
    const currentChar = textDisplay.children[currentCharIndex];
    
    if (!isTyping) {
        isTyping = true;
        startTimer();
    }
    
    if (currentCharIndex < textDisplay.children.length) {
        // Remove current highlight
        currentChar.classList.remove('current');
        
        // Check if input matches current character
        if (inputChar === currentChar.textContent) {
            currentChar.classList.add('correct');
            correctCharacters++;
        } else {
            currentChar.classList.add('incorrect');
            incorrectCharacters++;
        }
        
        // Move to next character
        currentCharIndex++;
        
        // Highlight next character if available
        if (currentCharIndex < textDisplay.children.length) {
            textDisplay.children[currentCharIndex].classList.add('current');
        } else {
            finishTest();
        }
    }
});

// Handle time button clicks
timeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        timeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update time limit
        timeLimit = parseInt(button.dataset.time);
        resetTest();
    });
});

// Handle reset button
resetButton.addEventListener('click', resetTest);

// Initialize on page load
document.addEventListener('DOMContentLoaded', initTest);

// Prevent tab key from moving focus
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
    }
});