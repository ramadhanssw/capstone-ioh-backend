import { Document, Types } from "mongoose"

export enum ArticleCategoryStatus {
  Draft = 'draft',
  Publish = 'publish'
}

export default interface ArticleCategoryInterface extends Document {
  department: Types.ObjectId
  title: string
  description?: string
  createdAt: Date
  status: ArticleCategoryStatus
}