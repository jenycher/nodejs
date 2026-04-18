function sum(a: number): number;
function sum(a: number, b: number): number;
function sum(a: number, b: number, c: number): number;
function sum(a: number, b: number = 0, c: number = 0): number {
    return a + b + c;
}

console.log(sum(7)); // 7
console.log(sum(10, 8)); // 18
console.log(sum(10, 8, 20)); // 18


