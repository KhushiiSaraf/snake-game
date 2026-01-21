const board = document.querySelector(".board");
const start_box = document.querySelector(".start");
const start_btn = document.querySelector("#start-btn");
const restart_box = document.querySelector(".restart");
const restart_btn = document.querySelector("#restart-btn");
const highScoreElem = document.querySelector("#highScore");
const scoreElem = document.querySelector("#score");
const timeElem = document.querySelector("#timer");
let blocks = [];
const blockHieght = 32;
const blockWidth = 32;

let rows = Math.floor(board.clientHeight / blockHieght);
let cols = Math.floor(board.clientWidth / blockWidth);
//snake of 3 blocks initially.
let snake = [{ x: 1, y: 5 }];
let direction = "right";
let intervalID = null;
let timerIntervalId = null;

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
//fruit styling
let fruit = document.createElement("div");
fruit.classList.add("absolute", "top-[-3px]", "h-2", "w-[3px]", "bg-green-700", "left-[55%]", "rotate-[15deg]", "rounded-tl-full"); //stem

//Score and Time
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let time = `00:00`;

scoreElem.innerText = score;
highScoreElem.innerText = highScore;
time.innerText = time;

addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") {
        direction = "up";
    }
    else if (event.key == "ArrowDown") {
        direction = "down";
    }
    else if (event.key == "ArrowRight") {
        direction = "right";
    }
    else if (event.key == "ArrowLeft") {
        direction = "left";
    }
})

start_btn.addEventListener("click", () => {
    start_box.classList.add("hidden");
    intervalID = setInterval(() => { //keeping it inside a variable so that we can clear the interval ie restart in case of game over!
        render();
    }, 200);
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split(":").map(Number); //time is in 00-00 string form so we first split the time got ["00","00"] then converting this string in number form using map and then putting the values in min and sec
        if (sec == 59) {
            min += 1;
            sec = 0;
        }
        else {
            sec += 1;
        }
        if (sec < 10) {
            sec = `0${sec}`;
        }
        if (min < 10) {
            min = `0${min}`;
        }

        time = `${min}:${sec}`;
        timeElem.innerText = time;
    }, 1000)//runs every sec
})

function setUpBoard() {
    board.innerHTML = "";
    const blockHieght = 32;
    const blockWidth = 32;

    let rows = Math.floor(board.clientHeight / blockHieght);
    let cols = Math.floor(board.clientWidth / blockWidth);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement("div");
            block.classList.add("w-8", "h-8");
            board.appendChild(block);
            blocks[`${row}-${col}`] = block //Understand this!!!
        }
    }
}

//grid setup
window.onload = setUpBoard;
window.addEventListener("resize", setUpBoard);

function right(head, rows, cols) {
    head = { x: snake[0].x, y: snake[0].y + 1 }

    //Condition that checks if snake goes beyond the box towards left - Restart
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {

        //restart box will appear
        restart_box.classList.remove("hidden");
        //removing food and snake colored head 
        blocks[`${food.x}-${food.y}`].classList.remove("relative");
        blocks[`${head.x}-${head.y - 1}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");// y-1 cos snake y coord has become col+1 - beyond range
        clearInterval(intervalID);
        return;
    };
    blocks[`${head.x}-${head.y}`].classList.add("bg-green-700", "rounded-r-full");
    blocks[`${head.x}-${head.y - 1}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");
}

function render() {
    const blockHieght = 32;
    const blockWidth = 32;

    let rows = Math.floor(board.clientHeight / blockHieght);
    let cols = Math.floor(board.clientWidth / blockWidth);

    //head of the snake
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("bg-red-500", "rounded-full", "relative"); //food
    blocks[`${food.x}-${food.y}`].appendChild(fruit); //food

    if (direction == "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }

        //Condition that checks if snake goes beyond the box towards left - Restart
        if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols || blocks[`${head.x}-${head.y}`].classList.contains("bg-green-300")) {

            //restart box will appear
            restart_box.classList.remove("hidden");
            //removing food and snake colored head 
            blocks[`${food.x}-${food.y}`].classList.remove("relative");
            blocks[`${head.x}-${head.y + 1}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");// y+1 cos snake y coord has become -1
            clearInterval(intervalID);
            return;
        };
        //Giving green color to its head
        blocks[`${head.x}-${head.y}`].classList.add("bg-green-700", "rounded-l-full");
        //Removing green color from the previous head
        blocks[`${head.x}-${head.y + 1}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");



    }
    else if (direction == "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }

        //Condition that checks if snake goes beyond the box towards left - Restart
        if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols || blocks[`${head.x}-${head.y}`].classList.contains("bg-green-300")) {

            //restart box will appear
            restart_box.classList.remove("hidden");
            //removing food and snake colored head 
            blocks[`${food.x}-${food.y}`].classList.remove("relative");
            blocks[`${head.x}-${head.y - 1}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");// y-1 cos snake y coord has become col+1 - beyond range
            clearInterval(intervalID);
            return;
        };
        blocks[`${head.x}-${head.y}`].classList.add("bg-green-700", "rounded-r-full");
        blocks[`${head.x}-${head.y - 1}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");

    }
    else if (direction == "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }

        //Condition that checks if snake goes beyond the box towards left - Restart
        if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols || blocks[`${head.x}-${head.y}`].classList.contains("bg-green-300")) {

            //restart box will appear
            restart_box.classList.remove("hidden");
            //removing food and snake colored head 
            blocks[`${food.x}-${food.y}`].classList.remove("relative");
            blocks[`${head.x + 1}-${head.y}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");// x+1 cos snake x coord has become -1
            clearInterval(intervalID);
            return;
        };
        blocks[`${head.x}-${head.y}`].classList.add("bg-green-700", "rounded-t-full");
        blocks[`${head.x + 1}-${head.y}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");

    }
    else if (direction == "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
        //Condition that checks if snake goes beyond the box towards left - Restart
        if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols || blocks[`${head.x}-${head.y}`].classList.contains("bg-green-300")) {

            //restart box will appear
            restart_box.classList.remove("hidden");
            //removing food and snake colored head 
            blocks[`${food.x}-${food.y}`].classList.remove("relative");
            blocks[`${head.x - 1}-${head.y}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");// x-1 cos snake x coord has become rows+1 - beyond range
            clearInterval(intervalID);
            return;
        };
        blocks[`${head.x}-${head.y}`].classList.add("bg-green-700", "rounded-b-full");
        blocks[`${head.x - 1}-${head.y}`].classList.remove("bg-green-700", "rounded-l-full", "rounded-b-full", "rounded-t-full", "rounded-r-full");

    }



    //food consume
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("bg-red-500", "rounded-full", "relative"); //removing food
        blocks[`${food.x}-${food.y}`].removeChild(fruit); //removing food
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        blocks[`${food.x}-${food.y}`].classList.add("bg-red-500", "rounded-full", "relative"); //adding food
        blocks[`${food.x}-${food.y}`].appendChild(fruit); // adding food
        snake.unshift(head);
        score += 10;
        scoreElem.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
            highScoreElem.innerText = highScore;
        }
    }

    snake.forEach((block) => {
        blocks[`${block.x}-${block.y}`].classList.remove("bg-green-300"); //removes the green color as the snake moves
    })

    snake.unshift(head); // adds one element at the start
    snake.pop();

    snake.forEach((block) => {
        blocks[`${block.x}-${block.y}`].classList.add("bg-green-300");

    })

}

restart_btn.addEventListener("click", () => {

    restart_box.classList.add("hidden");
    snake.forEach((block) => {
        blocks[`${block.x}-${block.y}`].classList.remove("bg-green-300"); //removes the green color as the snake moves
    })
    blocks[`${food.x}-${food.y}`].classList.remove("bg-red-500", "rounded-full", "relative"); //removing food

    snake = [{ x: 1, y: 5 }];
    direction = "right";
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

    score = 0;
    scoreElem.innerText = score;
    time = `00:00`;
    timeElem.innerHTML = time;
    highScore = localStorage.getItem("highScore");

    intervalID = setInterval(() => { //keeping it inside a variable so that we can clear the interval ie restart in case of game over!
        render();
    }, 200);
});

