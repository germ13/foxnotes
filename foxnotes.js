//foxnotes.js

document.body.style.border = "5px solid pink";
let url = window.location.href;
let key = url.split('?');

console.log(`You are at ${url}`);
console.log(`key is ${key[0]}`);