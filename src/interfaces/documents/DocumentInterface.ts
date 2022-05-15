import { Document, Types } from "mongoose"

export enum DocumentStatus {
  Publish = 'publish',
  Draft = 'draft'
}

export default interface DocumentInterface extends Document {
  createdBy: Types.ObjectId
  title: string
  description: string
  file: string
  createdAt: Date
  status: DocumentStatus
}