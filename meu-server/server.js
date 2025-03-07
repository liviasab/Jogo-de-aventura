import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './database.js';
import { Score } from './model.js';


const app = express()
app.use(express.json())
app.use(cors())
connectToDatabase()


app.post('/', (req, res) => {
    const score = req.body;
    console.log(score)
    Score.insertOne(score)
    .then(() => res.send('Score salvo'))
    .catch((e) => res.send('Erro ao salvar score'))
});

app.get('/all', (req, res) => {
    Score.find()
    .then((scores) => res.send(scores))
    .catch((e) => res.send('Erro ao buscar scores'))
});

app.get('/max', (req, res) => {
    Score.find().sort({score: -1}).limit(1)
    .then((scores) => res.send(scores))
    .catch((e) => res.send('Erro ao buscar scores'))
});


app.listen(3001, () => {
    console.log('Server is running on port 3000');
});