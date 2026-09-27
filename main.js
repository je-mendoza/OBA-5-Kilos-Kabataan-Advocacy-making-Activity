// ===== STATE =====
 
function createFreshState() {
  const habitKeys = ["meals", "screenFreeBed", "tookBreak"];
  const days = {};
 
  for (let i = 1; i <= 30; i++) {
    const habits = {};
    habitKeys.forEach((key) => {
      habits[key] = false;
    });
    days[i] = { completed: false, habits: habits };
  }
 
  return { currentDay: 1, days: days };
}
 
function loadTrackerState() {
  const saved = localStorage.getItem('trackerState');
  if (saved === null) {
    return createFreshState();
  }
  return JSON.parse(saved);
}
 
function saveTrackerState() {
  localStorage.setItem('trackerState', JSON.stringify(trackerState));
}
 
let trackerState = loadTrackerState();
let currentDay = trackerState.currentDay; // whichever day is currently being viewed
 
 
// ===== STATE MUTATIONS =====
 
function toggleHabit(dayNumber, habitKey, isChecked) {
  trackerState.days[dayNumber].habits[habitKey] = isChecked;
  saveTrackerState();
}
 
function completeDay(dayNumber) {
  trackerState.days[dayNumber].completed = true;
  if (trackerState.currentDay === dayNumber) {
    trackerState.currentDay = dayNumber + 1;
  }
  saveTrackerState();
}
 
 
// ===== RENDERING (reads state, never changes it) =====
 
function renderDay(dayNumber) {
  const day = trackerState.days[dayNumber];
  if (!day) return; // safety: dayNumber 31 doesn't exist, do nothing
 
  // 1. Panel title
  document.getElementById("day-panel-title").textContent = "Day " + dayNumber;
 
  // 2. Habit checkboxes reflect this day's saved values
  const habitCheckboxes = document.querySelectorAll('#habit-list input[type="checkbox"]');
  habitCheckboxes.forEach((checkbox) => {
    const habitKey = checkbox.dataset.habit;
    checkbox.checked = day.habits[habitKey];
  });
 
  // 3. Day grid cells: done / current / locked
  const dayCells = document.querySelectorAll('.day-cell');
  dayCells.forEach((cell) => {
    const cellDay = Number(cell.dataset.day);
    cell.classList.remove('day-cell--done', 'day-cell--current', 'day-cell--locked');
 
    if (trackerState.days[cellDay].completed) {
      cell.classList.add('day-cell--done');
    } else if (cellDay === trackerState.currentDay) {
      cell.classList.add('day-cell--current');
    } else {
      cell.classList.add('day-cell--locked');
    }
  });
 
  renderStats();
}
 
function renderStats() {
  const allDays = Object.values(trackerState.days);
  const totalDone = allDays.filter(d => d.completed).length;
 
  document.getElementById("stat-days").textContent = totalDone + " / 30";
  document.getElementById("progress-caption").textContent = totalDone + " of 30 days done";
  document.getElementById("progress-fill").style.width = (totalDone / 30 * 100) + "%";
 
  let habitsDone = 0;
  allDays.forEach(d => {
    habitsDone += Object.values(d.habits).filter(Boolean).length;
  });
  document.getElementById("stat-habits").textContent = habitsDone + " / 90";
 
  // Current streak: consecutive completed days counting backwards from currentDay - 1
  let streak = 0;
  for (let i = trackerState.currentDay - 1; i >= 1; i--) {
    if (trackerState.days[i] && trackerState.days[i].completed) {
      streak++;
    } else {
      break;
    }
  }
  document.getElementById("stat-streak").textContent = "🔥 " + streak;
}
 
 
// ===== EVENT LISTENERS =====
 
// Clicking a day cell switches which day is being viewed (can't jump ahead of progress)
const dayCells = document.querySelectorAll('.day-cell');
dayCells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const clickedDay = Number(cell.dataset.day);
    if (clickedDay > trackerState.currentDay) return; // locked, do nothing
    currentDay = clickedDay;
    renderDay(currentDay);
  });
});
 
// Checking a habit box updates state immediately
const habitCheckboxes = document.querySelectorAll('#habit-list input[type="checkbox"]');
habitCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    toggleHabit(currentDay, checkbox.dataset.habit, checkbox.checked);
  });
});
 
// Complete Day button finalizes the day and advances
const completeDayBtn = document.getElementById("complete-day-btn");
completeDayBtn.addEventListener("click", () => {
  completeDay(currentDay);
  currentDay = trackerState.currentDay;
  renderDay(currentDay);
});
 
 
// ===== INITIAL RENDER, ON PAGE LOAD =====
renderDay(currentDay);




let count = 1;
  let hasPledged = false;

  function submitPledge() {
    const counterElement = document.getElementById('pledgeCounter');
    const btnElement = document.getElementById('pledgeBtn');

    if (!hasPledged) {
      count++;
      counterElement.innerText = count;
      btnElement.innerText = "✓ You Have Signed The Pledge!";
      btnElement.style.backgroundColor = "#22c55e";
      btnElement.style.color = "#ffffff";
      hasPledged = true;
    }
}