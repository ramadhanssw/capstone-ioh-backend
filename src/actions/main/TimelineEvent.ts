import { Request, Response } from "express"
import { Types } from "mongoose"
import TimelineEventInterface, { TimelineEventStatus } from "../../interfaces/documents/TimelineEventInterface"
import { Privilege } from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import TimelineEvent from "../../schemas/TimelineEvent"
import User from "../../schemas/User"

interface SubmitTimelineEventBody {
  title: string
  description: string
  participants: Array<string>
  stepIndex: string
  startedAt: string
  finishedAt: string
  status: TimelineEventStatus
}

export async function SubmitTimelineEvent(req: Request, res: Response) {
  const {
    id = undefined
  } = req.params as Record<string, string>

  const { timeline } = req.query as Record<string, string>

  const {
    title,
    description,
    participants,
    stepIndex,
    startedAt,
    finishedAt,
    status
  } = req.body as SubmitTimelineEventBody

  try {
    const foundTimelineEvent = await TimelineEvent.findOne({
      _id: Types.ObjectId(id)
    })

    const timelineEvent = foundTimelineEvent ?? new TimelineEvent()

    if (title) {
      timelineEvent.timeline = Types.ObjectId(timeline)
      timelineEvent.title = title
      timelineEvent.description = description
      timelineEvent.status = status
      timelineEvent.stepIndex = parseInt(stepIndex)
      timelineEvent.startedAt = new Date(startedAt)
      timelineEvent.finishedAt = new Date(finishedAt)
    }

    if (participants) {
      let participantsId: Array<Types.ObjectId> = []
      participants.map((participant) => participantsId.push(Types.ObjectId(participant)))
      timelineEvent.participants = participantsId
    }

    await timelineEvent.save()

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

export function RemoveTimelineEvent(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    TimelineEvent.findOneAndDelete({ _id: Types.ObjectId(id) })
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

export function TimelineEventData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    TimelineEvent.findOne({ _id: Types.ObjectId(id) })
      .then(timelineEvent =>
        res.json(<APIResponse<{ timelineEvent: TimelineEventInterface }>>{
          success: true,
          message: {
            timelineEvent: timelineEvent
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

export default function TimelineEventList(req: Request, res: Response) {
  const { timeline } = req.query as Record<string, string>

  try {
    const aggregateQuery = [
      {
        $match: {
          timeline: Types.ObjectId(timeline)
        }
      },
      {
        $project: {
          _id: '$_id',
          title: '$title',
          timeline: '$timeline',
          stepIndex: '$stepIndex',
          description: '$description',
          startedAt: '$startedAt',
          finishedAt: '$finishedAt',
          createdAt: '$createdAt',
          status: '$status'
        }
      }
    ]

    TimelineEvent.aggregate(aggregateQuery)
      .then(timelineEvents =>
        res.json(<APIResponse<{ timelineEvents: Array<TimelineEventInterface> }>>{
          success: true,
          message: {
            timelineEvents: timelineEvents
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