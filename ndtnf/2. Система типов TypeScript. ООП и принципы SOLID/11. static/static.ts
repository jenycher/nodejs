class User {
    static MAX_LEVEL = 80;
    static generatePassword(): string {
        return Math.random().toString(36).substr(2);
    }
}

console.log(User.generatePassword());