# TypeRacer – Good Morning ☕️⌨️

> A speed-controlled, anti-cheat-friendly typing automation script for online typing platforms.

## 🧠 Purpose

**TypeRacer - Good Morning** is a browser-based script that simulates human-like typing while staying under a configurable WPM (Words Per Minute) threshold to avoid triggering anti-cheat systems. It intelligently calculates the moment to slow down and maintain a legal average typing speed.

## ✨ Features

- Dynamic WPM adjustment based on accurate formula calculation
- Automatically reads the target text from the page
- Simulates realistic typing with key events
- Configurable max speed, brake speed, and target WPM
- Console logging and alert with final WPM result

## 📐 WPM Formulas and Typing Strategy

Yes, there are clear formulas to calculate **WPM (Words Per Minute)** based on the number of typed characters and time. These are used to **precisely control average typing speed**, allowing you to **temporarily type faster**, and then slow down to stay under a target WPM (like 99) to avoid triggering anti-cheat systems.

### 📌 Basic WPM Formula

The standard definition of WPM is:

\[
\text{WPM} = \frac{\text{Number of characters}}{5 \times \text{Time in minutes}}
\]

> Assumes an average word length of **5 characters** including spaces.

### 🔍 Rewritten to Calculate Allowed Characters

If you know the WPM and time, you can calculate the **maximum allowed characters** to stay under a WPM threshold:

\[
\text{Characters} = \text{WPM} \times 5 \times \text{Minutes}
\]

### ✅ Example

If you want to achieve **exactly 99 WPM** over **1 minute**, then:

\[
\text{Characters} = 99 \times 5 \times 1 = 495 \text{ characters}
\]

If you type **faster than 495 characters per minute**, you must **slow down later** to keep the average below 99 WPM.

### 📊 Dynamic Speed Control Strategy

If you type at a high speed for a certain time, you can **intentionally reduce your speed** or pause later to ensure your **average speed** drops below the limit.

#### General Formula for Average WPM

If you type with:

- Speed \( v_1 \) (e.g., 120 WPM) for \( t_1 \) minutes
- Then with \( v_2 \) (e.g., 60 WPM) for \( t_2 \) minutes

Then:

\[
\text{WPM}_{\text{avg}} = \frac{v_1 \cdot t_1 + v_2 \cdot t_2}{t_1 + t_2}
\]

To ensure:

\[
\text{WPM}_{\text{avg}} \leq 99
\]

You can solve this to determine when to slow down.

### 🧠 Example: When to Slow Down?

You're typing with:

- \( v_1 = 120 \) WPM initially
- \( v_2 = 60 \) WPM after
- Total time \( t_{\text{max}} = 1 \) minute

Find \( t_1 \) such that:

\[
\frac{120 \cdot t_1 + 60 \cdot (1 - t_1)}{1} \leq 99
\]

Solve:

\[
120t_1 + 60 - 60t_1 \leq 99 \\
\Rightarrow 60t_1 \leq 39 \\
\Rightarrow t_1 \leq 0.65 \text{ minutes} = 39 \text{ seconds}
\]

✅ So: You may type fast (120 WPM) for up to **39 seconds**, then slow down to 60 WPM for the remaining time.

### 📘 Final Recommendation

Use these formulas to **dynamically control your typing**, ensuring you **never exceed a target average speed** like 99 WPM:

1. Start with a high WPM (e.g., 110–130)
2. Use the formulas to calculate how long you can sustain it
3. Intentionally slow down or pause to adjust your average
4. Use this script to automate the transition

## ⚙️ Configuration Options

Inside the script:

```js
const MAX_WPM = 130;        // Initial fast typing speed
const BRAKE_WPM = 60;       // Reduced speed after brake point
const TARGET_WPM = 99;      // Average WPM cap (anti-cheat safe)
const TEXT_SELECTOR = ".word";   // Selector to grab the page text
const INPUT_SELECTOR = "input.inputPanel-input"; // Input field
```

## 🚀 Usage Instructions

1. Open your desired typing site (Monkeytype, 10FastFingers, etc.)
2. Open **Developer Tools** (`F12`) → **Console**
3. Paste and run the script
4. The script will:

   * Automatically extract text from the page
   * Calculate WPM-safe brake index
   * Simulate typing with dynamic speed control
   * Show your final WPM

## 📈 Script Evolution

| Version | Description                                                       |
| ------- | ----------------------------------------------------------------- |
| `v0.1`  | Simple static typing script with delay                            |
| `v0.2`  | Introduced configurable WPM values                                |
| `v0.3`  | Added real WPM formula and brake logic                            |
| `v0.4`  | Extracts text automatically from the page                         |
| `v1.0`  | Fully dynamic and customizable typing bot with live speed control |

## ⚠️ Disclaimer

This script is intended for **educational, testing, and personal automation use only**. Use responsibly and avoid violating any platform's terms of service.

## 🧠 Credits

Script logic and math support powered by OpenAI.

> ☀️ Start your day smart. Type fast – but not *too* fast.