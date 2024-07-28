
export default class Transition {
    private source : string
    private target : string

    public constructor (sourceState: string, targetState: string){
        this.source = sourceState
        this.target = targetState
    }


    public setSource(sourceState: string): void{
        this.source = sourceState
    }

    public setTarget(targetState: string): void{
        this.target = targetState
    }

    public getSource(): string{
        return this.source
    }

    public getTarget(): string{
        return this.target
    }

    


    



}