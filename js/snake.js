class Body extends Rectangle
{
    constructor(x, y, vx, vy)
    {
        super(x, y, SQUARE_WIDTH, SQUARE_WIDTH, "#71ebff");
        this.vx = vx;
        this.vy = vy;
        this.lastX = x;
        this.lastY = y;
        this.lastVX = this.vx;
        this.lastVY = this.vy;
    }

    move()
    {
        this.lastX = this.x;
        this.lastY = this.y;
        super.move(this.x + this.vx, this.y + this.vy);
    }

    draw()
    {

        super.draw();
    }

    forward(before)
    {
        this.lastX = this.x;
        this.lastY = this.y;
        this.lastVX = this.vx;
        this.lastVY = this.vy;
        this.x = before.lastX;
        this.y = before.lastY;
        this.vx = before.lastVX;
        this.vy = before.lastVY;
    }

    up()
    {
        if (this.vy === 0)
        {
            this.vx = 0;
            this.vy = -SQUARE_WIDTH;
            this.lastVX = this.vx;
            this.lastVY = this.vy;
        }
    }

    down()
    {
        if (this.vy === 0)
        {
            this.vx = 0;
            this.vy = SQUARE_WIDTH;
            this.lastVX = this.vx;
            this.lastVY = this.vy;
        }
    }

    left()
    {
        if (this.vx === 0)
        {
            this.vy = 0;
            this.vx = -SQUARE_WIDTH;
            this.lastVX = this.vx;
            this.lastVY = this.vy;
        }
    }

    right()
    {
        if (this.vx === 0)
        {
            this.vy = 0;
            this.vx = SQUARE_WIDTH;
            this.lastVX = this.vx;
            this.lastVY = this.vy;
        }
    }

    collision(body)
    {
        return this.x === body.x && this.y === body.y;
    }
}

class Snake
{
    constructor()
    {
        this.snake = [];
        this.alive = true;
        for (let i = 0; i < 4; i++)
        {
            this.snake.push(new Body(100 - 20 * i, 100, SQUARE_WIDTH, 0));
        }
        let head = this.snake[0];
        document.addEventListener("keydown", function (e)
        {
            switch (e.keyCode)
            {
                case 37:
                    head.left();
                    break;
                case 38:
                    head.up();
                    break;
                case 39:
                    head.right();
                    break;
                case 40:
                    head.down();
            }
        })
    }

    draw()
    {
        this.snake[0].move();
        for (let i = 0; i < this.snake.length; i++)
        {
            this.snake[i].draw();
            try
            {
                this.snake[i + 1].forward(this.snake[i]);
                this.checkCollision(this.snake[i + 1]);
            } catch (e)
            {

            }
        }
        this.outside();
    }

    outside()
    {
        let head = this.snake[0];
        if (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT)
        {
            this.kill();
        }
    }

    kill()
    {
        this.alive = false;
    }

    checkCollision(body)
    {
        if (this.snake[0].collision(body))
        {
            this.kill();
        }
    }

    growUp()
    {
        let last = this.snake[this.snake.length - 1];
        this.snake.push(new Body(last.x - last.vx, last.y - last.vy, last.vx, last.vy))
    }
}