import dotenv from 'dotenv'
import { Request, Response, Router } from 'express'
import multer from 'multer'
import { UpdateTrashReportStatus } from '../actions/main/TrashReport'
import { SubmitUser, UpdateUserData, UserPhoto } from '../actions/main/User'
import { firestore } from '../app'
import TrashReportInterface, { TrashReportStatus } from '../interfaces/documents/TrashReportInterface'
import UserInterface from '../interfaces/documents/UserInterface'
import { APIResponse } from '../interfaces/response'
import { Authentication } from '../middleware'

dotenv.config()

const MainRouter = Router()
const upload = multer()

MainRouter.post('/me', Authentication, upload.single('photo'), UpdateUserData)
MainRouter.post('/sign-up', SubmitUser)
MainRouter.post('/trash-report/:id/status', UpdateTrashReportStatus)

MainRouter.get('/user/photo/:id', Authentication, UserPhoto)

MainRouter.get('/me', Authentication, async (req: Request, res: Response): Promise<void> => {
  const user = {
    points: 0,
    ...res.locals.user
  } as UserInterface

  const trashReportsResult = await firestore.collection('trashReports').where('user', '==', user.id).get()
  const trashReports: Array<TrashReportInterface> = []
  trashReportsResult.docs.map((trashReport) => trashReports.push({
    id: trashReport.id,
    ...trashReport.data(),
  } as TrashReportInterface))

  user.points = trashReports.filter((trashReport) => trashReport.status == TrashReportStatus.Completed).reduce((prev, trashReport) => prev + trashReport.point, 0)

  res.json(<APIResponse<typeof res.locals>>{
    success: true,
    data: user
  })
  return
})

MainRouter.get('/', (req: Request, res: Response): void => {
  res.json(<APIResponse<{ currentTimestamp: Date }>>{
    success: true,
    data: {
      currentTimestamp: new Date()
    }
  })
  return
})

export default MainRouter