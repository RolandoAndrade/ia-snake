const SURVIVOR_RATE = 0.3;
const POPULATION = 200;
const MUTATION_RATE = 0.5;
class Generation
{
    constructor(snakes)
    {
        this.generation = 1;
        this.SURVIVORS = SURVIVOR_RATE*POPULATION;
        this.snakes = snakes;
    }

    kill()
    {
        this.snakes.sort(function(a, b) {return b.snake.length - a.snake.length});
        for(let i = 0; i < POPULATION-this.SURVIVORS; i++)
        {
            this.snakes.pop();
        }
    }


    procreate()
    {
        let baby = new Snake();
        let brain = new NeuronalNetwork(TOPOLOGY,new Sigmoid());
        let father = this.snakes[Math.floor(Math.random() * this.SURVIVORS)];
        let mother = this.snakes[Math.floor(Math.random() * this.SURVIVORS)];
        baby.brain = this.mutate(brain);
        this.snakes.push(baby);
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
            this.procreate();
        }
        this.snakes.forEach((e)=>e.reset());
        this.generation++;
    }
}