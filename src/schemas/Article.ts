import { model, Schema, Types } from "mongoose"
import ArticleInterface, { ArticleStatus } from "../interfaces/documents/ArticleInterface"

const ArticleSchema = new Schema({
  department: {
    type: Types.ObjectId,
    required: true
  },
  writer: {
    type: Types.ObjectId,
    required: true
  },
  category: {
    type: Types.ObjectId
  },
  likes: [{
    type: Types.ObjectId
  }],
  view: {
    type: Number,
    default: 0
  },
  featuredImage: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  status: {
    type: ArticleStatus,
    default: ArticleStatus.Draft
  }
})

export default model<ArticleInterface>('article', ArticleSchema)
