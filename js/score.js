class Food extends Rectangle
{
    constructor(snake)
    {
        super(0, 0, SQUARE_WIDTH, SQUARE_WIDTH, "#ff406e");
        this.x = 160;
        this.y = 200;
    }

    generate(snaky)
    {
        let snake = snaky.snake;
        while (true)
        {
            this.x = (Math.floor(Math.floor(Math.random() * 400) / 20)) * 20;
            this.y = (Math.floor(Math.floor(Math.random() * 400) / 20)) * 20;
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
    constructor(i,j)
    {
        this.score = 0;
        this.x = BOARD_WIDTH*j+BOARD_WIDTH/2;
        this.y = BOARD_WIDTH*i+BOARD_WIDTH/2+15;
    }

    draw()
    {
        ctx.textAlign = "center";
        ctx.font ='30px Arial, sans-serif';
        ctx.fillStyle="#A3A3A3";
        ctx.fillText(""+this.score,this.x,this.y);
        ctx.font ='8px Arial, sans-serif';
        ctx.fillText("Rolando Andrade",this.x,this.y+15);
    }

    add()
    {
        this.score++;
    }
}