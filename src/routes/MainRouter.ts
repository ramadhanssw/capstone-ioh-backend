import dotenv from 'dotenv'
import { Request, Response, Router } from 'express'
import multer from 'multer'
import { SubmitUser, UpdateUserData, UserPhoto } from '../actions/main/User'
import { APIResponse } from '../interfaces/response'
import { Authentication } from '../middleware'

dotenv.config()

const MainRouter = Router()
const upload = multer()

MainRouter.post('/me', Authentication, upload.single('photo'), UpdateUserData)
MainRouter.post('/sign-up', SubmitUser)

MainRouter.get('/user/photo/:id', Authentication, UserPhoto)

MainRouter.get('/me', Authentication, (req: Request, res: Response): void => {
  res.json(<APIResponse<typeof res.locals>>{
    success: true,
    data: res.locals
  })
  return
})

MainRouter.get('/', (req: Request, res: Response): void => {
  res.json(<APIResponse<{currentTimestamp: Date}>>{
    success: true,
    data: {
      currentTimestamp: new Date()
    }
  })
  return
})

export default MainRouter