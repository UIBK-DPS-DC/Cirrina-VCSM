export class GuardClass {
    private _expression: string;
    private _guardName?: string | undefined;

    constructor();
    constructor(expression: string, guardName:string);

    constructor(expression?: string, guardName?: string ){
        this._expression = expression || "";
        this._guardName = guardName || undefined;
        
    }

    public get expression(): string {
        return this._expression;
    }
    public set expression(value: string) {
        this._expression = value;
    }

    public get guardName(): string | undefined {
        return this._guardName;
    }
    public set guardName(value: string | undefined) {
        this._guardName = value;
    }




}