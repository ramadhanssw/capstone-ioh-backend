import { Router } from "express"
import multer from "multer"
import {
  UserRouter as UserRouterChild,
} from "./main/UserRouter"

const upload = multer()

const submitDepartmentFiles: Array<multer.Field> = [
  {name: 'logoWide', maxCount: 1},
  {name: 'logoSquare', maxCount: 1},
  {name: 'icon', maxCount: 1}
]

const UserRouter = Router()

UserRouter.use('/user', UserRouterChild)
UserRouter.use('/reviewer', UserRouterChild)

export default UserRouter
