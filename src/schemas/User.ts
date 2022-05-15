import { model, Schema, Types } from "mongoose"
import UserInterface, {
  EmploymentStatus,
  Gender,
  InitialStatus,
  MaritalStatus,
  Privilege,
  Religion,
  StaffPrivilegeAccess,
  UserStatus
} from "../interfaces/documents/UserInterface"

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
  meta: {
    NIK: String,
    NPWP: String,
    address: String,
    gender: {
      type: Gender
    },
    maritalStatus: {
      type: MaritalStatus
    },
    religion: {
      type: Religion,
      required: false,
      default: Religion.Other
    },
    department: {
      type: Types.ObjectId
    },
    NIP: String,
    NUPTK: String,
    NIPD: String,
    NISN: String,
    SKHUN: String,
    employmentStatus: {
      type: EmploymentStatus
    },
    employmentGroup: String,
    fieldOfStudy: String,
    birthDate: String,
    birthplace: String,
    parent: {
      type: Types.ObjectId
    },
    initialStatus: {
      type: InitialStatus
    },
    batchYear: Number,
    specialNeeds: String,
    phone: [String],
    fcmToken: [String],
    fcmTopic: [String]
  },
  privilege: {
    type: Privilege,
    required: true
  },
  staffPrivilegeAccess: [{
    type: String
  }],
  updatedAt: {
    default: new Date(),
    type: Date,
    required: true
  },
  createdAt: {
    default: new Date(),
    type: Date,
    required: true
  },
  status: {
    type: UserStatus,
    required: true,
    default: UserStatus.Inactive
  }
})

UserSchema.index({email: 1})
UserSchema.index({'meta.department': 1})

export default model<UserInterface>('user', UserSchema)