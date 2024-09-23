import Action from "./action.tsx";
import {MatchCaseDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";

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


    public toDescription(): MatchCaseDescription {
        const description: MatchCaseDescription = {
            action: this.action.toDescription(),
            case: this.expression

        }

        return description


    }

    public static fromDescription(description: MatchCaseDescription): MatchCase {
        return new MatchCase(description.case, Action.fromDescription(description.action))
    }





}