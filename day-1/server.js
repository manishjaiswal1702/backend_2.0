const express = require("express")

const app = express() // server instance create krna

app.get('/', (req, res) => {
    res.send("Hello world")
})

app.listen(3000) // server start krna