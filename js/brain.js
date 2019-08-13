class Sigmoid
{
    f(x)
    {
        return 1 / (1 + Math.exp(-x));
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
    constructor(numberOfNeurons, numberOfInputs, activationFunction)
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
    }

    getOutput(x)
    {
        return this.activationFunction.F(sum(dot(this.W,x),this.b));
    }

}


class NeuronalNetwork
{
    constructor(topology, activationFunction)
    {
        this.layers = [];
        let inputs = topology[0];
        topology.forEach(e=>{
            this.layers.push(new Layer(e,inputs,activationFunction));
            inputs = e;
        })
    }

    getOutput(x)
    {
        this.layers.forEach(l=>{
            x = l.getOutput(x);
        });
        return x;
    }
}