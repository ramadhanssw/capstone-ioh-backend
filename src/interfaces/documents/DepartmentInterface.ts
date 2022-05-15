import { Document } from "mongoose"

export enum DepartmentStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export default interface DepartmentInterface extends Document {
  title: string
  description: string
  logoSquare?: string
  logoWide?: string
  appIcon?: string
  website: string
  email: string
  phone: string
  accentColor?: string
  status: DepartmentStatus
}
