let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const SQUARE_WIDTH = 20;
const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 400;


class Game
{
    constructor()
    {
        this.gameOver = true;
        this.background = new Rectangle(0,0,400,400, "#424242");
        this.background.draw();
        let game = this;
        document.addEventListener("keydown", function (e)
        {
            if((e.keyCode === 32 || e.keyCode === 13) && game.gameOver)
            {
                game.init();
            }
        })
    }

    init()
    {
        this.snake = new Snake();
        this.food = new Food(this.snake);
        this.score = new Score();
        this.gameOver = false;
    }

    loop()
    {
        if(!this.gameOver)
        {
            this.background.draw();
            this.score.draw();
            this.snake.draw();
            if(this.food.got())
            {
                this.score.add();
            }
            this.food.draw();
            this.gameOver = !this.snake.alive;
        }
        else
        {
            game.init();
        }
    }
}


let game = new Game();

function loop()
{
    game.loop();
}

let interval = window.setInterval(loop,100);
