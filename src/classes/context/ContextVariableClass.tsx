import { ContextVariableReference } from "./ContextVariableReference";
export class ContextVariableClass {
    name: string;
    value: ContextVariableReference;

    constructor(name:string, value : ContextVariableReference){
        this.name = name;
        this.value = value
    }
}