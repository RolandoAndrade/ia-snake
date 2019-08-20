const TOPOLOGY = [18,12,9,4];

/*
* Descripción del cerebro
*
* Capa de entrada:
*
* 1. La fruta esta arriba
* 2. La fruta esta abajo
* 3. La fruta esta a la izquierda
* 4. La fruta esta a la derecha
* 5. La fruta esta diagonalmente hacia arriba a la izquierda
* 6. La fruta esta diagonalmente hacia arriba a la derecha
* 7. La fruta esta diagonalmente hacia abajo a la izquierda
* 8. La fruta esta diagonalmente hacia abajo a la derecha
* 9. Despejado arriba
* 10. Despejado abajo
* 11. Despejado a la izquierda
* 12. Despejado a la derecha
* 13. Despejado diagonalmente hacia arriba a la izquierda
* 14. Despejado diagonalmente hacia arriba a la derecha
* 15. Despejado diagonalmente hacia abajo a la izquierda
* 16. Despejado diagonalmente hacia abajo a la derecha
* 17. Va hacia el x de la fruta
* 18. Va hacia el y de la fruta
* */

class Body extends Rectangle
{
    constructor(x, y, vx, vy, color)
    {
        super(x, y, SQUARE_WIDTH, SQUARE_WIDTH, color);
        this.vx = vx;
        this.vy = vy;
        this.lastX = x;
        this.lastY = y;
        this.lastVX = this.vx;
        this.lastVY = this.vy;
        this.valoration = 0;
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
        this.valoration+=3;
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
            this.valoration++;
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
            this.valoration++;
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
            this.valoration++;
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
            this.valoration++;
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
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.reset();
        this.brain = new NeuronalNetwork(TOPOLOGY,new Sigmoid());

    }

    reset(color = "#71ebff")
    {
        this.snake = [];
        this.alive = true;
        for (let i = 0; i < 6; i++)
        {
            this.snake.push(new Body(this.x + 32 - SQUARE_WIDTH * i, this.y + 40, SQUARE_WIDTH, 0, color));
        }
        this.q1=1;
        this.q2=2;
        this.q3=3;
    }

    draw(draw = true)
    {
        this.snake[0].move();
        for (let i = 0; i < this.snake.length; i++)
        {
            if(draw) this.snake[i].draw();
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
        if (head.x < this.x || head.x >= this.x+BOARD_WIDTH || head.y < this.y || head.y >= this.y+BOARD_HEIGHT)
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
        this.snake.push(new Body(last.x - last.vx, last.y - last.vy, last.vx, last.vy));
        let size = this.snake.length;
        this.q1=Math.trunc(size/4);
        this.q2=Math.trunc(size/2);
        this.q3=Math.trunc(3*size/4);
        this.snake[0].valoration+=1000;
    }

    getValoration()
    {
        return this.snake[0].valoration;
    }



    think(food)
    {
        let head = this.snake[0];
        let x = head.x % BOARD_WIDTH;
        let y = head.y % BOARD_WIDTH;
        let fx = food.x % BOARD_WIDTH;
        let fy = food.y % BOARD_WIDTH;

        let isFoodOver = fy <= y && x=== fx;
        let isFoodUnder = fy >= y && x === fx;
        let isFoodAtLeft = fx <= x && y=== fy;
        let isFoodAtRight = fx >= x && y === fy;

        let isFoodUpLeft = fx < x && fy < y && Math.abs(fx-fy)===Math.abs(x-y);
        let isFoodUpRight = fx > x && fy < y && Math.abs(fx-fy)===Math.abs(x-y);
        let isFoodDownLeft = fx < x && fy > y && Math.abs(fx-fy)===Math.abs(x-y);
        let isFoodDownRight = fx > x && fy > y&& Math.abs(fx-fy)===Math.abs(x-y);


        let isClearUp = 1;
        let isClearDown = 1;
        let isClearLeft = 1;
        let isClearRight = 1;

        let isClearUpLeft = 1;
        let isClearUpRight = 1;
        let isClearDownLeft = 1;
        let isClearDownRight = 1;

        let toTheXFood = 0;
        let toTheYFood = 0;

        this.snake.forEach(e=>
        {
            if(e!==head)
            {
                let dx = e.x % BOARD_WIDTH, dy = e.y % BOARD_WIDTH;
                if(dx === x)
                {
                    if(dy<y)
                    {
                        isClearUp = 0;
                    }
                    else
                    {
                        isClearDown = 0;
                    }
                }

                if(dy === y)
                {
                    if(dx<x)
                    {
                        isClearLeft = 0;
                    }
                    else
                    {
                        isClearRight = 0;
                    }
                }

                if(Math.abs(dx-dy)===Math.abs(x-y))
                {
                    if(dy<y&&dx<x)
                    {
                        isClearUpLeft = 0;
                    }
                    else if(dy<y&&dx>x)
                    {
                        isClearUpRight = 0;
                    }
                    else if(dy>y&&dx<x)
                    {
                        isClearDownLeft = 0;
                    }
                    else
                    {
                        isClearDownRight = 0;
                    }
                }
            }
        });

        if(head.vx>0&&x<fx||head.vx<0&&fx<x)
        {
            toTheXFood = 1;
        }
        else if(head.vx<0&&x<fx||head.vx>0&&fx<x)
        {
            toTheXFood = -1;
        }

        if(head.vy>0&&y<fy||head.vy<0&&fy<y)
        {
            toTheYFood = 1;
        }
        else if(head.vy<0&&y<fy||head.vy>0&&fy<y)
        {
            toTheYFood = -1;
        }

        let out = this.brain.getOutput([
            [
                isFoodOver, isFoodUnder, isFoodAtLeft, isFoodAtRight,
                isFoodUpLeft, isFoodUpRight, isFoodDownLeft, isFoodDownRight,
                isClearUp, isClearDown, isClearLeft, isClearRight,
                isClearUpLeft, isClearUpRight, isClearDownLeft, isClearDownRight,
                toTheXFood, toTheYFood
            ]
        ]);
        if (out[0][0] >= out[1][0] && out[0][0] >= out[2][0] && out[0][0] >= out[3][0])
        {
            head.left();
        } else if (out[1][0] >= out[0][0] && out[1][0] >= out[2][0] && out[1][0] >= out[3][0])
        {
            head.right();
        } else if (out[2][0] >= out[0][0] && out[2][0] >= out[1][0] && out[2][0] >= out[3][0])
        {
            head.up();
        } else
        {
            head.down();
        }
    }
}