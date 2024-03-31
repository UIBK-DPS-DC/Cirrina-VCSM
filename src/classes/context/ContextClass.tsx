import { ContextVariableClass } from "./ContextVariableClass"
export class ContextClass {
    variables: Array<ContextVariableClass>

    constructor(variables: Array<ContextVariableClass>){
        this.variables = variables
    }
}