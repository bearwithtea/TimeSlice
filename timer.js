let timer;
let isRunning = false;
let isWorkSession = true;
let workDuration = 25 * 60;  // 25 minutes in seconds
let breakDuration = 5 * 60;  // 5 minutes in seconds
let currentTime = workDuration;  // Start with work session
let startTime;  // To track the exact start time
let endTime;    // To track the target end time

// DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const pauseBtn = document.getElementById('pause-btn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const notes = document.getElementById('notes');
const notesContainer = document.getElementById('notes-container');
const notesHeader = document.getElementById('notes-header');
const tooltipText = document.getElementById('tooltip-text');

// Function to update the timer display
function updateDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  minutesDisplay.textContent = minutes.toString().padStart(2, '0');
  secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// Calculate remaining time
function calculateRemainingTime() {
  const now = Date.now();
  currentTime = Math.max(Math.floor((endTime - now) / 1000), 0);
  updateDisplay();

  // If time runs out, switch sessions
  if (currentTime <= 0) {
    clearInterval(timer);
    isRunning = false;
    if (isWorkSession) {
      currentTime = breakDuration;
      isWorkSession = false;
    } else {
      currentTime = workDuration;
      isWorkSession = true;
    }
    startTimer();  // Automatically start the next session
  }
}

// Start timer with accurate timing
function startTimer() {
  if (isRunning) return;  // Prevent starting multiple timers
  isRunning = true;
  startTime = Date.now();
  endTime = startTime + currentTime * 1000;  // Calculate the exact end time

  // Update the display immediately
  updateDisplay();

  // Set up the interval to recalculate remaining time every second
  timer = setInterval(calculateRemainingTime, 1000);
}

function pauseTimer()
{
    clearInterval(timer);
    isRunning = false;
}

// Function to reset the timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  currentTime = isWorkSession ? workDuration : breakDuration;
  updateDisplay();
}

// Function to save the custom settings
function saveSettings() {
  workDuration = parseInt(workTimeInput.value) * 60;
  breakDuration = parseInt(breakTimeInput.value) * 60;
  resetTimer();  // Reset the timer with new values
}

// Save notes to localStorage
notes.addEventListener('input', () => {
  localStorage.setItem('userNotes', notes.value);
});

// Load saved notes on page load
window.addEventListener('load', () => {
  const savedNotes = localStorage.getItem('userNotes');
  if (savedNotes) {
    notes.value = savedNotes;
  }
});

let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

// When the user clicks on the header, start the dragging process
notesHeader.onmousedown = function(e) {
  e.preventDefault();
  
  // Get the current mouse position
  mouseX = e.clientX;
  mouseY = e.clientY;

  // When the user moves the mouse, call the drag function
  document.onmousemove = dragElement;

  // When the user releases the mouse button, stop dragging
  document.onmouseup = stopDragging;
};

function dragElement(e) {
  e.preventDefault();
  
  // Calculate the new cursor position
  offsetX = mouseX - e.clientX;
  offsetY = mouseY - e.clientY;

  // Update the mouse positions
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Set the position of the notes container
  notesContainer.style.top = (notesContainer.offsetTop - offsetY) + "px";
  notesContainer.style.left = (notesContainer.offsetLeft - offsetX) + "px";
}

notesContainer.addEventListener('mouseenter', () => {
  tooltipText.style.visibility = 'visible';
  tooltipText.style.opacity = '1';
});

// Hide tooltip when user leaves the notes container
notesContainer.addEventListener('mouseleave', () => {
  tooltipText.style.visibility = 'hidden';
  tooltipText.style.opacity = '0';
});

function stopDragging() {
  // Stop moving when the mouse button is released
  document.onmousemove = null;
  document.onmouseup = null;
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer)
resetBtn.addEventListener('click', resetTimer);
saveSettingsBtn.addEventListener('click', saveSettings);

// Initialize display
updateDisplay();
