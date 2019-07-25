class Rectangle
{
    constructor(x,y,width, height, color, borderColor, lineWidth)
    {
        this.x=x;
        this.y=y;
        this.w=width;
        this.h=height;
        this.color=color;
        this.borderColor=borderColor?borderColor:color;
        this.lineWidth=lineWidth?lineWidth:0;
    }
    draw()
    {
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.borderColor=this.borderColor;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
        ctx.closePath();

    }
    move(x,y)
    {
        this.x=x;
        this.y=y;
    }
}


class Circle
{
    constructor(x, y, radius, color, borderColor, lineWidth)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.borderColor=borderColor?borderColor:color;
        this.lineWidth=lineWidth?lineWidth:0;
    }

    draw()
    {
        ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
        ctx.closePath();
    }

    move(x,y)
    {
        this.x=x;
        this.y=y;
    }

    contains(x,y)
    {
        return this.x-this.radius<=x&&this.x+this.radius>=x&&this.y+this.radius>=y&&this.y-this.radius<=y;
    }
}

class Line
{
    draw(m,b,lim=10)
    {
        const PROP=25;
        let x1=-20;
        let x2=20;
        let y1=m*x1+b;
        let y2=m*x2+b;
        ctx.beginPath();
            ctx.moveTo(x1*PROP, y1*PROP*-1);
            ctx.lineTo(x2*PROP, y2*PROP*-1);
            ctx.strokeStyle ="#9dff0f";
            ctx.stroke();
        ctx.closePath();
    }

    drawBy(x1,y1,x2,y2)
    {
        const PROP=25;
        x1*=PROP;
        x2*=PROP;
        y1*=PROP;
        y2*=PROP;
        ctx.beginPath();
            ctx.moveTo(x1+250, y1+250);
            ctx.lineTo(x2+250, y2+250);
            ctx.strokeStyle ="#000000";
            ctx.stroke();
        ctx.closePath();
    }

    axis(x)
    {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 500);
        ctx.moveTo(0, x);
        ctx.lineTo(500, x);
        ctx.strokeStyle ="#616aff";
        ctx.stroke();
        ctx.closePath();
    }
}