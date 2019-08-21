class Sigmoid
{
    f(x)
    {
        return 1 / (1 + Math.exp(-x));
    }

    F(x)
    {
        let ax =[...x];
        for(let i = 0;i<x.length;i++)
        {
            for (let j = 0; j<x[i].length;j++)
            {
                ax[i][j]=this.f(ax[i][j]);
            }
        }
        return ax;
    }
}

class ReLu
{
    f(x)
    {
        return Math.max(0, x);
    }

    F(x)
    {
        let ax =[...x];
        for(let i = 0;i<x.length;i++)
        {
            for (let j = 0; j<x[i].length;j++)
            {
                ax[i][j]=this.f(ax[i][j]);
            }
        }
        return ax;
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
                weights.push(Math.random()*50-25);
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

const STEP = 0.5;

class NeuronalNetwork
{
    constructor(topology, activationFunction)
    {
        this.layers = [];
        let inputs = topology[0];
        topology.forEach(e=>{
            this.layers.push(new Layer(e,inputs,activationFunction));
            inputs = e;
        });
        this.layers[this.layers.length-1].activationFunction=new ReLu();
    }

    getOutput(x)
    {
        this.layers.forEach(l=>
        {
            x = l.getOutput(x);
        });
        return x;
    }

    mutate()
    {
        this.layers.forEach((l,k)=>
        {
            l.W.forEach((r,i)=>
            {
                r.forEach((c,j)=>
                {
                    this.layers[k].W[i][j] += Math.random() * 2 * STEP - STEP;
                })
            });
            l.b.forEach((r,i)=>
            {
                this.layers[k].b[i][0] += Math.random() * 2 * STEP - STEP;
            })
        })
    }
}