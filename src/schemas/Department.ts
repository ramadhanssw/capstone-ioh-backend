import { model, Schema } from "mongoose"
import DepartmentInterface, {
  DepartmentStatus
} from "../interfaces/documents/DepartmentInterface"

const DepartmentSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  logoSquare: {
    type: String
  },
  logoWide: {
    type: String
  },
  appIcon: {
    type: String
  },
  website: {
    type: String
  },
  email: {
    type: String
  },
  phone:
    {
      type: String
    },
  accentColor: {
    type: String,
    default: "DarkRed"
  },
  status: {
    type: DepartmentStatus,
    default: DepartmentStatus.Inactive
  }
})

export default model<DepartmentInterface>("Department", DepartmentSchema)
