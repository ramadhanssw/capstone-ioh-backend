import { Document } from "mongoose"

export enum CollectionPointStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export default interface CollectionPointInterface extends Document {
  id: string
  title: string
  description: string
  latitude: number
  longitude: number
  updatedAt: Date
  createdAt: Date
  status: CollectionPointStatus
}
