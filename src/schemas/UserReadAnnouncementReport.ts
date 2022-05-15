import { model, Schema, Types } from "mongoose"
import UserReadAnnouncementReportInterface from "../interfaces/documents/UserReadAnnouncementReportInterface"

const UserReadAnnouncementReportSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true
  },
  announcement: {
    type: Types.ObjectId,
    required: true
  },
  readAt: {
    type: Date,
    default: new Date()
  }
})

export default model<UserReadAnnouncementReportInterface>('user_read_announcement_report', UserReadAnnouncementReportSchema)
