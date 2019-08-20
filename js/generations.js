const SURVIVOR_RATE = 0.3;
const POPULATION = 80;
const MUTATION_RATE = 0.3;

function cloneObject(src)
{
    return JSON.parse(JSON.stringify(src));
}



class Generation
{
    constructor(boards)
    {
        this.generation = 1;
        this.SURVIVORS = SURVIVOR_RATE*POPULATION;
        this.boards = boards;
    }

    kill()
    {
        this.boards.sort(function(a, b) {return b.snake.getValoration() - a.snake.getValoration()});
    }


    procreate()
    {
        let baby = new Snake();
        let brain = new NeuronalNetwork(TOPOLOGY,new Sigmoid());
        let father = this.boards[Math.floor(Math.random() * this.SURVIVORS)].snake;
        let mother = this.boards[Math.floor(Math.random() * this.SURVIVORS)].snake;
        let layers = [];
        father.brain.layers.forEach(e=>
        {
            layers.push(cloneObject(e));
        });
        layers.forEach((l,i)=>
        {
            l.W.forEach((r,j)=>
            {
               r.forEach((c,k)=>
               {
                    if(Math.random()<0.5)
                        layers[i].W[j][k]=mother.brain.layers[i].W[j][k];
               });
            });

            l.b.forEach((r,j)=>
            {
                if(Math.random()<0.5)
                    layers[i].b[j]=mother.brain.layers[i].b[j];
            });
        });
        baby.brain.layers = layers;
        baby.brain = this.mutate(brain);
        return baby;
    }

    mutate(brain)
    {
        if(Math.random() < MUTATION_RATE)
        {
            brain.mutate();
        }
        return brain;
    }


    nextGeneration()
    {
        this.kill();
        for(let i = this.SURVIVORS; i < POPULATION; i++)
        {
            let baby = this.procreate();
            baby.x = this.boards[i].snake.x;
            baby.y = this.boards[i].snake.y;
            this.boards[i].snake = baby;
        }
        this.boards.forEach((e,i)=>
        {

            if(i===1)
            {
                e.snake.reset("#eeff7c");
            }
            else if(i<this.SURVIVORS)
            {
                e.snake.reset("#89ff90");
            }
            else
            {
                e.snake.reset();
            }
        });
        this.generation++;
    }
}