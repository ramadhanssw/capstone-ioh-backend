import { model, Schema, Types } from "mongoose"
import ArticleCommentInterface, { ArticleCommentStatus } from "../interfaces/documents/ArticleCommentInterface"

const ArticleCommentSchema = new Schema({
  department: {
    type: Types.ObjectId,
    required: true
  },
  article: {
    type: Types.ObjectId,
    required: true
  },
  writer: {
    type: Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
  likes: [{
    type: Types.ObjectId
  }],
  createdAt: {
    type: Date,
    default: new Date()
  },
  status: {
    type: ArticleCommentStatus,
    default: ArticleCommentStatus.Draft
  }
})

export default model<ArticleCommentInterface>('article_comment', ArticleCommentSchema)