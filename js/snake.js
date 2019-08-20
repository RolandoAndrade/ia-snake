const TOPOLOGY = [17,9,9,1];

/*
* Descripción del cerebro
*
* Capa de entrada:
*
* 1. X de la cabeza
* 2. Y de la cabeza
* 3. X del primer cuartil del cuerpo
* 4. Y del primer cuartil del cuerpo
* 5. X de la mitad del cuerpo
* 6. Y de la mitad del cuerpo
* 7. X del tercer cuartil del cuerpo
* 8. Y del tercer cuartil del cuerpo
* 9. X del final del cuerpo
* 10. Y del final del cuerpo
* 11. X de la comida
* 12. Y de la comida
* 13. Se dirige a la derecha
* 14. Se dirige a abajo
* 15. Se dirige a la izquierda
* 16. Se dirige a arriba
* 17. Tamaño actual
* */

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

    reset()
    {
        this.snake = [];
        this.alive = true;
        for (let i = 0; i < 6; i++)
        {
            this.snake.push(new Body(this.x + 32 - SQUARE_WIDTH * i, this.y + 40, SQUARE_WIDTH, 0));
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
        let headX = head.x/BOARD_WIDTH;
        let headY = head.y/BOARD_WIDTH;
        let q1X = this.snake[this.q1].x/BOARD_WIDTH;
        let q1Y = this.snake[this.q1].y/BOARD_WIDTH;
        let q2X = this.snake[this.q2].x/BOARD_WIDTH;
        let q2Y = this.snake[this.q2].y/BOARD_WIDTH;
        let q3X = this.snake[this.q3].x/BOARD_WIDTH;
        let q3Y = this.snake[this.q3].y/BOARD_WIDTH;
        let tailX = this.snake[this.snake.length-1].x/BOARD_WIDTH;
        let tailY = this.snake[this.snake.length-1].y/BOARD_WIDTH;
        let rig = this.snake[0].vx>0?1:this.snake[0].vx<0?-1:0;
        let lef = this.snake[0].vx<0?1:this.snake[0].vx>0?-1:0;
        let up = this.snake[0].vy<0?1:this.snake[0].vy>0?-1:0;
        let dow = this.snake[0].vy>0?1:this.snake[0].vy<0?-1:0;
        let out = this.brain.getOutput([[headX,headY,q1X,q1Y,q2X,q2Y,q3X,q3Y,
                              tailX,tailY,food.x/BOARD_WIDTH,food.y/BOARD_WIDTH, rig, dow, lef, up,this.snake.length]])[0][0];
        if(out<0.25)
        {
            if(dow===1)
            {
                this.alive=false;
            }
            else
            {
                head.up();
            }

        }
        else if(out<0.5)
        {
            if(lef===1)
            {
                this.alive=false;
            }
            else
            {
                head.right();
            }

        }
        else if(out<0.75)
        {
            if(up===1)
            {
                this.alive=false;
            }
            else
            {
                head.down();
            }
        }
        else
        {
            if(rig===1)
            {
                this.alive=false;
            }
            else
            {
                head.left();
            }
        }
    }
}