import { Router } from "express"
import {
  UserRouter as UserRouterChild,
} from "./main/UserRouter"

const UserRouter = Router()

UserRouter.use('/user', UserRouterChild)

export default UserRouter
