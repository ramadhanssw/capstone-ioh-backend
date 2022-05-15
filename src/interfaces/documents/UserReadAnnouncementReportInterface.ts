import { Document, Types } from "mongoose"

export default interface UserReadAnnouncementReportInterface extends Document {
  user: Types.ObjectId
  announcement: Types.ObjectId
  readAt: Date
}
