//This script is only needed for mobile. Adding swipe events for triggering arrow key presses
let swipeElement = document.createElement("div");
swipeElement.className = "tetris-swipe-element";
swipeElement.style = "position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 999;";

const triggerKeyPress = keyCode => {
  document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': keyCode, 'which': keyCode }));
};

[{ keyCode: 37, eventName: "swipeleft" },
{ keyCode: 38, eventName: "swipeup" },
{ keyCode: 39, eventName: "swiperight" },
{ keyCode: 40, eventName: "swipedown" }].forEach(s => {
  swipeElement.addEventListener(s.eventName, (e) => {
    triggerKeyPress(s.keyCode);
  });
});

document.body.appendChild(swipeElement);