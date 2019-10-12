const initTetris = ({ width, height, pixelSize }) => {
    let startPosition = Math.floor((width) / 2) + width + width;
    let position = startPosition;
    let rotation = 0, currentScore = 0;
    let currentBlock = false, nextBlock = false;

    const clearBoard = () => { 
        document.querySelectorAll(".pixel-fill").forEach(node => { node.classList.remove("pixel-fill") });
    }

    const renderBlock = (block, rotation, position) => {
        clearBoard();
        block[rotation](position).forEach(index => {
            document.querySelectorAll(".tetris-pixel")[index].classList.add('pixel-fill');
        });
    }

    const freezeBlock = (block, rotation, position) => {
        clearBoard();
        block[rotation](position).forEach(index => { document.querySelectorAll(".tetris-pixel")[index].classList.add('pixel-stop'); });
    }

    const moveIsAllowed = (block, rotation, position) => {
        return !block[rotation](position).some(index => {
            return document.querySelectorAll(".tetris-pixel")[index].classList.contains('pixel-stop');
        });
    }

    const SetScore = () => { 
        let gameNode = document.querySelector(".tetris-game");
        gameNode.removeChild(document.querySelector(".tetris-score"));
        let scoreNode = document.createElement('div');
        scoreNode.className = "tetris-score";
        scoreNode.innerHTML = currentScore;
        gameNode.appendChild(scoreNode);
    }

    const AddNewLineAtTop = () => {
        var secondLineNode = document.querySelectorAll(".tetris-pixel")[width];
        for (var i = 0; i < width; i++) {
            let pixelNode = document.createElement('div');
            pixelNode.className = "tetris-pixel" + (i === 0 || i === width - 1 ? " pixel-stop" : "")
            secondLineNode.parentNode.insertBefore(pixelNode, secondLineNode);
        }
        secondLineNode.parentNode.insertBefore(document.createElement('br'), secondLineNode);
    }

    const RemoveFullLines = () => {
        let pixelNodes = document.querySelectorAll(".tetris-pixel");
        const hasClass = (element, className) => { return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1; }
        let numberOfLinesRemoved = 0;
        for (var i = height - 2; i > 0; i--) {
            let positionAtRowStart = i * width + 1;
            let positionAtRowEnd = positionAtRowStart + width - 2;
            let fullPixel = [positionAtRowStart - 1, positionAtRowEnd];
            for (var j = positionAtRowStart; j < positionAtRowEnd; j++) {
                let node = pixelNodes[j];
                if (!hasClass(node, "pixel-stop"))
                    break;
                fullPixel.push(j);
            }
            if (fullPixel.length === width) {
                fullPixel.forEach(p => {
                    let node = pixelNodes[p];
                    node.parentNode.removeChild(node);
                });
                numberOfLinesRemoved++;
                AddNewLineAtTop();
            }
        }
        currentScore += { 0: 0, 1: 40, 2: 100, 3: 300, 4: 1200 }[numberOfLinesRemoved];
        SetScore();
    }
    const AddStyle = () => {
        var node = document.createElement('style');
        node.innerHTML = `
        .tetris-pixel{ width:${pixelSize}px; height:${pixelSize}px; display:inline-block; box-sizing: border-box; }
        .tetris-score{ color: #37a48b; font-size: 3em; margin-top: 1em; text-align: center; font-family: monospace; }
        .tetris-pixel.pixel-stop{ background: #37a48b; opacity:0.3 }
        .tetris-pixel.pixel-fill{ background: #37a48b; }
        .tetris-game {  line-height: 0; position: absolute; top: 50%; left: 50%; z-index: 99; transform: translate(-50%, -50%); }`;
        document.body.appendChild(node);
    }
    const AddHtml = () => {
        let gameNode = document.createElement('div');
        gameNode.className = "tetris-game"
        document.body.appendChild(gameNode);
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                let pixelNode = document.createElement('div');
                pixelNode.className = "tetris-pixel" + (i === 0 || i === height - 1 || j === 0 || j === width - 1 ? " pixel-stop" : "")
                gameNode.appendChild(pixelNode);
            }
            gameNode.appendChild(document.createElement('br'));
        }
        let scoreNode = document.createElement('div');
        scoreNode.className = "tetris-score";
        scoreNode.innerHTML = "0";
        gameNode.appendChild(scoreNode);
    }

    AddHtml();
    AddStyle();

    const blockTypes = [
        /*J*/[(p) => { return [p - width, p, p + width, p + width - 1] },
        (p) => { p = ((p - 2) % width) === 0 ? p + 1 : p; return [p - 2, p - 1, p, p + width] },
        (p) => { return [p - width, p - width - 1, p - 1, p + width - 1] },
        (p) => { p = ((p - 2) % width) === 0 ? p + 1 : p; return [p - width - 2, p - 2, p - 1, p] }],

        /*Z*/[(p) => { p = ((p - 1) % width) === 0 ? p + 1 : p; return [p - 1, p, p + width, p + width + 1] },
        (p) => { return [p, p + 1, p - width + 1, p + width] }],

        /*S*/[(p) => { p = ((p - 2) % width) === 0 ? p + 1 : p; return [p, p - 1, p + width - 1, p + width - 2] },
        (p) => { return [p - 1, p, p + width, p - width - 1] }],

        /*L*/[(p) => { return [p - width, p, p + width, p + width + 1] },
        (p) => { p = ((p - 1) % width) === 0 ? p + 1 : p; return [p - 1, p, p + 1, p - width + 1] },
        (p) => { return [p - width, p - width + 1, p + 1, p + width + 1] },
        (p) => { p = ((p - 1) % width) === 0 ? p + 1 : p; return [p - 1 + width, p - 1, p, p + 1] }],

        /*T*/[(p) => { p = ((p - 2) % width) === 0 ? p + 1 : p; return [p - 2, p - 1, p, p - width - 1] },
        (p) => { return [p - width - 1, p - 1, p, p + width - 1] },
        (p) => { p = ((p - 2) % width) === 0 ? p + 1 : p; return [p - 2, p - 1, p, p + width - 1] },
        (p) => { return [p - 1, p, p - width, p + width] }],
        /*O*/[(p) => { return [p - 1, p, p + width, p + width - 1] }],

        /*I*/[(p) => { return [p - width, p, p + width, p + width + width] },
        (p) => { p = ((p - 1) % width) === 0 || ((p - 2) % width) === 0 || ((p - 3) % width) === 0 ? p + 3 : p; return [p - 3, p - 2, p - 1, p] }]
    ];

    let player = setInterval(() => {
        currentBlock = currentBlock || blockTypes[Math.floor(Math.random() * blockTypes.length)];
        nextBlock = nextBlock || blockTypes[Math.floor(Math.random() * blockTypes.length)];
        let tempMove = { rotation, position }
        tempMove.position += width;
        if (moveIsAllowed(currentBlock, tempMove.rotation, tempMove.position)) {
            position += width;
            renderBlock(currentBlock, rotation, position);
        } else {
            if (!moveIsAllowed(nextBlock, 0, startPosition)) {
                clearInterval(player);
                freezeBlock(currentBlock, rotation, position);
            } else {
                freezeBlock(currentBlock, rotation, position);
                position = startPosition;
                rotation = 0;
                currentBlock = nextBlock;
                nextBlock = blockTypes[Math.floor(Math.random() * blockTypes.length)];
                RemoveFullLines();
            }
        }
    }, 1000);

    document.onkeydown = e => {
        let tempMove = { rotation, position }
        switch (e.keyCode) {
            case 37: //LEFT
                tempMove = { rotation, position }
                if (moveIsAllowed(currentBlock, tempMove.rotation, --tempMove.position)) {
                    renderBlock(currentBlock, rotation, --position);
                }
                e.preventDefault();
                break;
            case 38: //UP
                tempMove = { rotation, position }
                tempMove.rotation = tempMove.rotation >= currentBlock.length - 1 ? 0 : tempMove.rotation + 1;
                if (moveIsAllowed(currentBlock, tempMove.rotation, tempMove.position)) {
                    rotation = rotation >= currentBlock.length - 1 ? 0 : rotation + 1;
                    renderBlock(currentBlock, rotation, position);
                }
                e.preventDefault();
                break;
            case 39: //RIGHT
                tempMove = { rotation, position }
                if (moveIsAllowed(currentBlock, tempMove.rotation, ++tempMove.position)) {
                    renderBlock(currentBlock, rotation, ++position);
                }
                e.preventDefault();
                break;
            case 40: //DOWN
                tempMove = { rotation, position }
                tempMove.position += width;
                if (moveIsAllowed(currentBlock, tempMove.rotation, tempMove.position)) {
                    position += width;
                    renderBlock(currentBlock, rotation, position);
                }
                e.preventDefault();
                break;
            case 27: //ESC
                clearInterval(player);
                let game = document.querySelector('.tetris-game');
                game.parentNode.removeChild(game);
                e.preventDefault();
                break;
        }
    }
};

initTetris({ width: 10, height: 20, pixelSize: 35 });