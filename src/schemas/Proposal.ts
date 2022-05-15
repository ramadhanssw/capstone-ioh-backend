import { model, Schema, Types } from "mongoose"
import ProposalInterface, { ProposalStatus } from "../interfaces/documents/ProposalInterface"

const ProposalSchema = new Schema({
  timelineEvent: {
    type: Types.ObjectId
  },
  department: {
    type: Types.ObjectId
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  file: {
    type: String
  },
  comment: {
    type: String
  },
  createdBy: {
    type: Types.ObjectId
  },
  reviewer: {
    type: Types.ObjectId
  },
  scores: {
    type: Number
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  status: {
    type: ProposalStatus,
    default: ProposalStatus.Send
  }
})

export default model<ProposalInterface>('proposal', ProposalSchema)