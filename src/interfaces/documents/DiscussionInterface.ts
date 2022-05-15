import { Document, Types } from "mongoose"

export default interface DiscussionInterface extends Document {
  studyMaterial: Types.ObjectId
  user: Types.ObjectId
  content: string
  timestmap: number
}