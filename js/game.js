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
        console.log("fin");
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
                        console.log(i,this.snakes[i])
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


let game = new Game();

function loop()
{

    game.loop();
}

let interval = window.setInterval(loop,1);
