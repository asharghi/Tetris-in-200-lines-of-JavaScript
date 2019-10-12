//This script is only needed for mobile. Adding invisible buttons on screen that triggers arrow key presses

const keys = [{ keyCode: 37, keyName: "left" }, 
              { keyCode: 38, keyName: "up" },
              { keyCode: 39, keyName: "right" }, 
              { keyCode: 40, keyName: "down" }];

let hiddenButtons = document.createElement("style");
hiddenButtons.innerHTML = ".tetris-left-click-area {top: 35%;left: 0;width: 50%;height: 35%;}.tetris-right-click-area {top: 35%;left: 50%;width: 50%;height: 35%;}.tetris-up-click-area {top: 0;left: 0;width: 100%;height: 35%;}.tetris-down-click-area {top: 70%;left: 0;width: 100%;height: 30%;}.click-area{z-index: 9999;position: absolute;}*{touch-action: manipulation;-webkit-touch-callout: none;-webkit-user-select: none;}"
document.body.appendChild(hiddenButtons);

keys.forEach(k => {
  let node = document.createElement("div");
  node.className = "tetris-" + k.keyName + "-click-area click-area";
  node.onmousedown = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': k.keyCode , 'which': k.keyCode }));
  };
  document.body.appendChild(node);
});