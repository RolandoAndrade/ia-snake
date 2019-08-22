class Food extends Rectangle
{
    constructor(snake, x, y)
    {
        super(0, 0, SQUARE_WIDTH, SQUARE_WIDTH, "#ff406e");
        this.lx = x;
        this.ly = y;
        this.x = x + 60;
        this.y = y + 60;
        //this.generate(snake);
    }

    generate(snaky)
    {
        let snake = snaky.snake;
        while (true)
        {
            this.x = this.lx + (Math.floor(Math.floor(Math.random() * BOARD_WIDTH) / SQUARE_WIDTH)) * SQUARE_WIDTH;
            this.y = this.ly + (Math.floor(Math.floor(Math.random() * BOARD_WIDTH) / SQUARE_WIDTH)) * SQUARE_WIDTH;
            let b = false;
            for (let i = 0; i < snake.length && !b; i++)
            {
                b = snake[i].collision(this);
            }
            if (!b)
            {
                break;
            }
        }
    }

    got(snake)
    {
        if (snake.snake[0].collision(this))
        {
            snake.growUp();
            this.generate(snake);
            return true;
        }
        return false;
    }
}

class Score
{
    constructor(x,y, number = 0)
    {
        this.score = 0;
        this.x = x+BOARD_WIDTH/2;
        this.y = y+BOARD_WIDTH/2+15;
        this.number = number;
    }

    draw()
    {
        ctx.textAlign = "center";
        ctx.font ='30px Arial, sans-serif';
        ctx.fillStyle="#A3A3A3";
        ctx.fillText(""+this.score,this.x,this.y);
        ctx.font ='8px Arial, sans-serif';
        ctx.fillText("Rolando Andrade",this.x,this.y+15);
        ctx.font ='7px Arial, sans-serif';
        ctx.fillText(this.number+"",this.x,this.y-30);
        ctx.font ='10px Arial, sans-serif';
        ctx.fillText(NAMES[this.number],this.x,this.y-40);
    }

    add()
    {
        this.score++;
    }
}