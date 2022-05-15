import { model, Schema, Types } from "mongoose"
import AnnouncementInterface, { AnnouncementStatus } from "../interfaces/documents/AnnouncementInterface"

const AnnouncementSchema = new Schema({
  writer: {
    type: Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  displayDate: {
    start: {
      type: Date
    },
    end: {
      type: Date
    }
  },
  status: {
    type: AnnouncementStatus,
    default: AnnouncementStatus.Draft
  }
})

export default model<AnnouncementInterface>('announcement', AnnouncementSchema)