/**
 * server ko start krna
 * database se connect krna
 */
require("dotenv").config()
const connectToDb = require("./src/config/database")
const app = require("./src/app")

connectToDb()

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})