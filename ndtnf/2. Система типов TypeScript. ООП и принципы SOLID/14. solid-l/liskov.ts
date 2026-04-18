class Employee {
    protected permissions: any = new Set<string>();

    public hasPermission(permissionName: string) {
        return this.permissions.has(permissionName);
    }
    public addPermission(permissionName: string) {
        return this.permissions.add(permissionName);
    }
}

class Cashier extends Employee {
    protected permissions: string[] = [];

    public addPermission(permissionName: string) {
        this.permissions.push(permissionName);
    }
}
function isPersonAllowedToDeleteProducts(person: Employee) {
    return person.hasPermission('deleteProducts');
}

const employee = new Employee();
employee.addPermission('deleteProducts');
isPersonAllowedToDeleteProducts(employee);

const cashier = new Cashier();
cashier.addPermission('deleteProducts');
isPersonAllowedToDeleteProducts(cashier);