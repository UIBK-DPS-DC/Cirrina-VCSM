import {Context} from "../types.ts";

/**
 * ContextService Class
 *
 * This class is responsible for managing contexts using a Map. It provides methods
 * to register, update, and create contexts. Each context is identified by a unique name.
 */
export default class ContextService {
    private _contextMap: Map<string, Context>;

    public constructor() {
        this._contextMap = new Map();
    }

    public registerContext(context: Context): void {
        if(this.isContextNameUnique(context)){
            console.error("Context name already exists!");
            return;
        }
        this._contextMap.set(context.name, context);
    }

    public isContextNameUnique(context: Context): boolean {
        return this._contextMap.has(context.name);
    }

    public updateContext(context: Context): void {
        if(this.isContextNameUnique(context)){
            console.error("Context does not exist");
            return;
        }
        this._contextMap.set(context.name, context);

    }

    public createContext(name: string, value: string): Context {
        return {
            name: name,
            value: value
        }
    }



}