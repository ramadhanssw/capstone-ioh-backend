import { model, Schema } from "mongoose"
import TimelineInterface, { TimelineParticipantType, TimelineStatus } from "../interfaces/documents/TimelineInterface"

const TimelineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  participantType: {
    type: TimelineParticipantType,
    default: TimelineParticipantType.Department
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  status: {
    type: TimelineStatus,
    default: TimelineStatus.Draft
  }
})

export default model<TimelineInterface>('timeline', TimelineSchema)