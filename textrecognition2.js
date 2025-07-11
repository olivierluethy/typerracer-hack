(async function ocrChallenge() {
  'use strict';

  // === Konfiguration ===
  const WPM = 109; // ⏱️ Wörter pro Minute — hier einstellbar!
  const charsPerMinute = WPM * 5;
  const delayPerChar = 60000 / charsPerMinute; // ⏳ Zeichenverzögerung in ms

  // 📥 Tesseract.js laden
  if (typeof Tesseract === 'undefined') {
    console.log('Tesseract.js wird geladen …');
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/tesseract.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    console.log('✅ Tesseract.js geladen.');
  }

  // 🔍 Bild und Textarea finden
  const img = document.querySelector('img.challengeImg');
  const textarea = document.querySelector('textarea.challengeTextArea');
  if (!img || !textarea) {
    console.error('❌ challengeImg oder challengeTextArea nicht gefunden!');
    return;
  }

  // 🖼️ Warten bis das Bild vollständig geladen ist
  if (!img.complete || img.naturalWidth === 0) {
    await new Promise(resolve => img.onload = resolve);
  }

  // 📷 Bild auf Canvas zeichnen
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // 🔳 Graustufen anwenden (für bessere OCR)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg;
  }
  ctx.putImageData(imageData, 0, 0);

  // 🔤 OCR starten
  console.log('🧠 OCR läuft …');
  const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
    logger: m => console.log(`[OCR] ${m.status}: ${Math.round(m.progress * 100)}%`)
  });

  const cleanText = text.trim();
  console.log('✅ OCR-Ergebnis:', cleanText);

  // ✍️ Funktion zum realistischen Schreiben
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

  function typeTextRealistic(text, inputElement, delay, callback) {
    inputElement.focus();
    let i = 0;
    function typeNextChar() {
      if (i < text.length) {
        const char = text[i];

        dispatchKeyboardEvent(inputElement, 'keydown', char);
        dispatchKeyboardEvent(inputElement, 'keypress', char);
        inputElement.value += char;
        dispatchInputEvent(inputElement, char);
        dispatchKeyboardEvent(inputElement, 'keyup', char);

        i++;
        setTimeout(typeNextChar, delay);
      } else if (callback) {
        callback();
      }
    }
    typeNextChar();
  }

  // 🧠 Simuliere Eingabe mit realistischer Tippgeschwindigkeit
  typeTextRealistic(cleanText, textarea, delayPerChar, () => {
    // ✅ Klick auf Button mit Klasse "gwt-Button"
    const button = document.querySelector('.gwt-Button');
    if (button) {
      button.click();
      console.log('🖱️ Button wurde geklickt!');
    } else {
      console.warn('⚠️ Kein Button mit Klasse "gwt-Button" gefunden.');
    }
  });
})();
