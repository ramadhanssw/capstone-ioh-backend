import { Router } from "express"
import multer from "multer"
import DepartmentList, {
  DepartmentDashboard,
  DepartmentData,
  RemoveDepartment,
  SubmitDepartment
} from "../../actions/main/Department"

const upload = multer()
const DepartmentRouter = Router()

const submitDepartmentFiles: Array<multer.Field> = [
  {name: 'logoWide', maxCount: 1},
  {name: 'logoSquare', maxCount: 1},
  {name: 'icon', maxCount: 1}
]

DepartmentRouter.post(['/:department', '/'], upload.fields(submitDepartmentFiles), SubmitDepartment)

DepartmentRouter.delete('/:department', RemoveDepartment)

DepartmentRouter.get('/dashboard/:department', DepartmentDashboard)
DepartmentRouter.get('/:department', DepartmentData)
DepartmentRouter.get('/', DepartmentList)

export default DepartmentRouter