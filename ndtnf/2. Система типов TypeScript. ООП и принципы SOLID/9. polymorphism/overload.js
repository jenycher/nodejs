function sum(a, b, c) {
    if (b === void 0) { b = 0; }
    if (c === void 0) { c = 0; }
    return a + b + c;
}
console.log(sum(7)); // 7
console.log(sum(10, 8)); // 18
console.log(sum(10, 8, 20)); // 18
