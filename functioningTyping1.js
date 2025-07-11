// === Konfiguration ===
const MAX_WPM = 150; // Anfangsgeschwindigkeit
const BRAKE_WPM = 60; // Abbremsgeschwindigkeit
const TARGET_WPM = 103; // Final gewünschte WPM -- 103 beste Zeit für 99

const inputSelector = ".txtInput";
const spanPanelSelector = ".inputPanel";

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
  return Math.min(Math.max(x, 0), n); // Begrenzen auf 0 bis n
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

// === Hauptfunktion: automatisiertes Tippen mit geplanter Bremse ===
function typeSmartControlled(text, inputElement) {
  const totalChars = text.length;
  const brakeIndex = calculateBrakeIndex(
    totalChars,
    MAX_WPM,
    BRAKE_WPM,
    TARGET_WPM
  );
  console.log(
    `✏️ Gesamtzeichen: ${totalChars}, Bremsbeginn bei Zeichen: ${brakeIndex}`
  );

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
      // Fertig → WPM anzeigen
      setTimeout(() => {
        const finalWPM =
          document.querySelector(".rankPanelWpm.rankPanelWpm-self")
            ?.innerText || "Unbekannt";
        console.log("✅ Ziel erreicht! End-WPM:", finalWPM);
        alert("Fertig! Deine WPM: " + finalWPM);
      }, 1000);
    }
  }

  typeNextChar();
}

// === Text vorbereiten und Script starten ===
(function start() {
  const input = document.querySelector(inputSelector);
  const panel = document.querySelector(spanPanelSelector);
  const spans = panel.querySelectorAll("span");
  const text = Array.from(spans)
    .map((span) => span.innerText)
    .join("");

  typeSmartControlled(text, input);
})();
