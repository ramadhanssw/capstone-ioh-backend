import { Document, Types } from "mongoose"

export enum LinkStatus {
  Publish = 'publish',
  Draft = 'draft'
}

export default interface LinkInterface extends Document {
  writer: Types.ObjectId
  title: string
  url: string
  createdAt: Date
  status: LinkStatus
}