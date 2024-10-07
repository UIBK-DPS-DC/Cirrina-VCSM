export default class ServiceTypeService {
    private _serviceTypes: Set<string>


    constructor() {
        this._serviceTypes = new Set();
    }


    public isServiceTypeNameUnique(serviceTypeName: string): boolean {
        return ! this._serviceTypes.has(serviceTypeName);
    }

    public registerServiceType(serviceTypeName: string): boolean {
        if(!serviceTypeName || ! serviceTypeName.trim()){
            console.error(`Service type cant be empty`);
            return false
        }
        if(this.isServiceTypeNameUnique(serviceTypeName)){
            this._serviceTypes.add(serviceTypeName);
            return true
        }

        console.error(`Service Type ${serviceTypeName} already exists!`)
        return false

    }

    public deregisterServiceType(serviceTypeName: string): void {
        this._serviceTypes.delete(serviceTypeName);
    }

    public getAllServiceTypes(): string[] {
        return Array.from(this._serviceTypes.values())
    }

    public resetService():void {
        this._serviceTypes = new Set();
    }









}