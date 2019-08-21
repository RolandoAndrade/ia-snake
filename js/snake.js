const TOPOLOGY = [22,18,10,3];
const FRAMES_TO_RESOLVE = 50;
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
* 19. Distancia a la pared izq
* 20. Distancia a la pared der
* 21. Distancia a la pared arriba
* 22. Distancia a la pared abajo
*
* SALIDAS
*
* 1. Izquierda
* 2. Sigue
* 3. Derecha
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
        this.valoration++;
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
        this.valoration++;
        this.vx = 0;
        this.vy = -SQUARE_WIDTH;
        this.lastVX = this.vx;
        this.lastVY = this.vy;
    }

    down()
    {
        this.valoration++;
        this.vx = 0;
        this.vy = SQUARE_WIDTH;
        this.lastVX = this.vx;
        this.lastVY = this.vy;
    }

    left()
    {
        this.valoration++;
        this.vy = 0;
        this.vx = -SQUARE_WIDTH;
        this.lastVX = this.vx;
        this.lastVY = this.vy;
    }

    right()
    {
        this.valoration++;
        this.vy = 0;
        this.vx = SQUARE_WIDTH;
        this.lastVX = this.vx;
        this.lastVY = this.vy;
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
        this.framesWithoutGrowl = FRAMES_TO_RESOLVE;
        this.color = color;
        this.snake = [];
        this.alive = true;
        for (let i = 0; i < 5; i++)
        {
            this.snake.push(new Body(this.x + 32 - SQUARE_WIDTH * i, this.y + 40, SQUARE_WIDTH, 0, color));
        }
    }

    draw(draw = true)
    {
        this.framesWithoutGrowl--;
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
        if(this.framesWithoutGrowl===0)
        {
            this.kill();
            this.snake[0].valoration-=FRAMES_TO_RESOLVE*2;
        }
    }

    outside()
    {
        let head = this.snake[0];
        if (head.x < this.x || head.x >= this.x+BOARD_WIDTH || head.y < this.y || head.y >= this.y+BOARD_HEIGHT)
        {
            this.kill();
            //this.snake[0].valoration-=10;
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
            //this.snake[0].valoration-=10;
        }
    }

    growUp()
    {
        let last = this.snake[this.snake.length - 1];
        this.snake.push(new Body(last.x - last.vx, last.y - last.vy, last.vx, last.vy, this.color));
        this.snake[0].valoration+=1000;
        this.framesWithoutGrowl = FRAMES_TO_RESOLVE;
    }

    getValoration()
    {
        return this.snake[0].valoration;
    }

    move(mov)
    {
        let head = this.snake[0];
        new Circle(this.x+BOARD_WIDTH-2,this.y+35+4*mov,1,"#ff55a2").draw();
        //fun();
        switch (mov)
        {
            case 0:
                if(head.vx>0)
                    head.up();
                else if(head.vx<0)
                    head.down();
                else if(head.vy>0)
                    head.right();
                else if(head.vy<0)
                    head.left();
                break;
            case 2:
                if(head.vx>0)
                    head.down();
                else if(head.vx<0)
                    head.up();
                else if(head.vy>0)
                    head.left();
                else if(head.vy<0)
                    head.right();
                break;
        }

    }

    showResults(input, out)
    {
        let head = this.snake[0];
        out.forEach((e,i)=>
        {
            new Circle(this.x+BOARD_WIDTH-2,this.y+35+4*i,1,"#b6b3a8").draw();
        });

        if (out[0][0] >= out[1][0] && out[0][0] >= out[2][0] /*&& out[0][0]>= out[3][0]*/)
        {
            this.move(0);
        } else if (out[1][0] >= out[0][0] && out[1][0] >= out[2][0] /*&& out[1][0]>= out[3][0]*/)
        {
            this.move(1);
        } else if (out[2][0] >= out[0][0] && out[2][0] >= out[1][0]/*&& out[2][0]>=out[3][0]*/)
        {
            this.move(2);
        }
        else
        {
            this.move(3,()=>head.down())
        }

        input.forEach((e,i)=>
        {
            if(i<18)
            {
                new Circle(this.x+2,this.y+5+4*i,1,e?"#ff55a2":"#b6b3a8").draw();
            }

        })
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

        let isFoodUpLeft = fx < x && fy < y && Math.abs(fx-x)===Math.abs(fy-y);
        let isFoodUpRight = fx > x && fy < y && Math.abs(fx-x)===Math.abs(fy-y);
        let isFoodDownLeft = fx < x && fy > y && Math.abs(fx-x)===Math.abs(fy-y);
        let isFoodDownRight = fx > x && fy > y&& Math.abs(fx-x)===Math.abs(fy-y);


        let isClearUp = 0;
        let isClearDown = 0;
        let isClearLeft = 0;
        let isClearRight = 0;

        let isClearUpLeft = 0;
        let isClearUpRight = 0;
        let isClearDownLeft = 0;
        let isClearDownRight = 0;

        let toTheXFood = 0;
        let toTheYFood = 0;

        let leftDistance = (head.x - this.x)/BOARD_WIDTH;
        let rightDistance = (this.x+BOARD_WIDTH-head.x)/BOARD_WIDTH;
        let upDistance = (head.y - this.y)/BOARD_WIDTH;
        let downDistance = (this.y+BOARD_WIDTH-head.y)/BOARD_WIDTH;


        this.snake.forEach(e=>
        {

            if(e!==head)
            {
                let dx = e.x % BOARD_WIDTH, dy = e.y % BOARD_WIDTH;
                if(dx === x)
                {
                    if(dy<y)
                    {
                        isClearUp = 1;
                    }
                    else
                    {
                        isClearDown = 1;
                    }
                }

                if(dy === y)
                {
                    if(dx<x)
                    {
                        isClearLeft = 1;
                    }
                    else
                    {
                        isClearRight = 1;
                    }
                }

                if(Math.abs(dx-x)===Math.abs(dy-y))
                {

                    if(dy<y&&dx<x)
                    {
                        isClearUpLeft = 1;
                    }
                    else if(dy<y&&dx>x)
                    {
                        isClearUpRight = 1;
                    }
                    else if(dy>y&&dx<x)
                    {
                        isClearDownLeft = 1;
                    }
                    else if(dy>y&&dx>x)
                    {
                        isClearDownRight = 1;
                    }
                }
            }
        });

        if(head.vx>0&&x<fx||head.vx<0&&fx<x)
        {
            toTheXFood = 1;
            //head.valoration+=5;
        }
        else if(head.vx<0&&x<fx||head.vx>0&&fx<x)
        {
            toTheXFood = -1;
            //head.valoration--;
        }

        if(head.vy>0&&y<fy||head.vy<0&&fy<y)
        {
            toTheYFood = 1;
            //head.valoration+=5;
        }
        else if(head.vy<0&&y<fy||head.vy>0&&fy<y)
        {
            toTheYFood = -1;
            //head.valoration--;
        }


        let input = [
            isFoodOver, isFoodUnder, isFoodAtLeft, isFoodAtRight,
            isFoodUpLeft, isFoodUpRight, isFoodDownLeft, isFoodDownRight,
            isClearUp, isClearDown, isClearLeft, isClearRight,
            isClearUpLeft, isClearUpRight, isClearDownLeft, isClearDownRight,
            toTheXFood, toTheYFood, leftDistance, rightDistance, upDistance, downDistance
        ];


        let out = this.brain.getOutput(transpose([input]));
        this.showResults(input,out);

    }
}