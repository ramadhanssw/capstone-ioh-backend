import { Document, Types } from "mongoose"

export enum AttendanceValidity {
  Valid = 'valid',
  Invalid = 'invalid'
}

export enum AttendanceType {
  CheckIn = 'check_in',
  CheckOut = 'check_out',
  Subject = 'subject'
}

export enum AttendanceSubType {
  Attend = "attend",
  Sick = "sick",
  Permission = "permission"
}

export enum AttendanceTypeByLocation {
  PTM = "PTM",
  PJJ = "PJJ"
}

export interface AttendanceLocation {
  latitude: number
  longitude: number
}

export default interface AttendanceInterface extends Document {
  user: Types.ObjectId
  photo: string
  department: Types.ObjectId
  clock?: Types.ObjectId
  subject?: Types.ObjectId
  datetime: Date
  description?: string
  attendanceType: AttendanceType
  attendanceTypeByLocation: AttendanceTypeByLocation
  attendanceSubType: AttendanceSubType
  attendanceValidity: AttendanceValidity
  location: AttendanceLocation
  submittedBy: Types.ObjectId
}
