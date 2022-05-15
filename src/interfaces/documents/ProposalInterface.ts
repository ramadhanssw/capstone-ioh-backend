import { Document, Types } from "mongoose"

export enum ProposalStatus {
  Approve = 'approve',
  Send = 'send',
  Decline = 'decline'
}

interface SubActivityInterface {
  title: string
  description: string
  funding: number
  PIC: string
  youtubeLink: string
  publicationLink: string
  documentationLink: string
}

interface ActivityInterface {
  title: string
  description: string
  subActivityList: Array<SubActivityInterface>  
}

interface ProposalMetaDataInterface {
  activityList: Array<ActivityInterface>
}

export default interface ProposalInterface extends Document {
  timelineEvent: Types.ObjectId
  department: Types.ObjectId
  title: string
  description: string
  scores: number
  file: string
  comment: string
  reviewer: Types.ObjectId
  meta: ProposalMetaDataInterface
  updatedAt: Date
  createdAt: Date
  createdBy: Types.ObjectId
  status: ProposalStatus
}