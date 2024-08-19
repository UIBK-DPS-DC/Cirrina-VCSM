export default class Guard {
    private _name: string;
    private _expression: string;

    public constructor(expression: string, name = "") {
        this._name = name;
        this._expression = expression;

    }

    public get expression() {
        return this._expression;
    }

    public get name() {
        return this._name;
    }

    public set name(value) {
        this._name = value;
    }

    public set expression(value) {
        this._expression = value;
    }


}