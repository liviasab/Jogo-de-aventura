import mongoose from "mongoose";



export function connectToDatabase() {
    const uri = 'mongodb://meu-banco:27017/joguinho'

    mongoose.connect(uri)
    .then(() => console.log('conectado ao banco'))
    .catch((e) => console.error('erro ao conectar', e))
}