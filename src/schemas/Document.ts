import { model, Schema, Types } from "mongoose"
import DocumentInterface, { DocumentStatus } from "../interfaces/documents/DocumentInterface"

const DocumentSchema = new Schema({
  createdBy: {
    type: Types.ObjectId,
    required: true
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
  createdAt: {
    type: Date,
    default: new Date()
  },
  status: {
    type: DocumentStatus,
    default: DocumentStatus.Draft
  }
})

export default model<DocumentInterface>('document', DocumentSchema)