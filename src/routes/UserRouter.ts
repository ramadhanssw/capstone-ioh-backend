import { Router } from "express"
import { CollectionPointList } from "../actions/main/CollectionPoint"
import { TrashReportRouter } from "./main/TrashReportRouter"
import {
  UserRouter as UserRouterChild,
} from "./main/UserRouter"

const UserRouter = Router()

UserRouter.use('/user', UserRouterChild)
UserRouter.use('/trash-report', TrashReportRouter)

UserRouter.get('/collection-point', CollectionPointList)

export default UserRouter
