const STATE = {
  ACTIVE: "active",
  LOCKED: "locked",
  LOST: "lost"
};

let currentState = STATE.LOST;
let lastSeen = 0;

function updateState(detected, confidence) {
  const now = performance.now();

  if (detected && confidence >= 0.85) {
    currentState = STATE.ACTIVE;
    lastSeen = now;
  } 
  else if (detected && confidence >= 0.55) {
    currentState = STATE.LOCKED;
    lastSeen = now;
  } 
  else if (now - lastSeen > 600) {
    currentState = STATE.LOST;
  }

  return currentState;
}

window.AR_ENGINE = {
  STATE,
  updateState,
  getState: () => currentState
};
