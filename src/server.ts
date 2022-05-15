import dotenv from 'dotenv'
import fs from 'fs'
import mongoose from 'mongoose'
import process from 'process'
import app from './app'

dotenv.config()

const {
  PORT = process.env.PORT ?? '3000',
  MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb+srv://root:root@cluster0.evimv.mongodb.net/pkkm?retryWrites=true&w=majority'
} = process.env

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() =>
  console.log(`MongoDB connected to ${MONGODB_URI}`)
).catch(err => {
  console.log('Failed when connecting to MongoDB')
  console.error(err)
  process.exit(1)
})

if (PORT.match(/[\.sock]+/g) !== null && fs.existsSync(PORT)) {
  fs.unlinkSync(PORT)
}

app.listen(PORT, () => {
  if (PORT.match(/[\.sock]+/g) !== null) {
    fs.chownSync(PORT, 33, 33)
  }

  console.log(`Server listening on port ${PORT}`)
})