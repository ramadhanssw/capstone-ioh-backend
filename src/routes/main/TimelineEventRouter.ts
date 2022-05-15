import { Router } from "express"
import TimelineEventList, { TimelineEventData, RemoveTimelineEvent, SubmitTimelineEvent } from "../../actions/main/TimelineEvent"

const TimelineEventRouter = Router()

TimelineEventRouter.post(['/:id', '/'], SubmitTimelineEvent)

TimelineEventRouter.delete('/:id', RemoveTimelineEvent)

TimelineEventRouter.get('/:id', TimelineEventData)
TimelineEventRouter.get('/', TimelineEventList)

export default TimelineEventRouter