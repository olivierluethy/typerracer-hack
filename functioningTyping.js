// === Konfiguration ===
const WPM = 180; // Einstellbar: Zwischen 10 und 100 empfohlen
const inputSelector = ".txtInput";
const spanPanelSelector = ".inputPanel";

// === Umrechnung WPM → Zeichen pro Millisekunde ===
// Durchschnittlich 5 Zeichen pro Wort → also: WPM * 5 = Zeichen pro Minute
const charsPerMinute = WPM * 5;
const charsPerSecond = charsPerMinute / 60;
const delayPerChar = 1000 / charsPerSecond; // in ms

// === Wort aus <span>-Elementen holen ===
const panel = document.querySelector(spanPanelSelector);
const spans = panel.querySelectorAll("span");
const text = Array.from(spans).map(span => span.innerText).join("");

// === Input-Feld finden ===
const input = document.querySelector(inputSelector);

// === Funktion zum realistischen Schreiben ===
function dispatchKeyboardEvent(element, type, key) {
    const event = new KeyboardEvent(type, {
        key: key,
        code: key,
        charCode: key.charCodeAt(0),
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(event);
}

function dispatchInputEvent(element, value) {
    const inputEvent = new InputEvent('input', {
        data: value,
        bubbles: true,
        cancelable: true,
        inputType: 'insertText'
    });
    element.dispatchEvent(inputEvent);
}

function typeTextRealistic(text, inputElement, delay) {
    inputElement.focus(); // Fokus setzen
    let i = 0;

    function typeNextChar() {
        if (i < text.length) {
            const char = text[i];

            // Simuliere echte Tastaturereignisse
            dispatchKeyboardEvent(inputElement, 'keydown', char);
            dispatchKeyboardEvent(inputElement, 'keypress', char);

            // Fügt das Zeichen dem Wert hinzu
            inputElement.value += char;

            // Löst input-Event aus
            dispatchInputEvent(inputElement, char);

            dispatchKeyboardEvent(inputElement, 'keyup', char);

            i++;
            setTimeout(typeNextChar, delay);
        }
    }

    typeNextChar();
}

// === Start der Eingabe ===
typeTextRealistic(text, input, delayPerChar);
