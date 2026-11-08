const openButton = document.getElementById("openDelivery");
const delivery = document.getElementById("delivery");
const spinButton = document.getElementById("spinButton");
const spinCaption = document.getElementById("spinCaption");
const blades = document.getElementById("blades");
const miniBlades = document.getElementById("miniBlades");
const windmillWrap = document.getElementById("windmillWrap");

let audioContext;
let spinCount = 0;

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
  } catch (error) {
    // The page still works if the browser does not support Web Audio.
  }
}

openButton.addEventListener("click", () => {
  delivery.classList.remove("hidden");
  delivery.scrollIntoView({ behavior: "smooth", block: "start" });
  playTone(620, 0.12);
  window.setTimeout(() => playTone(790, 0.16), 100);
  openButton.textContent = "Delivery opened ✓";
  openButton.disabled = true;
});

spinButton.addEventListener("click", () => {
  spinCount += 1;
  const turns = 5 + (spinCount % 3);
  blades.style.transform = `rotate(${spinCount * 360 * turns}deg)`;
  miniBlades.style.transform = `rotate(${spinCount * 360 * turns}deg)`;
  windmillWrap.animate(
    [{ transform: "rotate(-5deg) scale(1)" }, { transform: "rotate(3deg) scale(1.04)" }, { transform: "rotate(-5deg) scale(1)" }],
    { duration: 650, easing: "ease-out" }
  );
  playTone(420, 0.08, "triangle");
  window.setTimeout(() => playTone(590, 0.1, "triangle"), 110);
  window.setTimeout(() => playTone(760, 0.14, "triangle"), 220);
  const captions = [
    "Look at it go. NASA could never.",
    "Still spinning. Still ridiculous.",
    "A highly advanced piece of technology.",
    "The windmill has requested a promotion."
  ];
  spinCaption.textContent = captions[(spinCount - 1) % captions.length];
});
