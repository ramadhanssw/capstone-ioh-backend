import { Router } from "express"
import multer from "multer"
import os from 'os'
import {
  RemoveUser,
  UserData,
  UserList,
  SubmitUser,
  UserPhoto,
  UpdateUserData,
  
} from "../../actions/main/User"

const upload = multer({
  dest: os.tmpdir()
})

const User = Router()

User.post('/:id', SubmitUser)
User.post('/', SubmitUser)

User.get('/photo/:id', UserPhoto)
User.get('/:id', UserData)
User.get('/', UserList)

User.put('/:id', upload.single('photo'), UpdateUserData)

User.delete('/:id', RemoveUser)

export const UserRouter = User