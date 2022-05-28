import { Router } from 'express'
import {
  AdminData,
  AdminList,
  RemoveAdmin,
  SubmitAdmin,
  UserData
} from '../actions/main/User'
import { CollectionPointRouter } from './main/CollectionPointRouter'
import { NewsCategoryRouter } from './main/NewsCategory'
import { NewsRouter } from './main/NewsRouter'
import { TrashReportRouter } from './main/TrashReportRouter'
import { UserRouter } from './main/UserRouter'

const AdminRouter = Router()

AdminRouter.use('/user', UserRouter)
AdminRouter.use('/trash-report', TrashReportRouter)
AdminRouter.use('/collection-point', CollectionPointRouter)
AdminRouter.use('/news-category', NewsCategoryRouter)
AdminRouter.use('/news', NewsRouter)

AdminRouter.post('/administrator/:id', SubmitAdmin)
AdminRouter.post('/administrator', SubmitAdmin)

AdminRouter.get('/administrator/:id', AdminData)
AdminRouter.get('/administrator', AdminList)
AdminRouter.get('/user/:id', UserData)

AdminRouter.delete('/administrator/:id', RemoveAdmin)

export default AdminRouter