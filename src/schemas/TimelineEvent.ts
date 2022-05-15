import { model, Schema, Types } from "mongoose"
import TimelineEventInterface, { TimelineEventStatus } from "../interfaces/documents/TimelineEventInterface"

const TimelineEventSchema = new Schema({
  timeline: {
    type: Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  participants: [{
    type: Types.ObjectId
  }],
  description: {
    type: String
  },
  stepIndex: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  startedAt: {
    type: Date,
    default: new Date()
  },
  finishedAt: {
    type: Date,
    default: new Date()
  },
  status: {
    type: TimelineEventStatus,
    default: TimelineEventStatus.Draft
  }
})

export default model<TimelineEventInterface>('timeline_event', TimelineEventSchema)