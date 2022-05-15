import { Document, Types } from "mongoose"

export enum NotificationCategory {
  Article='article',
  Announcement='announcement',
  Proposal='proposal',
  Timeline='timeline',
  TimelineEvent='timeline_event',
  Link='link',
  Document='document'
}

export default interface NotificationInterface extends Document {
  title: string
  body: string
  category: NotificationCategory
  data: DocumentType
  receiverList: Array<Types.ObjectId>
  readList: Array<string>
  createdAt: Date
  sender: Types.ObjectId
}