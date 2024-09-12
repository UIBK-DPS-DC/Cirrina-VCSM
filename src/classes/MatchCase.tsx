import Action from "./action.ts";

export default class MatchCase {

    private _expression: string
    private _action: Action

    constructor(expression: string, action: Action) {
        this._expression = expression;
        this._action = action;
    }


    get expression(): string {
        return this._expression;
    }

    set expression(value: string) {
        this._expression = value;
    }

    get action(): Action {
        return this._action;
    }

    set action(value: Action) {
        this._action = value;
    }
}