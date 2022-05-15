import { Document, Types } from "mongoose"

export enum AssignmentFileStatus {
  Unconfirmed = 'unconfirmed',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Invalid = 'invalid'
}

export default interface AssignmentReportInterface extends Document {
  user: Types.ObjectId
  department: Types.ObjectId
  assignment: Types.ObjectId
  assignmentFiles: Array<Array<{
    file: string
    status: AssignmentFileStatus
    timestamp: number
  }>>
  assignmentText: Array<{
    text: string
  }>
  scores: Array<number>
  comment: string
  schoolAcademicYear: Types.ObjectId
  createdAt: Date
}