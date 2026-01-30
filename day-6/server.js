/* 
 - server ko start krna
 */

const app = require("./src/app")
const mongoose = require("mongoose")

function connectToDb() {
    mongoose.connect("")
        .then(() => {
            console.log("Connected to Database")
        })
}

connectToDb()

app.listen(3000, () => {
    console.log("server is running on port 3000")
})