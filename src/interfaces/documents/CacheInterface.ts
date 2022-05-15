import { Document } from "mongoose"

export default interface CacheInterface extends Document {
  key: string
  scope: string
  value: string
  createdAt: Date
  expiredAt: Date
}