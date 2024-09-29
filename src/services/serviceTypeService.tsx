export default class ServiceTypeService {
    private _serviceTypes: Set<string>


    constructor() {
        this._serviceTypes = new Set();
    }


    public isServiceTypeNameUnique(serviceTypeName: string): boolean {
        return this._serviceTypes.has(serviceTypeName);
    }

    public registerServiceType(serviceTypeName: string): void {
        if(this.isServiceTypeNameUnique(serviceTypeName)){
            this._serviceTypes.add(serviceTypeName);
            return
        }

        console.error(`Service Type ${serviceTypeName} already exists!`)

    }

    public deregisterServiceType(serviceTypeName: string): void {
        this._serviceTypes.delete(serviceTypeName);
    }





}