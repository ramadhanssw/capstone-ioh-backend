import dotenv from 'dotenv'
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded
} from 'express'
import firebase from 'firebase-admin'
import fs from "fs"
import helmet from 'helmet'
import path from 'path'
import AuthController from './actions/AuthController'
import { APIResponse } from './interfaces/response'
import {
  Authentication,
  CORS,
  IsAdmin
} from './middleware'
import AdminRouter from './routes/AdminRouter'
import MainRouter from './routes/MainRouter'
import UserRouter from './routes/UserRouter'

dotenv.config()

const MODE = process.env.MODE ?? 'production'
const app = express()

if (MODE === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    next()
  })
}

app.use(CORS)
app.use(helmet.hidePoweredBy())
app.use(helmet.xssFilter())
app.use(json())
app.use(urlencoded({extended: true, limit: '10mb', parameterLimit: 50000}))
app.use('/local-repo', express.static(path.join(__dirname, '../public/uploads/')))
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

app.use((req, res, next) => {
  next()
})

app.post('/sign-in', AuthController)

app.use('/admin', Authentication, IsAdmin, AdminRouter)
app.use('/user', Authentication, UserRouter)
app.use('/', MainRouter)

app.use((req: Request, res: Response): void => {
  res.status(404)

  res.json(<APIResponse>{
    success: false,
    message: `Path ${req.method} ${req.path} not found`
  })
})

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(fs.readFileSync(path.join(__dirname, '../firebase-adminsdk.json')).toString()))
  })
  console.log("Firebase initialization")
}

export const firestore = firebase.firestore()
export const storageRef = firebase.storage().bucket(`gs://capstone-ioh.appspot.com`);


export default app
