// === Konfiguration ===
const MAX_WPM = 150;
const BRAKE_WPM = 60;
const TARGET_WPM = 103;

const inputSelector = ".txtInput";
const spanPanelSelector = ".inputPanel";
const countdownSelector = ".popupContent span.time";
const restartButtonSelector = ".raceAgainLink-green";

// === Umrechnungsfunktion: WPM → Verzögerung (ms pro Zeichen) ===
function getDelayFromWPM(wpm) {
  const charsPerMinute = wpm * 5;
  const charsPerSecond = charsPerMinute / 60;
  return 1000 / charsPerSecond;
}

// === Berechnet den Punkt, an dem abgebremst werden muss ===
function calculateBrakeIndex(totalChars, maxWPM, brakeWPM, targetWPM) {
  const n = totalChars;
  const A = 1 / maxWPM;
  const B = 1 / brakeWPM;
  const C = 1 / targetWPM;
  const numerator = B * n - C * n;
  const denominator = B - A;
  const x = Math.round(numerator / denominator);
  return Math.min(Math.max(x, 0), n);
}

// === Event-Simulation ===
function dispatchKeyboardEvent(element, type, key) {
  const event = new KeyboardEvent(type, {
    key: key,
    code: key,
    charCode: key.charCodeAt(0),
    keyCode: key.charCodeAt(0),
    which: key.charCodeAt(0),
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}

function dispatchInputEvent(element, value) {
  const inputEvent = new InputEvent("input", {
    data: value,
    bubbles: true,
    cancelable: true,
    inputType: "insertText",
  });
  element.dispatchEvent(inputEvent);
}

// === Automatischer Schreibprozess ===
function typeSmartControlled(text, inputElement, onDone) {
  const totalChars = text.length;
  const brakeIndex = calculateBrakeIndex(totalChars, MAX_WPM, BRAKE_WPM, TARGET_WPM);
  let i = 0;

  function typeNextChar() {
    if (i < text.length) {
      const char = text[i];
      const currentWPM = i < brakeIndex ? MAX_WPM : BRAKE_WPM;
      const delay = getDelayFromWPM(currentWPM);

      inputElement.focus();
      dispatchKeyboardEvent(inputElement, "keydown", char);
      dispatchKeyboardEvent(inputElement, "keypress", char);
      inputElement.value += char;
      dispatchInputEvent(inputElement, char);
      dispatchKeyboardEvent(inputElement, "keyup", char);

      i++;
      setTimeout(typeNextChar, delay);
    } else {
      setTimeout(onDone, 1000);
    }
  }

  typeNextChar();
}

// === Countdown per Intervall prüfen ===
function waitForCountdownInterval(callback) {
  const interval = setInterval(() => {
    const countdown = document.querySelector(countdownSelector);

    if (countdown) {
      const timeText = countdown.innerText.trim().replace(":", "");
      if (timeText === "0" || timeText === "00") {
        clearInterval(interval);
        console.log("⏱️ Countdown vorbei, warte 500ms...");
        setTimeout(callback, 1200);  // <-- Hier wird nun gewartet //instant-death mode: 800; normal mode: 1000;
      } else {
        console.log("⏳ Warte... Countdown:", timeText);
      }
    }
  }, 250);
}

// === Starte Rennprozess ===
function startRaceProcess() {
  console.log("🕵️ Suche nach Countdown...");
  waitForCountdownInterval(() => {
    const input = document.querySelector(inputSelector);
    const panel = document.querySelector(spanPanelSelector);
    if (!input || !panel) {
      console.warn("❌ Eingabefeld oder Panel nicht gefunden!");
      return setTimeout(startRaceProcess, 1000);
    }

    const spans = panel.querySelectorAll("span");
    const text = Array.from(spans).map((span) => span.innerText).join("");

    typeSmartControlled(text, input, () => {
      console.log("🏁 Rennen abgeschlossen. Starte neu...");
      const restartBtn = document.querySelector(restartButtonSelector);
      if (restartBtn) {
        restartBtn.click();
        setTimeout(startRaceProcess, 2000);
      } else {
        console.warn("🔁 Restart-Button nicht gefunden.");
      }
    });
  });
}

// === Initialisierung ===
(function init() {
  console.log("🏎️ AutoRacer gestartet...");
  startRaceProcess();
})();
