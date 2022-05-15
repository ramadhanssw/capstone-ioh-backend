import { Router } from "express"
import TimelineEventRouter from './../main/TimelineEventRouter'
import TimelineList, { TimelineData, RemoveTimeline, SubmitTimeline } from "../../actions/main/Timeline"

const TimelineRouter = Router()

TimelineRouter.post(['/:id', '/'], SubmitTimeline)

TimelineRouter.delete('/:id', RemoveTimeline)

TimelineRouter.get('/:id', TimelineData)
TimelineRouter.get('/', TimelineList)

export default TimelineRouter