import { model, Schema, Types } from "mongoose"
import ArticleCategoryInterface, { ArticleCategoryStatus } from "../interfaces/documents/ArticleCategoryInterface"

const ArticleCategorySchema = new Schema({
  department: {
    type: Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  status: {
    type: ArticleCategoryStatus,
    default: ArticleCategoryStatus.Draft
  }
})

export default model<ArticleCategoryInterface>('article_category', ArticleCategorySchema)