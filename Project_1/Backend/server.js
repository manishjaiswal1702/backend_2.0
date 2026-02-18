require('dotenv').config()
const app = require("./src/app")
const connectToDatabase = require("./src/config/database")

connectToDatabase()

/* start the server */
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})