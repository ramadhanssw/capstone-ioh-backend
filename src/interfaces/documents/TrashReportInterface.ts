
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
  photo: string
  createdAt: Date
}

export default interface TrashReportInterface {
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
