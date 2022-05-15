import { Document, Types } from "mongoose"

export enum TimelineEventStatus {
  Publish = 'publish',
  Draft = 'draft'
}

export enum TimelineEventType {
  Selection = "selection",
  ProgramPlanning = "program_planning",
  FundDisbursement = "fund_disbursement",
  ReportAndSPJ = "report_and_spj",
  Monitoring = "report_and_spj",
  AchievementIKU = "achievement_iku"
}

export enum TimelineEventTypeName {
  Selection = "Seleksi",
  ProgramPlanning = "Perencanaan Program",
  FundDisbursement = "Pencairan Dana",
  ReportAndSPJ = "Pelaporan dan SPJ",
  MonitoringAndEvaluation = "Monitoring dan Evaluasi",
  AchievementIKU = "Pencapaian IKU"
}

export default interface TimelineEventInterface extends Document {
  timeline: Types.ObjectId
  type: TimelineEventType
  participants: Array<Types.ObjectId>
  title: string
  description: string
  createdAt: Date
  startedAt: Date
  finishedAt: Date
  stepIndex: number
  status: TimelineEventStatus
}