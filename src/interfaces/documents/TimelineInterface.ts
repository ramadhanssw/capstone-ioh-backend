import { Document } from "mongoose"

export enum TimelineStatus {
  Publish = 'publish',
  Draft = 'draft'
}

export enum TimelineParticipantType {
  Person = 'person',
  Department = 'department'
}
export default interface TimelineInterface extends Document {
  title: string
  description: string
  participantType: TimelineParticipantType
  status: TimelineStatus
}