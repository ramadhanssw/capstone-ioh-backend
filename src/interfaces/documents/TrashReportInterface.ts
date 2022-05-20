import { Document } from "mongoose"

export enum TrashReportStatus {
  InProgress = 'inprogress',
  Completed = 'completed',
  Decline = 'decline'
}

export enum TrashCategory {
  HDPE = 'HDPE',
  PETE = 'PETE',
  OTHER = 'other'
}

export interface TrashData {
  title: string
  category: TrashCategory
  quantity: number
  //photos: Array<string>
  photo: string
  createdAt: Date
}

export default interface TrashReportInterface extends Document {
  id: string
  user: string
  title: string
  description: string
  trashList: Array<TrashData>
  point: number
  collectionPoint: string
  updatedAt: Date
  createdAt: Date
  status: TrashReportStatus
}
