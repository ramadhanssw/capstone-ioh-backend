import { Request, Response, Router } from 'express'
import multer from "multer"
import { DepartmentDashboard, DepartmentData, SubmitDepartment } from "../actions/main/Department"
import { Privilege } from "../interfaces/documents/UserInterface"
import { APIResponse } from "../interfaces/response"
import { DepartmentMatch } from "../middleware"
import Department from "../schemas/Department"
import Proposal from "../schemas/Proposal"
import User from "../schemas/User"
import Timeline from '../schemas/Timeline'
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
  UserRouter,
  ReviewerRouter as ReviewerRouterChild,
} from "./main/UserRouter"

const upload = multer()

const submitDepartmentFiles: Array<multer.Field> = [
  {name: 'logoWide', maxCount: 1},
  {name: 'logoSquare', maxCount: 1},
  {name: 'icon', maxCount: 1}
]

const ReviewerRouter = Router()

ReviewerRouter.use('/article', ArticleRouter)
ReviewerRouter.use('/article-category', ArticleCategoryRouter)
ReviewerRouter.use('/announcement', AnnouncementRouter)
ReviewerRouter.use('/document', DocumentRouter)
ReviewerRouter.use('/link', LinkRouter)
ReviewerRouter.use('/staff', ReviewerRouter)
ReviewerRouter.use('/reviewer', ReviewerRouterChild)
ReviewerRouter.use('/user', UserRouter)
ReviewerRouter.use('/notification', NotificationRouter)
ReviewerRouter.use('/proposal', ProposalRouter)
ReviewerRouter.use('/timeline-event', TimelineEventRouter)
ReviewerRouter.use('/Timeline', TimelineRouter)

ReviewerRouter.post('/department/:department', DepartmentMatch, upload.fields(submitDepartmentFiles), SubmitDepartment)

ReviewerRouter.get('/department/dashboard/:department', DepartmentMatch, DepartmentDashboard)
ReviewerRouter.get('/department/:department', DepartmentMatch, DepartmentData)

ReviewerRouter.get('/', (req: Request, res: Response): void => {
  const { user } = res.locals

  Promise.all([
    Department.countDocuments(),
    User.countDocuments({privilege: Privilege.Admin}),
    User.countDocuments({privilege: Privilege.Reviewer}),
    User.countDocuments({privilege: Privilege.Staff}),
    Timeline.countDocuments(),
    Proposal.countDocuments()
  ]).then(result => {
    const [departmentTotal, adminTotal, reviewerTotal, staffTotal, timelineTotal, proposalTotal] = result

    res.json(<APIResponse<any>>{
      success: true,
      message: {
        statistic: {
          departmentTotal: departmentTotal,
          adminTotal: adminTotal,
          reviewerTotal: reviewerTotal,
          staffTotal: staffTotal,
          timelineTotal: timelineTotal,
          proposalTotal: proposalTotal
        },
        currentUserData: {
          fullname: user.fullname
        }
      } 
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
})


export default ReviewerRouter
