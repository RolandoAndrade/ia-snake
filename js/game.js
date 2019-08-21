let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const SQUARE_WIDTH = 4;
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 80;

const WIDTH = 800;
const HEIGHT = 640;

let numberBoard = 0;

class Board
{
    constructor(i,j)
    {
        this.x = BOARD_WIDTH * j;
        this.y = BOARD_WIDTH * i;
        this.snake = new Snake(this.x, this.y);
        this.score = new Score(this.x, this.y, numberBoard++);
        this.food = new Food(this.snake, this.x, this.y);
        this.gameOver = false;
    }

    draw()
    {
        this.score.draw();
        if(this.snake.alive)
        {
            this.snake.think(this.food);
            this.snake.draw();
            if(this.food.got(this.snake))
            {
                this.score.add();
            }
        }
        else
        {
            this.gameOver = true;
        }
        this.food.draw();
    }

    reset()
    {
        this.score.score = 0;
        this.gameOver = false;
        this.food = new Food(this.snake, this.x, this.y);
    }
}

class View
{
    constructor()
    {
        this.background = new Rectangle(0, 0, 800, 640, "#424242");
        this.background.draw();
        this.boards = [];
        for (let i = 0; i < 10; i++)
        {
            for (let j = 0; j < 8; j++)
            {
                this.boards.push(new Board(j, i));
            }
        }

        this.family = new Generation(this.boards);
        this.finished = false;
        this.paused = false;
        let a = this;
        document.addEventListener("keydown", ()=>a.paused=!a.paused)
    }

    reset()
    {
        this.family.nextGeneration();
        this.finished = false;
        this.boards.forEach(e=>e.reset());
    }

    loop()
    {
        if(!this.paused)
        {
            if(!this.finished)
            {
                this.background.draw();
                for (let i = 0; i < 11; i++)
                {
                    ctx.strokeStyle = "#78dd88";
                    ctx.beginPath();
                    ctx.moveTo(0, BOARD_WIDTH * i);
                    ctx.lineTo(WIDTH, BOARD_WIDTH * i);
                    ctx.moveTo(BOARD_WIDTH * i, 0);
                    ctx.lineTo(BOARD_WIDTH * i, HEIGHT);
                    ctx.stroke();
                    ctx.closePath();
                }
                this.finished = true;
                this.boards.forEach(e=>
                {
                    e.draw();
                    if(!e.gameOver)
                    {
                        this.finished = false;
                    }
                });


            }
            else
            {
                this.reset();
            }
        }

    }
}

let view = new View();


function loop()
{

    view.loop();
}

let interval = window.setInterval(loop,50);
