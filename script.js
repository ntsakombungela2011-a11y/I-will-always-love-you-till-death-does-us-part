const openButton = document.getElementById("openDelivery");
const delivery = document.getElementById("delivery");
const spinButton = document.getElementById("spinButton");
const spinCaption = document.getElementById("spinCaption");
const blades = document.getElementById("blades");
const miniBlades = document.getElementById("miniBlades");
const windmillWrap = document.getElementById("windmillWrap");
const windPower = document.getElementById("windPower");
const windValue = document.getElementById("windValue");
const windDescription = document.getElementById("windDescription");
const secretNote = document.getElementById("secretNote");
const surpriseButton = document.getElementById("surpriseButton");
const extraSurprise = document.getElementById("extraSurprise");

let audioContext;
let spinCount = 0;
let totalRotation = 0;

function playTone(frequency = 540, duration = 0.12, type = "sine") {
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch (error) { /* Audio is optional; the page still works without it. */ }
}

function updateWindLabel() {
  const level = Number(windPower.value);
  const descriptions = ["Barely a breeze. She is shy.", "A gentle little puff.", "A respectable little breeze.", "OKAY, IT IS GETTING WINDY.", "CATEGORY FIVE WINDMILL BUSINESS."];
  windValue.textContent = level + " / 5";
  windDescription.textContent = descriptions[level - 1];
}

function spinWindmill() {
  spinCount += 1;
  const power = Number(windPower.value);
  const turns = 2 + power * 2;
  totalRotation += 360 * turns;
  blades.style.transform = `rotate(${totalRotation}deg)`;
  miniBlades.style.transform = `rotate(${totalRotation}deg)`;
  windmillWrap.animate([{transform:"rotate(-5deg) scale(1)"},{transform:"rotate(3deg) scale(1.04)"},{transform:"rotate(-5deg) scale(1)"}],{duration:700-power*55,easing:"ease-out"});
  playTone(350 + power * 35, 0.08, "triangle");
  window.setTimeout(() => playTone(500 + power * 35, 0.1, "triangle"), 100);
  window.setTimeout(() => playTone(680 + power * 35, 0.14, "triangle"), 205);
  const captions = ["Look at it go. NASA could never.", "Still spinning. Still ridiculous.", "A highly advanced piece of technology.", "The windmill has requested a promotion.", "Boipelo, please stop giving it so much power.", "We have officially lost control of the wind."];
  spinCaption.textContent = captions[(spinCount - 1) % captions.length];
  if (spinCount >= 7) secretNote.classList.remove("hidden");
}

openButton.addEventListener("click", () => {
  delivery.classList.remove("hidden");
  delivery.scrollIntoView({behavior:"smooth",block:"start"});
  playTone(620,0.12);
  window.setTimeout(() => playTone(790,0.16),100);
  openButton.textContent = "Delivery opened ✓";
  openButton.disabled = true;
});
spinButton.addEventListener("click", spinWindmill);
windmillWrap.addEventListener("click", spinWindmill);
windmillWrap.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); spinWindmill(); }
});
windPower.addEventListener("input", updateWindLabel);
surpriseButton.addEventListener("click", () => {
  extraSurprise.classList.toggle("hidden");
  surpriseButton.innerHTML = extraSurprise.classList.contains("hidden") ? 'One last tiny surprise <span>♡</span>' : 'Hide my tiny surprise <span>♥</span>';
  playTone(740,0.13);
});
updateWindLabel();