import { Document, Types } from "mongoose"

export enum AssignmentStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export default interface AssignmentInterface extends Document {
  title: string
  description: string
  assignmentField: Array<string>
  assessmentIndicator: Array<string>
  dueDate: string
  subject: Types.ObjectId
  grade: Types.ObjectId
  department: Types.ObjectId
  status?: AssignmentStatus
  schoolAcademicYear: Types.ObjectId
  showResult: boolean
  gradeAccess?: Array<Types.ObjectId>
  creator?: Types.ObjectId
}