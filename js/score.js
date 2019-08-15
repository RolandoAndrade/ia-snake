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
    constructor()
    {
        this.score = 0;
    }

    draw()
    {
        ctx.textAlign = "center";
        ctx.font ='250px Arial, sans-serif';
        ctx.fillStyle="#A3A3A3";
        ctx.fillText(""+this.score,200,270);
        ctx.font ='15px Arial, sans-serif';
        ctx.fillText("Rolando Andrade",200,320);
    }

    add()
    {
        this.score++;
    }
}