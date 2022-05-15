import { Request, Response } from "express"
import { Types } from "mongoose"
import fs from 'fs'
import ProposalInterface, { ProposalStatus } from "../../interfaces/documents/ProposalInterface"
import { Privilege } from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import { StoreFile } from "../../modules/Storage"
import Proposal from "../../schemas/Proposal"
import User from "../../schemas/User"
import Department from "../../schemas/Department"
import Timeline from "../../schemas/Timeline"
import TimelineEvent from "../../schemas/TimelineEvent"
import { TimelineParticipantType } from "../../interfaces/documents/TimelineInterface"
import sanitize from "sanitize-filename"

interface SubmitProposalBody {
  timelineEvent: string
  department: string
  title: string
  description: string
  comment: string
  scores: number
  status: ProposalStatus
}

export async function SubmitProposal(req: Request, res: Response) {
  const {
    id = undefined
  } = req.params as Record<string, string>

  const {
    timelineEvent,
    title,
    description,
    scores,
    comment,
    status
  } = req.body as SubmitProposalBody

  const file = req.file

  const { user } = res.locals

  try {
    const foundProposal = await Proposal.findOne({
      _id: Types.ObjectId(id)
    })

    const proposal = foundProposal ?? new Proposal()

    if (title) {
      proposal.timelineEvent = Types.ObjectId(timelineEvent)
      proposal.department = user.meta.department
      proposal.createdBy = user._id
      proposal.title = title
      proposal.description = description
    }

    if (comment) {
      proposal.comment = comment
      proposal.reviewer = user._id
    }

    if (scores) {
      proposal.scores = scores
    }

    if (status) {
      proposal.status = status

      if (status == ProposalStatus.Approve) {
        const timelineEvent = await TimelineEvent.findOne({ _id: proposal.timelineEvent })
        const timeline = await Timeline.findOne({ _id: timelineEvent?.timeline })
        const nextTimelineEvent = await TimelineEvent.findOne({ timeline: timelineEvent?.timeline, stepIndex: (timelineEvent?.stepIndex ?? 0) + 1 })

        if (nextTimelineEvent) {
          if (timeline?.participantType == TimelineParticipantType.Department) {
            if (!nextTimelineEvent?.participants.includes(proposal.department)) {
              const participant = await Department.findOne({ _id: proposal.department })
              nextTimelineEvent?.participants.push(participant!._id)
            }
          } else {
            if (!nextTimelineEvent?.participants.includes(proposal.createdBy)) {
              const participant = await User.findOne({ _id: proposal.createdBy })
              nextTimelineEvent?.participants.push(participant?._id)
            }
          }

          await nextTimelineEvent.save()
        }
      }
    }

    if (file) {
      const timestamp = Date.now()

      const tmpPath = `${"public/uploads"}/proposal-${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9\ \.]/g, '')}`

      fs.writeFileSync(tmpPath, file.buffer)

      proposal.file = await StoreFile(
        null,
        `proposal/proposal-${timestamp}-${sanitize(file.originalname)}`,
        tmpPath,
        "local"
      )
    }

    await proposal.save()

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

export function RemoveProposal(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Proposal.findOneAndDelete({ _id: Types.ObjectId(id) })
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

export function ProposalData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Proposal.findOne({ _id: Types.ObjectId(id) })
      .then(proposal =>
        res.json(<APIResponse<{ proposal: ProposalInterface }>>{
          success: true,
          message: {
            proposal: proposal
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

export function ProposalListByEvent(req: Request, res: Response) {
  const { user } = res.locals
  const { event } = req.params as Record<string, string>

  let matchQuery = {}

  if (user.privilege == Privilege.Staff) {
    matchQuery = {
      timelineEvent: Types.ObjectId(event),
      department: user.meta.department
    }
  } else {
    matchQuery = {
      timelineEvent: Types.ObjectId(event),
    }
  }

  const aggregateQuery = [
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: Department.collection.collectionName,
        localField: 'department',
        foreignField: '_id',
        as: 'department'
      }
    },
    {
      $unwind: {
        path: '$department'
      }
    },
    {
      $lookup: {
        from: User.collection.collectionName,
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy'
      }
    },
    {
      $unwind: {
        path: '$createdBy'
      }
    },
    {
      $lookup: {
        from: User.collection.collectionName,
        localField: 'reviewer',
        foreignField: '_id',
        as: 'reviewer'
      }
    },
    {
      $project: {
        title: '$title',
        department: '$department.title',
        departmentId: '$department._id',
        description: '$description',
        reviewer: '$reviewer.fullname',
        reviewerId: '$reviewer._id',
        file: '$file',
        scores: '$scores',
        comment: '$comment',
        status: '$status',
        createdBy: '$createdBy.fullname',
        createdById: '$createdBy._id',
        createdAt: '$createdAt'
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ]

  try {
    Proposal.aggregate(aggregateQuery)
      .then(proposals => {
        res.json(<APIResponse<{ proposals: Array<ProposalInterface> }>>{
          success: true,
          message: {
            proposals: proposals
          }
        })
        return
      }
      )
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export default function ProposalList(req: Request, res: Response) {
  try {

    const aggregateQuery = [

      {
        $lookup: {
          from: Department.collection.collectionName,
          localField: 'department',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department'
        }
      },
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      {
        $unwind: {
          path: '$createdBy'
        }
      },
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'reviewer',
          foreignField: '_id',
          as: 'reviewer'
        }
      },
      {
        $project: {
          title: '$title',
          department: '$department.title',
          departmentId: '$department._id',
          description: '$description',
          reviewer: '$reviewer.fullname',
          reviewerId: '$reviewer._id',
          file: '$file',
          scores: '$scores',
          comment: '$comment',
          status: '$status',
          createdBy: '$createdBy.fullname',
          createdById: '$createdBy._id',
          createdAt: '$createdAt'
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ]

    Proposal.aggregate(aggregateQuery)
      .then(proposals =>
        res.json(<APIResponse<{ proposals: Array<ProposalInterface> }>>{
          success: true,
          message: {
            proposals: proposals
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