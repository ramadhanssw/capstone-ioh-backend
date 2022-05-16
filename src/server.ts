import dotenv from 'dotenv'
import fs from 'fs'
import process from 'process'
import app from './app'

dotenv.config()

const {
  PORT = process.env.PORT ?? '3000',
} = process.env

if (PORT.match(/[\.sock]+/g) !== null && fs.existsSync(PORT)) {
  fs.unlinkSync(PORT)
}

app.listen(PORT, () => {
  if (PORT.match(/[\.sock]+/g) !== null) {
    fs.chownSync(PORT, 33, 33)
  }

  console.log(`Server listening on port ${PORT}`)
})