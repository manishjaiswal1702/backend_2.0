const express = require("express")

const app = express() // server instance create krna

app.use(express.json())

const notes = []

app.post("/notes", (req, res) => {
    console.log(req.body)
    notes.push(req.body)
    res.send("notes created")
})

app.get("/notes",(req,res)=>{
    res.send(notes)
})


app.listen(3000, () => {
    console.log("Server is running on port 3000")
}) // server start krna