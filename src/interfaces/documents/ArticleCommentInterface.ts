import { Document, Types } from "mongoose"

export enum ArticleCommentStatus {
  Draft = 'draft',
  Publish = 'publish'
}

export default interface ArticleInterface extends Document {
  department: Types.ObjectId
  article: Types.ObjectId
  writer: Types.ObjectId
  text: string
  photo: string
  likes: Array<Types.ObjectId>
  createdAt: Date
  status: ArticleCommentStatus
}