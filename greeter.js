function greeter(person) {
    return "Hello, " + person;
}
function example(str) {
    for (var i = 0; i < str.length; i++) {
        console.log(str[i]);
    }
}
var user = 'Josh';
document.body.innerHTML = greeter(user);
example('hello');
