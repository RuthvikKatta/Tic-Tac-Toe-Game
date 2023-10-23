const sizeButton = document.querySelectorAll('.size-button')
const difficultyButton = document.querySelectorAll('.difficulty-button')
const modal = document.querySelector('.modal')
const start = document.querySelector('.Start')
const playerswitch = document.querySelector('.switch')
const gameArea = document.querySelector('.game-area')
const loader = document.querySelector('.loading')
const resetButton = document.querySelector('.reset')
const homeButton = document.querySelector('.home')
const confirmation = document.querySelector('.confirmation')
const quit = document.querySelector(".Quit")
const Continue = document.querySelector(".Continue")
const opponentCheckbox = document.getElementById("opponent")
const msg = document.querySelector('.won')
const logo = document.querySelector('.logo')
const newRound = document.querySelector('.NewRound')
const summary = document.querySelector('.main__summary-section')
const playerX = document.querySelector('.playerX')
const playerO = document.querySelector('.playerO')
const Tie = document.querySelector('.Tie')

let size = 3;
let difficulty = 1;
let playerSign = 1; // 1 => 'X' and -1 => 'O' 
let botOrFriend = 0; //0 => Friend and 1 => Bot
let count = 0;
let board = [[" "," "," "],[" "," "," "],[" "," "," "]]
let XorO = false
let playerXScore = 0
let playerOScore = 0
let TieBreaks = 0


playerswitch.addEventListener('change', () => {
    if (playerswitch.checked) {
        count = 1;
    } else {
        playerSign = -1;
        count = 0;
    }
})

opponentCheckbox.addEventListener('change', () => {
    if (opponentCheckbox.checked === true) {
        // document.querySelector('.difficulty').classList.remove('deactive')
        botOrFriend = 1;
    }
    else {
        // document.querySelector('.difficulty').classList.add('deactive')
        botOrFriend = 0;
    }
})

sizeButton.forEach((button) => {
    button.addEventListener("click", function () {
        if (button.classList.contains('active')) {
            button.classList.remove('active')
        }
        else {
            sizeButton.forEach((but) => {
                but.classList = "size-button";
            })
            button.classList.add('active')
        }
    })
})

difficultyButton.forEach((button) => {
    button.addEventListener("click", function () {
        if (button.classList.contains('active')) {
            button.classList.remove('active')
        }
        else {
            difficultyButton.forEach((but) => {
                but.classList = "difficulty-button";
            })
            button.classList.add('active')
        }
    })
})

start.addEventListener('click', () => {
    size = document.querySelector('.size-button.active') ? document.querySelector('.size-button.active').value : 3;
    difficulty = document.querySelector('.difficulty-button.active') ? document.querySelector('.difficulty-button.active').value : 3;
    playerSign = playerswitch.checked ? 0 : 1;


    modal.classList.add('deactive')
    loader.classList = "loading";
    setTimeout(function () {
        loader.classList = "loadig deactive"
        GenerateGameArea(size)

        if (botOrFriend == 0)
            PlayerVsPlayer()
        else
            BotVsPlayer()

        resetButton.classList.remove('deactive')
        homeButton.classList.remove('deactive')
        summary.classList.remove('deactive')
    }, 2000)
})

let cells;
function GenerateGameArea(size) {
    var innerString = "";
    gameArea.style.height = "31.25rem";

    var SizeAddon = size == 3 ? "small" : size == 5 ? "medium" : "large";
    gameArea.classList.add(SizeAddon)
    gameArea.innerHTML = "";
    for (var i = 0; i < size * size; i++) {
        innerString += `<div class = "cell" data-value = " " data-x="${Math.floor(i / size)}" data-y="${i % size}" ></div>`;
    }
    gameArea.innerHTML = innerString;

    if (size == 3) document.documentElement.style.setProperty("--pos", "30%")
    else if (size == 5) document.documentElement.style.setProperty("--pos", "35%")
    else document.documentElement.style.setProperty("--pos", "40%")

    cells = document.querySelectorAll('.cell')

    cells.forEach((cell) => {
        cell.addEventListener('mouseover', () => {
            if (!cell.firstChild) {
                if (count % 2 == 0) {
                    cell.classList.add("Xhover")
                } else {
                    cell.classList.add("Ohover")
                }
            }
        })
        cell.addEventListener('mouseout', () => {
            if (!cell.firstChild) {
                if (count % 2 == 0) {
                    cell.classList.remove("Xhover")
                } else {
                    cell.classList.remove("Ohover")
                }
            }
        })
    })
}

function PlayerVsPlayer() {

    cells.forEach((cell) => {
        cell.addEventListener('click', () => {
            if (!cell.firstChild) {
                if (count % 2 == 0) {
                    cell.innerHTML = `<img src="./assets/icon-x.svg" alt="X" >`;
                    cell.setAttribute('data-value', "X")
                    count++;
                } else {
                    cell.innerHTML = `<img src="./assets/icon-o.svg" alt="O" >`;
                    cell.setAttribute('data-value', "O")
                    count++;
                }
                if (verify(size) !== true && (playerSign === 1 && count >= size * size || playerSign === 0 && count >= size * size + 1)) {
                    draw()
                }
            }
            if (cell.firstChild) {
                if (count % 2 == 1) {
                    cell.classList.remove('Xhover')
                } else {
                    cell.classList.remove('Ohover')
                }
            }
        })
    })
}

function BotVsPlayer() {

    if (playerSign == 1) {
        XorO = true
        count = 0
    } else {
        // Mark X and make Bot to support X
        count = 0
        MakeBotMove(true)
    }

    cells.forEach((cell) => {
        cell.addEventListener('click', () => {
            if (!cell.firstChild) {
                if (XorO) {
                    cell.innerHTML = `<img src="./assets/icon-x.svg" alt="X" >`;
                    cell.setAttribute('data-value', "X")
                    board[cell.getAttribute('data-x')][cell.getAttribute('data-y')] = cell.getAttribute('data-value')
                    count++;
                    MakeBotMove(false)
                } else {
                    cell.innerHTML = `<img src="./assets/icon-o.svg" alt="O" >`;
                    cell.setAttribute('data-value', "O")
                    board[cell.getAttribute('data-x')][cell.getAttribute('data-y')] = cell.getAttribute('data-value')
                    count++;
                    MakeBotMove(true)
                }
                if (verify(size) !== true && count >= size * size) {
                    draw()
                }
            }
            if (cell.firstChild) {
                if (XorO)
                    cell.classList.remove('Xhover')
                else
                    cell.classList.remove('Ohover')
            }
        })
    })
}

const MakeBotMove = (XorO) => {
    if (XorO) { // X
        let move = getBestMove(board, 0, false)
        console.log(move)
        cells.forEach((cell) => {
            if (!cell.firstChild) {
                if (cell.getAttribute('data-x') == move[0] && cell.getAttribute('data-y') == move[1]) {
                    cell.innerHTML = `<img src="./assets/icon-x.svg" alt="X" >`
                    cell.setAttribute('data-value', "X")
                    board[cell.getAttribute('data-x')][cell.getAttribute('data-y')] = cell.getAttribute('data-value')
                    count++
                }
            }
        })
    } else { // O
        let move = getBestMove(board, 0, true)
        console.log(move)
        cells.forEach((cell) => {
            if (!cell.firstChild) {
                if (cell.getAttribute('data-x') == move[0] && cell.getAttribute('data-y') == move[1]) {
                    cell.innerHTML = `<img src="./assets/icon-o.svg" alt="O" >`
                    cell.setAttribute('data-value', "O")
                    board[cell.getAttribute('data-x')][cell.getAttribute('data-y')] = cell.getAttribute('data-value')
                    count++
                }
            }
        })
    }
}

resetButton.addEventListener('click', () => {
    reset()
})

const reset = () => {
    cells.forEach((cell) => {
        cell.innerHTML = '';
        cell.classList = "cell";
        cell.setAttribute('data-value', " ")
    })
    board = [[" "," "," "],[" "," "," "],[" "," "," "]]
    if (botOrFriend == 0) {
        if (playerSign == 1) {
            count = 0
        } else {
            count = 1
        }
        PlayerVsPlayer()
    }
    else {
        if (playerSign == 1) {
            count = 0
            XorO = true
        } else {
            count = 1
        }
        BotVsPlayer()
    }
}

logo.addEventListener('click', () => {
    if (!gameArea.firstChild) {
        location.reload()
        return;
    }
    
    confirmation.classList.remove('deactive')
    Continue.classList.remove('deactive')
    document.querySelector('.Congrats').classList.add('deactive')
    document.querySelector('.won').classList.add('deactive')
    document.querySelector(".NewRound").classList.add('deactive')
})

homeButton.addEventListener('click', () => {
    if (!gameArea.firstChild) {
        location.reload()
        return;
    }

    confirmation.classList.remove('deactive')
    Continue.classList.remove('deactive')
    document.querySelector('.Congrats').classList.add('deactive')
    document.querySelector('.won').classList.add('deactive')
    document.querySelector(".NewRound").classList.add('deactive')
})

quit.addEventListener('click', () => {
    confirmation.classList.add('deactive')
    document.querySelector('.Congrats').classList.remove('deactive')
    document.querySelector('.won').classList.remove('deactive')
    document.querySelector(".NewRound").classList.add('deactive')
    location.reload()
})

Continue.addEventListener('click', () => {
    confirmation.classList.add('deactive')
    document.querySelector('.Congrats').classList.remove('deactive')
    document.querySelector('.won').classList.remove('deactive')
    document.querySelector(".NewRound").classList.remove('deactive')
})

newRound.addEventListener('click', () => {
    reset()
    confirmation.classList.add('deactive')
})

function verify() {
    cells.forEach(cell => {
        board[cell.getAttribute('data-x')][cell.getAttribute('data-y')] = cell.getAttribute('data-value')
    })

    for (var i = 0; i < size; i++) {
        if (board[i][0] !== " ") {
            var temp = board[i][0];
            for (var j = 1; j < size; j++) {
                if (board[i][j] !== temp)
                    break;
                if (j === size - 1) {
                    cells.forEach((cell) => {
                        if (cell.getAttribute('data-x') == i && cell.getAttribute('data-y') == 0)
                            cell.classList.add('horizantal')
                    })
                    won(temp)
                    return true;
                }
            }
        }
    }
    for (var i = 0; i < size; i++) {
        if (board[0][i] !== " ") {
            var temp = board[0][i];
            for (var j = 1; j < size; j++) {
                if (board[j][i] !== temp)
                    break;
                if (j === size - 1) {
                    cells.forEach((cell) => {
                        if (cell.getAttribute('data-x') == 0 && cell.getAttribute('data-y') == i)
                            cell.classList.add('vertical')
                    })
                    won(temp)
                    return true;
                }
            }
        }
    }
    if (board[0][0] !== " ") {
        var temp = board[0][0];
        for (var i = 1; i < size; i++) {
            if (i === size - 1 && board[i][i] === temp) {
                cells.forEach((cell) => {
                    if (cell.getAttribute('data-x') == 0 && cell.getAttribute('data-y') == 0)
                        cell.classList.add('diagonal')
                })
                won(temp)
                return true;
            }
            else if (board[i][i] !== temp)
                break;
        }
    }

    if (board[size - 1][0] !== " ") {
        var temp = board[size - 1][0];
        for (var i = 1; i < size; i++) {
            if (i === size - 1 && board[size - i - 1][i] === temp) {
                cells.forEach((cell) => {
                    if (cell.getAttribute('data-x') == 0 && cell.getAttribute('data-y') == size - 1)
                        cell.classList.add('diagonalOpposite')
                })
                won(temp)
                return true;
            }
            else if (board[size - i - 1][i] !== temp)
                break;
        }
    }

    return false;
}

const won = (temp) => {
    setTimeout(function () {
        document.querySelector('.Congrats').classList.remove('deactive')
        msg.style.gridTemplateColumns = '0.15fr 1fr';
        confirmation.classList.remove('deactive')
        Continue.classList.add('deactive')

    }, 750)
    msg.innerHTML = `
                <img src="./assets/icon-${temp}.svg" alt=${temp} width="50px">
                <h1 class="WonMessage">Takes the Round</h1>
                `;
    if (temp === "X"){
        document.querySelector('.WonMessage').style.color = "#31c3bd";
        playerX.innerHTML = ++playerXScore
    }
    else{
        document.querySelector('.WonMessage').style.color = "#f2b137";
        playerO.innerHTML = ++playerOScore
    }
}

const draw = () => {
    setTimeout(function () {
        msg.innerHTML = `
        <h1 class="WonMessage">It's a tie!</h1>
        `;
        msg.style.gridTemplateColumns = '1fr';
        msg.style.color = "var(--grey)";
        confirmation.classList.remove('deactive')
        Continue.classList.add('deactive')
        document.querySelector('.Congrats').classList.add('deactive')
        Tie.innerHTML = ++TieBreaks
    }, 750)
}

// Bot by MinMax

var bot, player;

if (playerSign == 1) {
    player = 'X'
    bot = 'O'
} else {
    player = 'O'
    bot = 'X'
}


function getBestMove(board, depth, isMax) {
    var bestMove = [0, 0];
    if (isMax) {
        var bestScore = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = bot;
                    var score = minmax(board, depth + 1, false)
                    board[i][j] = " ";
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = [i, j];
                    }
                }
            }
        }
    } else {
        var bestScore = Number.POSITIVE_INFINITY;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = player;
                    var score = minmax(board, depth + 1, true)
                    board[i][j] = " ";
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = [i, j];
                    }
                }
            }
        }
    }
    return bestMove;
}

function minmax(board, depth, isMax) {
    var result = checkWinner(board)
    if (result == player) {
        return -10;
    } else if (result == bot) {
        return 10;
    } else if (result == "Tie") {
        return 0;
    }

    // if(depth == difficulty)
    //     return bestScore

    if (isMax) {
        var bestScore = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = bot;
                    var score = minmax(board, depth + 1, false)
                    board[i][j] = " ";
                    bestScore = Math.max(score, bestScore)
                }
            }
        }
    } else {
        var bestScore = Number.POSITIVE_INFINITY;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = player;
                    var score = minmax(board, depth + 1, true)
                    board[i][j] = " ";
                    bestScore = Math.min(score, bestScore)
                }
            }
        }
    }
    return bestScore;
}

function checkWinner(board) {
    var size = board.length;

    // Check rows
    for (var i = 0; i < size; i++) {
        if (board[i][0] !== " " && board[i].every(cell => cell === board[i][0])) {
            return board[i][0];
        }
    }

    // Check columns
    for (var j = 0; j < size; j++) {
        var column = [];
        for (var i = 0; i < size; i++) {
            column.push(board[i][j])
        }
        if (column[0] !== " " && column.every(cell => cell === column[0])) {
            return column[0];
        }
    }

    // Check diagonals
    var diagonal1 = [];
    var diagonal2 = [];
    for (var i = 0; i < size; i++) {
        diagonal1.push(board[i][i])
        diagonal2.push(board[i][size - 1 - i])
    }
    if (diagonal1[0] !== " " && diagonal1.every(cell => cell === diagonal1[0])) {
        return diagonal1[0];
    }
    if (diagonal2[0] !== " " && diagonal2.every(cell => cell === diagonal2[0])) {
        return diagonal2[0];
    }

    var isTie = true;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] === " ") {
                isTie = false;
                break;
            }
        }
        if (!isTie) {
            break;
        }
    }
    if (isTie) {
        return "Tie";
    }

    return null;
}