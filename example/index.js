let action = require('./action.js').action; // 引入aciton.js
let name = require('./name.js').name; // 引入name.js
let message = `${name} is ${action}`;
console.log(message);
