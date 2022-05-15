import { Request, Response, Router } from 'express'
import {
  AdminData,
  AdminList,
  RemoveAdmin,
  SubmitAdmin,
  UserData
} from '../actions/main/User'
import { Privilege } from '../interfaces/documents/UserInterface'
import { APIResponse } from '../interfaces/response'
import Department from '../schemas/Department'
import User from '../schemas/User'
import Proposal from '../schemas/Proposal'
import AnnouncementRouter from './main/AnnouncementRouter'
import ArticleCategoryRouter from './main/ArticleCategoryRouter'
import ArticleRouter from './main/ArticleRouter'
import DepartmentRouter from './main/DepartmentRouter'
import DocumentRouter from './main/DocumentRouter'
import LinkRouter from './main/LinkRouter'
import NotificationRouter from './main/NotificationRouter'
import ProposalRouter from './main/ProposalRouter'
import TimelineEventRouter from './main/TimelineEventRouter'
import TimelineRouter from './main/TimelineRouter'
import { ReviewerRouter, StaffRouter, UserRouter } from './main/UserRouter'
import Timeline from '../schemas/Timeline'

const AdminRouter = Router()

AdminRouter.use('/article', ArticleRouter)
AdminRouter.use('/article-category', ArticleCategoryRouter)
AdminRouter.use('/announcement', AnnouncementRouter)
AdminRouter.use('/department', DepartmentRouter)
AdminRouter.use('/document', DocumentRouter)
AdminRouter.use('/link', LinkRouter)
AdminRouter.use('/notification', NotificationRouter)
AdminRouter.use('/staff', StaffRouter)
AdminRouter.use('/reviewer', ReviewerRouter)
AdminRouter.use('/user', UserRouter)
AdminRouter.use('/proposal', ProposalRouter)
AdminRouter.use('/timeline-event', TimelineEventRouter)
AdminRouter.use('/Timeline', TimelineRouter)

AdminRouter.post('/administrator/:id', SubmitAdmin)
AdminRouter.post('/administrator', SubmitAdmin)

AdminRouter.get('/administrator/:id', AdminData)
AdminRouter.get('/administrator', AdminList)
AdminRouter.get('/user/:id', UserData)

AdminRouter.delete('/administrator/:id', RemoveAdmin)

AdminRouter.get('/', (req: Request, res: Response): void => {
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

export default AdminRouter