import { Document, Types } from "mongoose"

export enum Privilege {
  Admin = 'admin',
  Staff = 'staff',
  Reviewer = 'reviewer',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned'
}

export enum Religion {
  Islam = 'islam',
  ProtestantChristian = 'protestant_christian',
  CatholicChristian = 'catholic_christian',
  Buddha = 'buddha',
  Hindu = 'hindu',
  Konghucu = 'konghucu',
  Other = 'other'
}

export enum Gender {
  Man = 'man',
  Woman = 'woman',
  Other = 'other'
}

export enum InitialStatus {
  NewStudent = 'new_student',
  TransferStudent = 'transfer_student'
}

export enum EmploymentStatus {
  PTT = 'PTT',
  PNS = 'PNS',
  GTT = 'GTT',
  CPNS = 'CPNS'
}

export enum MaritalStatus {
  Married = 'married',
  Widow = 'widow',
  Single = 'single'
}

export enum StaffPrivilegeAccess {
  Payment = 'payment',
  BookLibrary = 'book_library'
}

export default interface UserInterface extends Document {
  fullname: string
  email: string
  password: string
  photo?: string
  meta: {
    NIK?: string
    NPWP?: string
    address?: string
    gender?: Gender
    maritalStatus?: MaritalStatus
    religion?: Religion
    department?: Types.ObjectId
    NIP?: string
    NUPTK?: string
    NIPD?: string
    NISN?: string
    SKHUN?: string
    employmentStatus?: EmploymentStatus
    employmentGroup?: string
    fieldOfStudy?: string
    actionResearch?: Types.ObjectId
    birthDate?: string
    birthPlace?: string
    parent?: Types.ObjectId
    initialStatus?: InitialStatus
    batchYear?: number
    specialNeeds?: string
    phone?: Array<string>
    fcmToken?: Array<string>
    fcmTopic?: Array<string>
  }
  privilege: Privilege
  staffPrivilegeAccess?: Array<StaffPrivilegeAccess>
  updatedAt: Date
  createdAt: Date
  status: UserStatus
}
