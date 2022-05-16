import { Router } from "express"
import {
  RemoveUser,
  UserData,
  UserList,
  SubmitUser,
  UserPhoto
} from "../../actions/main/User"

const User = Router()

User.post('/:id', SubmitUser)
User.post('/', SubmitUser)

User.delete('/:id', RemoveUser)

User.get('/photo/:id', UserPhoto)
User.get('/:id', UserData)
User.get('/', UserList)

User.get('/photo/:id', UserPhoto)
User.get('/find', UserList)

export const UserRouter = User