import { Router } from 'express'
import {
  AdminData,
  AdminList,
  RemoveAdmin,
  SubmitAdmin,
  UserData
} from '../actions/main/User'
import { UserRouter } from './main/UserRouter'

const AdminRouter = Router()

AdminRouter.use('/user', UserRouter)

AdminRouter.post('/administrator/:id', SubmitAdmin)
AdminRouter.post('/administrator', SubmitAdmin)

AdminRouter.get('/administrator/:id', AdminData)
AdminRouter.get('/administrator', AdminList)
AdminRouter.get('/user/:id', UserData)

AdminRouter.delete('/administrator/:id', RemoveAdmin)

export default AdminRouter