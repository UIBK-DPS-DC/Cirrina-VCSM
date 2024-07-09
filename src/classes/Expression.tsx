export class ExpressionClass {
    private _expression: string;

    constructor();
    constructor(expression: string)

    constructor(expression?: string){
        this._expression = expression || "";
    }

    public get expression_1(): string {
        return this._expression;
    }
    public set expression_1(value: string) {
        this._expression = value;
    }
    
}