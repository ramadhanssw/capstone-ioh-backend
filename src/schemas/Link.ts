import { model, Schema, Types } from "mongoose"
import LinkInterface, { LinkStatus } from "../interfaces/documents/LinkInterface"

const LinkSchema = new Schema({
  writer: {
    type: Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  status: {
    type: LinkStatus,
    default: LinkStatus.Draft
  }
})

export default model<LinkInterface>('link', LinkSchema)