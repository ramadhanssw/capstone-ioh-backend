import { Document, Types } from "mongoose"

export enum AnnouncementStatus {
  Publish = 'publish',
  Draft = 'draft'
}

export default interface AnnouncementInterface extends Document {
  writer: Types.ObjectId
  title: string
  content: string
  createdAt: Date
  scheduledAnnouncement: boolean
  displayDate?: {
    start: Date,
    end: Date
  }
  status: AnnouncementStatus
}