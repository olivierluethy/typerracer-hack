(async function ocrChallenge() {
  'use strict';

  // 📥 1. Tesseract.js laden, falls noch nicht vorhanden
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

  // 🔍 2. Bild und Textarea finden
  const img = document.querySelector('img.challengeImg');
  const textarea = document.querySelector('textarea.challengeTextArea');
  if (!img || !textarea) {
    console.error('challengeImg oder challengeTextArea nicht gefunden!');
    return;
  }

  // 🖼️ 3. Bild laden und auf Canvas zeichnen
  if (!img.complete || img.naturalWidth === 0) {
    await new Promise(resolve => img.onload = resolve);
  }

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // 🧼 4. Graustufen anwenden (für bessere OCR)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg;
  }
  ctx.putImageData(imageData, 0, 0);

  // 🔤 5. OCR mit Tesseract
  console.log('🧠 OCR läuft …');
  Tesseract.recognize(canvas, 'eng', {
    logger: m => console.log(`[OCR] ${m.status}: ${Math.round(m.progress * 100)}%`)
  })
    .then(({ data: { text } }) => {
      const cleanText = text.trim();
      console.log('✅ OCR-Ergebnis:', cleanText);
      textarea.value = cleanText;
    })
    .catch(err => console.error('❌ OCR-Fehler:', err));
})();
