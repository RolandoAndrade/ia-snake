let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const SQUARE_WIDTH = 4;
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 80;


class Game
{
    constructor()
    {
        this.gameOver = true;
        this.background = new Rectangle(0,0,800,600, "#424242");
        this.background.draw();
        this.init();
        let a = this;
        document.addEventListener("keydown", function (e)
        {
            a.reset();
        });
    }

    reset()
    {
        this.gameOver = true;
        this.family.nextGeneration();
        this.gameOver = false;
        this.drawed = 0;
        this.scores.forEach(e=>
        {
            e.score = 0;
        })
        this.food = [];
        for(let i = 0; i < POPULATION; i++)
        {
            this.food.push(new Food(this.snakes[i]));
        }
    }

    init()
    {
        this.snakes = [];
        this.food = [];
        this.scores = [];
        this.drawed = 0;

        this.family = new Generation(this.snakes);


        for(let i = 0; i < POPULATION; i++)
        {
            this.snakes.push(new Snake());
            this.food.push(new Food(this.snakes[i]));
            this.scores.push(new Score());
        }
        this.gameOver = false;
    }

    loop()
    {
        if(!this.gameOver)
        {
            this.background.draw();
            this.scores[this.drawed].draw();
            this.drawed = -1;
            this.snakes.forEach((e,i)=>
            {
                if(e.alive)
                {
                    e.think(this.food[i]);
                    e.draw(true);
                    this.drawed = i;
                }
            });
            if(this.drawed!==-1)
            {
                this.food.forEach((e,i)=>
                {
                    if(e.got(this.snakes[i]))
                    {
                        this.scores[i].add();
                    }
                    e.draw();
                });
                //this.food[this.drawed].draw();
            }
            else
            {
                this.gameOver = true;
            }


        }
        else
        {
            game.reset();
        }
    }
}
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
    }

    loop()
    {
        this.background.draw();

        this.boards.forEach(e=>e.draw());

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
}

let game = new Game();
let view = new View();


function loop()
{

    view.loop();
}

let interval = window.setInterval(loop,100);
