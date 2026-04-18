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

const user: User = new User('Oleg', 'Petrov');
const userCart: Cart = new Cart;

user.setCart(userCart);

console.log(user.cart);