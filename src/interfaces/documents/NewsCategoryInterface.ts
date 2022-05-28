import { Document } from "mongoose"

export enum NewsCategoryStatus {
  Publish = 'publish',
  Draft = 'draft',
}

export default interface NewsCategoryInterface extends Document {
  id: string
  title: string
  description: string
  createdBy: string
  updatedAt: Date
  createdAt: Date
  status: NewsCategoryStatus
}