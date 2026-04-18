class User {
    name: string;
    lastName: string;
    cart: Cart;
    constructor(name: string, lastName: string) {
        this.name = name;
        this.lastName = lastName;
    }
    setCart(cart: Cart) {
        this.cart = cart;
    }
}

class Cart {
    refresh() {

    }
}

class Teacher extends User {
    setScore(student: Student) {
        //
    }
}

class Student extends User {
    getTotalScore(): number {
        //
        return 0;
    }
}