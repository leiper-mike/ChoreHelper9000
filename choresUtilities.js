const fs = require('node:fs');
module.exports ={
    async readChores(userId){
        const chores = fs.readFile(`/users/${userId}`)
    },
}