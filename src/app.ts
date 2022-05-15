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
import AuthController, { MSAuth } from './actions/AuthController'
import { APIResponse } from './interfaces/response'
import {
  Authentication,
  CORS,
  IsAdmin,
  IsReviewer,
  IsStaff,
} from './middleware'
import RedisCacheClient from './redis-client'
import AdminRouter from './routes/AdminRouter'
import StaffRouter from './routes/StaffRouter'
import MainRouter from './routes/MainRouter'
import ReviewerRouter from './routes/ReviewerRouter'

dotenv.config()

const MODE = process.env.MODE ?? 'production'
const app = express()

if (MODE === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    RedisCacheClient.flushall()
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

app.post('/msauth', MSAuth)
app.post('/auth', AuthController)

app.use('/admin', Authentication, IsAdmin, AdminRouter)
app.use('/reviewer', Authentication, IsReviewer, ReviewerRouter)
app.use('/staff', Authentication, IsStaff, StaffRouter)
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
}

export default app
