class Sigmoid
{
    f(x)
    {
        return 1/(1-Math.exp(-x));
    }

    ddF(x)
    {
        return this.f(x)*(1-this.f(x));
    }

    F(x)
    {
        x.forEach((i)=>{
            i.forEach((j)=>{
                j = this.f(j);
            })
        })
    }

    dF(x)
    {
        x.forEach((i)=>{
            i.forEach((j)=>{
                j = this.ddF(j);
            })
        })
    }
}

function dot(a,b)
{
    let r = [];
    for (let i = 0; i <a.length;i++)
    {
        let sum = 0;
        for (let j = 0; j < a[i].length;j++)
        {
            sum+=a[i][j]*b[j][i];
        }
        r.push(sum);
    }
    return r;
}

function sum(a,b)
{
    for (let i = 0; i <a.length;i++)
    {
        for (let j = 0; j < a[i].length;j++)
        {
            a[i][j]+=b[i][j];
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