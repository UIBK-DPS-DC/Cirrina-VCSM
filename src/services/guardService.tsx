export default class GuardService {
    private _nameToExpressionMap: Map<string, string>;

    public constructor() {
        this._nameToExpressionMap = new Map();

    }

    public isNameUnique(name: string): boolean {
        return ! this._nameToExpressionMap.has(name)
    }


    public registerGuard(guardName: string, expression: string): boolean {
        if (!this.isNameUnique(guardName)) {
            console.error("Guard name already exists!");
            return false;
        }
        this._nameToExpressionMap.set(guardName,expression)
        console.log(`${guardName} has been registered and linked to ${expression}!`);

        return true;
    }


    public unregisterGuard(name: string): void {
        if (this.isNameUnique(name)) {
            console.warn(`Could not unregister ${name}. ${name} is not a known guard`);
            return;
        }
        this._nameToExpressionMap.delete(name)
    }

    public linkNameToGuard(guardName: string, expression: string): void {
        this._nameToExpressionMap.set(guardName, expression);
    }






}