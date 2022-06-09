import { Document } from "mongoose"

export enum Privilege {
  Admin = 'admin',
  User = 'user',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned'
}

export enum Gender {
  Man = 'man',
  Woman = 'woman'
}

export default interface UserInterface {
  id: string
  fullname: string
  email: string
  password: string
  photo?: string
  meta: {
    address?: string
    gender?: Gender   
    birthDate?: string
    birthPlace?: string
    phone?: string
    fcmToken?: string
    fcmTopic?: string
  }
  points: number,
  privilege: Privilege
  updatedAt: Date
  createdAt: Date
  status: UserStatus
}
