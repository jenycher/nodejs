interface CanWalk {
    walk(): void;
}
interface CanFly {
    fly(): void;
}
class Nightingale implements CanFly, CanWalk {
    public fly() {
        /// ...
    }
    public walk() {
        /// ...
    }
}
class Kiwi implements CanWalk {
    public walk() {
        /// ...
    }
}