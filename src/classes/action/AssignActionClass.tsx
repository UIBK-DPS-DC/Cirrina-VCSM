export class AssignActionClass {
    private _variable: string;

    public get variable(): string {
        return this._variable;
    }
    public set variable(value: string) {
        this._variable = value;
    }


    constructor (variable: string){
        this._variable = variable;
    }
}

