import { model, Schema, Types } from "mongoose"
import NotificationInterface, {NotificationCategory} from "../interfaces/documents/NotificationInterface"

const NotificationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    required: true,
    type: String
  },
  category: {
    required: true,
    type: NotificationCategory
  },
  data: {
    required: false,
    type: String
  },
  receiverList: [{
    type: Types.ObjectId,
    required: true
  }],
  readList: [{
    type: Types.ObjectId,
    required: true
  }],
  createdAt: {
    type: Date,
    default: new Date()
  },
  sender: {
    type: Types.ObjectId,
    required: true
  },
})

export default model<NotificationInterface>('notification', NotificationSchema)
