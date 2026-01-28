/* 
 - server ko start krna
 */

const app = require("./src/app")
const mongoose = require("mongoose")

function connectToDb() {
    mongoose.connect("mongodb+srv://manishjaiswal4043_db_user:cafy6U8zrWZH1VlT@cluster0.wkgbvq3.mongodb.net/day-6")
        .then(() => {
            console.log("Connected to Database")
        })
}

connectToDb()

app.listen(3000, () => {
    console.log("server is running on port 3000")
})