class Sigmoid
{
    f(x)
    {
        return 1 / (1 + Math.exp(-x));
    }

    ddF(x)
    {
        return this.f(x) * (1 - this.f(x));
    }

    F(x)
    {
        for(let i = 0;i<x.length;i++)
        {
            for (let j = 0; j<x[i].length;j++)
            {
                x[i][j]=this.f(x[i][j]);
            }
        }
        return x;
    }

    dF(x)
    {
        x.forEach((i) =>
        {
            i.forEach((j) =>
            {
                j = this.ddF(j);
            })
        })
    }
}

function dot(a,b)
{
    let r = [];
    for(let k = 0; k < b[0].length;k++)
    {
        for (let i = 0; i < a.length; i++)
        {
            let sum = 0;
            for (let j = 0; j < b.length; j++)
            {
                sum += a[i][j] * b[j][k];
            }
            if(k===0)
            {
                r.push([sum]);
            }
            else
            {
                r[i].push(sum);
            }

        }
    }

    return r;
}

function sum(a,b)
{
    for (let i = 0; i < a.length; i++)
    {
        for (let j = 0; j < a[i].length; j++)
        {
            a[i][j] += b[i][j];
        }
    }
    return a;
}

class Layer
{
    constructor(numberOfNeurons, numberOfInputs, activationFunction, learningRate)
    {
        this.W = [];
        this.b = [];
        for(let i = 0;i<numberOfNeurons;i++)
        {
            let weights = [];
            for(let j = 0; j < numberOfInputs;j++)
            {
                weights.push(Math.random()-0.5);
            }
            this.W.push(weights);
            this.b.push([1]);
        }
        this.activationFunction = activationFunction;
        this.learningRate = learningRate;
    }

    getOutput(x)
    {
        return this.activationFunction.F(sum(dot(this.W,x),this.b));
    }

}

let l1 = new Layer(3,3,new Sigmoid(),0.01);
console.log(l1.getOutput([[1],[2],[3]]));