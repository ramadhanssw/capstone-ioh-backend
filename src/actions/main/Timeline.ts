import { Request, Response } from "express"
import { Types } from "mongoose"
import { TimelineEventType, TimelineEventTypeName } from "../../interfaces/documents/TimelineEventInterface"
import TimelineInterface, { TimelineParticipantType, TimelineStatus } from "../../interfaces/documents/TimelineInterface"
import { APIResponse } from "../../interfaces/response"
import Timeline from "../../schemas/Timeline"
import TimelineEvent from "../../schemas/TimelineEvent"

interface SubmitTimelineBody {
  title: string
  description: string
  participantType: TimelineParticipantType
  status: TimelineStatus
}

export async function SubmitTimeline(req: Request, res: Response) {
  const {
    id = undefined
  } = req.params as Record<string, string>
  
  const {
    title,
    description,
    participantType,
    status
  } = req.body as SubmitTimelineBody

  try {
    const foundTimeline = await Timeline.findOne({
      _id: Types.ObjectId(id)
    })

    const timeline = foundTimeline ?? new Timeline()
    
    timeline.title = title
    timeline.description = description
    timeline.participantType = participantType
    timeline.status = status

    await timeline.save()

    const timelineEventTypeList = Object.values(TimelineEventType)
    const timelineEventTypeNameList = Object.values(TimelineEventTypeName)

    await Promise.all(timelineEventTypeList.map(async (timelineEventType, index) => {
      const timelineEvent = new TimelineEvent()
      timelineEvent.timeline = timeline._id
      timelineEvent.title = timelineEventTypeNameList[index]
      timelineEvent.description = timelineEventTypeNameList[index]
      timelineEvent.type = timelineEventType
      timelineEvent.participants = []
      timelineEvent.stepIndex = index
      timelineEvent.startedAt = new Date()
      timelineEvent.finishedAt = new Date()

      await timelineEvent.save()
    }))

    res.json(<APIResponse>{
      success: true,
      message: 'Ok'
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export function RemoveTimeline(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Timeline.findOneAndDelete({_id: Types.ObjectId(id)})
      .then(() =>
        res.json(<APIResponse>{
          success: true,
          message: 'Ok'
        })
      )
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export function TimelineData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Timeline.findOne({_id: Types.ObjectId(id)})
      .then((timeline: TimelineInterface | null) =>
        res.json(<APIResponse<{timeline: TimelineInterface}>>{
          success: true,
          message: {
            timeline: timeline
          }
        })
      )
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export default function TimelineList(req: Request, res: Response) {
  try {

    const aggregateQuery = [
      {
        $project: {
          title: '$title',
          description: '$description',
          participantType: '$participantType',
          createdAt: '$createdAt',
          status: '$status'
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ]

    Timeline.aggregate(aggregateQuery)
      .then((timelines: Array<TimelineInterface>) =>
        res.json(<APIResponse<{timelines: Array<TimelineInterface>}>>{
          success: true,
          message: {
            timelines: timelines
          }
        })
      )
  } catch (err) {
    res.json(<APIResponse>({
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    }))
  }
}