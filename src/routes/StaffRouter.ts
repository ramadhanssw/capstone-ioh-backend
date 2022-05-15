import { Router } from "express"
import multer from "multer"
import { DepartmentDashboard, DepartmentData, SubmitDepartment } from "../actions/main/Department"
import { DepartmentMatch } from "../middleware"
import AnnouncementRouter from "./main/AnnouncementRouter"
import ArticleCategoryRouter from './main/ArticleCategoryRouter'
import ArticleRouter from "./main/ArticleRouter"
import DocumentRouter from "./main/DocumentRouter"
import LinkRouter from "./main/LinkRouter"
import NotificationRouter from './main/NotificationRouter'
import ProposalRouter from "./main/ProposalRouter"
import TimelineEventRouter from "./main/TimelineEventRouter"
import TimelineRouter from "./main/TimelineRouter"
import {
  StaffRouter as StaffRouterChild,
  UserRouter
} from "./main/UserRouter"

const upload = multer()

const submitDepartmentFiles: Array<multer.Field> = [
  {name: 'logoWide', maxCount: 1},
  {name: 'logoSquare', maxCount: 1},
  {name: 'icon', maxCount: 1}
]

const StaffRouter = Router()

StaffRouter.use('/article', ArticleRouter)
StaffRouter.use('/article-category', ArticleCategoryRouter)
StaffRouter.use('/announcement', AnnouncementRouter)
StaffRouter.use('/document', DocumentRouter)
StaffRouter.use('/link', LinkRouter)
StaffRouter.use('/staff', StaffRouterChild)
StaffRouter.use('/reviewer', StaffRouterChild)
StaffRouter.use('/user', UserRouter)
StaffRouter.use('/notification', NotificationRouter)
StaffRouter.use('/proposal', ProposalRouter)
StaffRouter.use('/timeline-event', TimelineEventRouter)
StaffRouter.use('/Timeline', TimelineRouter)

StaffRouter.post('/department/:department', DepartmentMatch, upload.fields(submitDepartmentFiles), SubmitDepartment)

StaffRouter.get('/department/dashboard/:department', DepartmentMatch, DepartmentDashboard)
StaffRouter.get('/department/:department', DepartmentMatch, DepartmentData)

export default StaffRouter
