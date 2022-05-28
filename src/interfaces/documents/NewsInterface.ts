import { Document } from "mongoose"

export enum NewsStatus {
  Publish = 'publish',
  Draft = 'draft',
}

export default interface NewsInterface extends Document {
  id: string
  category: string
  title: string
  image: string
  description: string
  content: string
  createdBy: string
  updatedAt: Date
  createdAt: Date
  status: NewsStatus
}
