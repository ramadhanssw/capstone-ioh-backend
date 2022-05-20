import { Router } from "express"
import multer from "multer"
import os from 'os'
import {
  RemoveTrashReport,
  TrashReportData,
  TrashReportList,
  SubmitTrashReport,
  UpdateTrashReportStatus
} from "../../actions/main/TrashReport"

const upload = multer({
  dest: os.tmpdir()
})

const TrashReport = Router()

TrashReport.post('/:id/status', UpdateTrashReportStatus)
TrashReport.post('/:id', upload.array('photos'), SubmitTrashReport)
TrashReport.post('/', upload.array('photos'), SubmitTrashReport)

TrashReport.get('/:id', TrashReportData)
TrashReport.get('/', TrashReportList)

TrashReport.delete('/:id', RemoveTrashReport)

export const TrashReportRouter = TrashReport