import ServiceTypeService from "../src/services/serviceTypeService";


describe('ServiceTypeService', () => {
    let serviceTypeService: ServiceTypeService;

    beforeEach(() => {
        serviceTypeService = new ServiceTypeService();
    });

    it('should create an empty service type set initially', () => {
        // Private properties can't be accessed directly, but we assume the set starts empty
        expect(serviceTypeService.isServiceTypeNameUnique('test-service')).toBe(true);
    });

    it('should register a new service type and check uniqueness', () => {
        const serviceTypeName = 'test-service';

        serviceTypeService.registerServiceType(serviceTypeName);

        expect(serviceTypeService.isServiceTypeNameUnique(serviceTypeName)).toBe(false);
    });

    it('should not register the same service type twice', () => {
        const serviceTypeName = 'duplicate-service';

        // Spy on console.error to check if the error is logged
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        serviceTypeService.registerServiceType(serviceTypeName);
        serviceTypeService.registerServiceType(serviceTypeName); // Try to add again

        expect(consoleSpy).toHaveBeenCalledWith(`Service Type ${serviceTypeName} already exists!`);
        consoleSpy.mockRestore();
    });

    it('should deregister a service type', () => {
        const serviceTypeName = 'removable-service';

        // First, register a service type
        serviceTypeService.registerServiceType(serviceTypeName);
        expect(serviceTypeService.isServiceTypeNameUnique(serviceTypeName)).toBe(false);

        // Now deregister the service type
        serviceTypeService.deregisterServiceType(serviceTypeName);
        expect(serviceTypeService.isServiceTypeNameUnique(serviceTypeName)).toBe(true);
    });

    it('should not throw an error when trying to deregister a non-existent service type', () => {
        const serviceTypeName = 'non-existent-service';

        // Should not throw or log any errors
        serviceTypeService.deregisterServiceType(serviceTypeName);

        // Check that no error was logged
        const consoleSpy = jest.spyOn(console, 'error');
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should handle registering and deregistering multiple service types', () => {
        const serviceTypeName1 = 'service-1';
        const serviceTypeName2 = 'service-2';

        // Register multiple services
        serviceTypeService.registerServiceType(serviceTypeName1);
        serviceTypeService.registerServiceType(serviceTypeName2);

        expect(serviceTypeService.isServiceTypeNameUnique(serviceTypeName1)).toBe(false);
        expect(serviceTypeService.isServiceTypeNameUnique(serviceTypeName2)).toBe(false);

        // Deregister one of them
        serviceTypeService.deregisterServiceType(serviceTypeName1);

        expect(serviceTypeService.isServiceTypeNameUnique(serviceTypeName1)).toBe(true);
        expect(serviceTypeService.isServiceTypeNameUnique(serviceTypeName2)).toBe(false);
    });

    it('should not allow empty or null service type names to be registered', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        // Trying to register an empty string should not be allowed
        serviceTypeService.registerServiceType('');
        serviceTypeService.registerServiceType(null as unknown as string); // Forced null for testing

        expect(consoleSpy).toHaveBeenCalledWith(`Service type cant be empty`);
        consoleSpy.mockRestore();
    });

    it('should correctly return true for a non-existent service type when checking uniqueness', () => {
        expect(serviceTypeService.isServiceTypeNameUnique('non-existent')).toBe(true);
    });

    describe('getAllServiceTypes', () => {
        test('should return an empty array when no service types are registered', () => {
            const serviceTypes = serviceTypeService.getAllServiceTypes();
            expect(serviceTypes).toEqual([]);
        });

        test('should return an array with one service type after registering one', () => {
            serviceTypeService.registerServiceType('ServiceType1');
            const serviceTypes = serviceTypeService.getAllServiceTypes();
            expect(serviceTypes).toEqual(['ServiceType1']);
        });

        test('should return an array with multiple service types after registering multiple', () => {
            serviceTypeService.registerServiceType('ServiceType1');
            serviceTypeService.registerServiceType('ServiceType2');
            serviceTypeService.registerServiceType('ServiceType3');
            const serviceTypes = serviceTypeService.getAllServiceTypes();
            expect(serviceTypes).toEqual(expect.arrayContaining(['ServiceType1', 'ServiceType2', 'ServiceType3']));
            expect(serviceTypes.length).toBe(3);
        });

        test('should not include duplicate service types', () => {
            serviceTypeService.registerServiceType('ServiceType1');
            serviceTypeService.registerServiceType('ServiceType1'); // Attempt to register duplicate
            const serviceTypes = serviceTypeService.getAllServiceTypes();
            expect(serviceTypes).toEqual(['ServiceType1']);
        });

        test('should return all service types after deregistering one', () => {
            serviceTypeService.registerServiceType('ServiceType1');
            serviceTypeService.registerServiceType('ServiceType2');
            serviceTypeService.deregisterServiceType('ServiceType1');
            const serviceTypes = serviceTypeService.getAllServiceTypes();
            expect(serviceTypes).toEqual(['ServiceType2']);
        });
    });

    describe('resetService', () => {
        test('should clear all registered service types after resetService is called', () => {
            serviceTypeService.registerServiceType('ServiceType1');
            serviceTypeService.registerServiceType('ServiceType2');
            serviceTypeService.resetService();
            const serviceTypes = serviceTypeService.getAllServiceTypes();
            expect(serviceTypes).toEqual([]);
        });

        test('should allow re-registration of service types after reset', () => {
            serviceTypeService.registerServiceType('ServiceType1');
            serviceTypeService.resetService();
            const result = serviceTypeService.registerServiceType('ServiceType1');
            expect(result).toBe(true);
            const serviceTypes = serviceTypeService.getAllServiceTypes();
            expect(serviceTypes).toEqual(['ServiceType1']);
        });
    });

});
