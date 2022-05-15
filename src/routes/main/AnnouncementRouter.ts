import { Router } from "express"
import AnnouncementList, { AnnouncementData, RemoveAnnouncement, SubmitAnnouncement } from "../../actions/main/Announcement"

const AnnouncementRouter = Router()

AnnouncementRouter.post(['/:id', '/'], SubmitAnnouncement)

AnnouncementRouter.delete('/:id', RemoveAnnouncement)

AnnouncementRouter.get('/:id', AnnouncementData)
AnnouncementRouter.get('/', AnnouncementList)

export default AnnouncementRouter