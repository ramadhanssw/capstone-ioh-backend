import { Router } from "express"
import multer from 'multer'
import { ImportReviewer, SubmitReviewer, RemoveReviewer, ExportReviewer, ReviewerData, ReviewerList } from "../../actions/main/Reviewer"
import {
  ExportStaff,
  ImportStaff,
  OverrideUser,
  RemoveStaff,
  StaffData,
  StaffList,
  SubmitStaff,
  UserList,
  UserPhoto
} from "../../actions/main/User"

const upload = multer()

const Student = Router()
const Staff = Router()
const Reviewer = Router()
const User = Router()

Reviewer.post('/import', upload.single('reviewerList'), ImportReviewer)
Reviewer.post('/:id', SubmitReviewer)
Reviewer.post('/', SubmitReviewer)

Reviewer.delete('/:id', RemoveReviewer)

Reviewer.get('/photo/t/:id', UserPhoto)
Reviewer.get('/export/', ExportReviewer)
Reviewer.get('/:id', ReviewerData)
Reviewer.get('/', ReviewerList)

Staff.post('/import/', upload.single('staffList'), ImportStaff)
Staff.post('/:id', SubmitStaff)
Staff.post('/', SubmitStaff)

Staff.delete('/:id', RemoveStaff)

Staff.get('/photo/:id', UserPhoto)
Staff.get('/export/', ExportStaff)
Staff.get('/:id', StaffData)
Staff.get('/', StaffList)

User.post('/handover/:id', OverrideUser)
User.get('/find/', UserList)

export const ReviewerRouter = Reviewer
export const StaffRouter = Staff
export const StudentRouter = Student
export const UserRouter = User