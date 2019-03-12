function greeter(person: string) {
    return "Hello, " + person;
}

function example (str: string) {
    for (let i=0; i<str.length; i++) {
        console.log(str[i])
    }
}

let user = 'Josh'

document.body.innerHTML = greeter(user);
example('hello')
