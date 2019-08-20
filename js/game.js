let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const SQUARE_WIDTH = 4;
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 80;

const WIDTH = 800;
const HEIGHT = 640;


class Board
{
    constructor(i,j)
    {
        this.x = BOARD_WIDTH * j;
        this.y = BOARD_WIDTH * i;
        this.snake = new Snake(this.x, this.y);
        this.score = new Score(this.x, this.y);
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
    }

    reset()
    {
        this.family.nextGeneration();
        this.finished = false;
    }

    loop()
    {
        if(!this.finished)
        {
            this.background.draw();
            this.finished = true;
            this.boards.forEach(e=>
            {
                e.draw();
                if(!e.gameOver)
                {
                    this.finished = false;
                }
            });

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
        }
        else
        {
            this.reset();
        }
    }
}

let game = new Game();
let view = new View();


function loop()
{

    view.loop();
}

let interval = window.setInterval(loop,100);
