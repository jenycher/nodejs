interface FullNameBuilder {
    (name: string, surname: string): string;
}

let simpleBuilder: FullNameBuilder = function (name:string, surname: string): string {
    return "Mr. " + name + " " + surname;
}

let fullName = simpleBuilder("Bob", "Simpson");
console.log(fullName); // Mr. Bob Simpson
