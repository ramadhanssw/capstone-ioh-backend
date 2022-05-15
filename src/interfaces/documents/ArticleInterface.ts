import { Document, Types } from "mongoose"

export enum ArticleStatus {
  Draft = 'draft',
  Publish = 'publish'
}

export default interface ArticleInterface extends Document {
  department: Types.ObjectId
  category: Types.ObjectId
  writer: Types.ObjectId
  featuredImage?: string
  title: string
  summary: string
  content: string
  likes: Array<Types.ObjectId>
  view: number
  createdAt: Date
  status: ArticleStatus
}