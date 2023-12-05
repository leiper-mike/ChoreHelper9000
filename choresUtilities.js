const fs = require('node:fs/promises');
const path = require('node:path');
module.exports ={
    /**
     * Reads the users chores that are stored in their JSON
     * @param {string} userId 
     * @returns JSON object containing the username and chores in an array
     */
    async readChores(userId, userName){
        const choresPath = path.join(__dirname, `/users/${userId}.json`);
        try{
            //trys to access
            await fs.access(choresPath)
        }
        catch(err){
            //creates new JSON file if it doesn't exist
            const data = JSON.stringify({"username": userName, "chores":[]});
            await fs.writeFile(choresPath, data)
        }

        return JSON.parse(await fs.readFile(choresPath));
    },
    /**
     * 
     * @param {string} userId Id of the user to add chores for
     * @param {string} choreName name of chore
     * @param {string} frequency how often the chore should be completed, daily, weekly, or specific
     * @param {string} days days of the week to complete chores, only applies to specific frequency
     * @param {JSON} choresJSON JSON object containing the user info and list of chores
     * @returns 0 if the write fails, 1 if the write succeeds
     */
    async addChore(userId, choreName, frequency, days, choresJSON){
        if(choresJSON["chores"].length <= 50){
            choresJSON["chores"].push({
                "id": choresJSON["chores"].length,
                "name": choreName,
                "frequency": frequency,
                "days": days
            })
            const data = JSON.stringify(choresJSON);
            const choresPath = path.join(__dirname, `/users/${userId}.json`);
            try{
                await fs.writeFile(choresPath, data)
            }
            catch(e){
                console.log(e)
                return 0;
            }
            return 1;
        }
        else{
            return 0;
        }
    },
    /**
     * formats a given array of chores
     * @param {Array} chores 
     * @returns {string} Chores in one string
     */
    async formatChores(chores){
        let ret = "";
        let count = 1;
        chores.forEach(chore => {
            let freq = ""
            switch (chore.frequency) {
                case "daily":
                    freq = "Daily";
                    break;
                case "weekly":
                    freq = "Weekly";
                    break;
                case "specific":
                    freq = chore.days.toString();
                default:
                    break;
            }
            ret+= `${count++}: (${freq}) ${chore.name} ${chore.completed ? "✅" : ""} \n`
        });
        return ret;
    },
    /**
     * Marks chores as complete
     * @param {string} userId
     * @param {Array} chores array of chore ids to be marked as completed
     * @param {JSON} choresJSON the JSON object containing the chores
     */
    async completeChores(userId, chores, choresJSON){
        chores.forEach(c =>{
            choresJSON["chores"][c-1].completed = true;
        })
        const data = JSON.stringify(choresJSON);
        const choresPath = path.join(__dirname, `/users/${userId}.json`);
        try{
            await fs.writeFile(choresPath, data)
        }
        catch(e){
            console.log(e)
            return 0;
        }
        return 1;
    },
    /**
     * resets chores back to uncompleted based on input
     * @param {string} frequency daily | weekly
     */
    async resetChores(frequency){
        const choresDirPath = path.join(__dirname, `/users`);
        try {
            const files = await fs.readdir(choresDirPath);
            for (const file of files){
                const userPath = path.join(__dirname, `/users/${file}`)
                const choresJSON = JSON.parse(await fs.readFile(userPath));
                for(chore of choresJSON["chores"]){
                    if(chore.frequency === frequency || frequency === "weekly" && chore.frequency === "specific"){
                        choresJSON["chores"][chore.id].completed = false;
                    }
                }
            }

        } catch (err) {
            console.error(err);
        } 

        
    }
}