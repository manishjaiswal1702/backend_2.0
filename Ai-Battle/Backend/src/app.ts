import express from 'express';
import runGraph from "./ai/graph.ai.js";

const app = express();


app.get('/', async (req: any, res: any) => {

    const result = await runGraph("Write an code for Factorial function in js")

    res.json(result)
})



export default app;