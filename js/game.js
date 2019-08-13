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
        this.init();
        let a = this;
        document.addEventListener("keydown", function (e)
        {
            a.reset();
        });
    }

    reset()
    {
        //next generation
        console.log("next");
    }

    init()
    {
        this.snakes = [];
        for(let i = 0; i < POPULATION; i++)
        {
            this.snakes.push(new Snake());
        }
        //this.snake = new Snake();
        this.food = new Food(this.snakes[0]);
        this.score = new Score();
        this.gameOver = false;
    }

    loop()
    {
        if(!this.gameOver)
        {
            this.background.draw();
            this.score.draw();
            this.snakes[0].think(this.food);
            this.snakes[0].draw();

            if(this.food.got(this.snakes[0]))
            {
                this.score.add();
            }
            this.food.draw();
            this.gameOver = !this.snakes[0].alive;
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
