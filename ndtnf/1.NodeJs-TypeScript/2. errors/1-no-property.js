var person = {
    name: 'Владимир',
    age: 34
};
function printInfo(data) {
    console.log("\u0418\u043C\u044F: ".concat(data.name, ", \u0412\u043E\u0437\u0440\u0430\u0441\u0442: ").concat(data.age));
}
printInfo(person);
