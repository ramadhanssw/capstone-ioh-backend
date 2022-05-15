import { Request, Response } from "express"
import { Types } from "mongoose"
import AnnouncementInterface, { AnnouncementStatus } from "../../interfaces/documents/AnnouncementInterface"
import { Privilege } from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import Announcement from "../../schemas/Announcement"
import User from "../../schemas/User"

interface SubmitAnnouncementBody {
  title: string
  content: string
  dateStart: string
  dateEnd: string
  status: AnnouncementStatus
}

export async function SubmitAnnouncement(req: Request, res: Response) {
  const {
    id = undefined
  } = req.params as Record<string, string>
  
  const {
    title,
    content,
    dateStart,
    dateEnd,
    status
  } = req.body as SubmitAnnouncementBody

  const { user } = res.locals

  try {
    const foundAnnouncement = await Announcement.findOne({
      _id: Types.ObjectId(id)
    })

    const announcement = foundAnnouncement ?? new Announcement()
    
    announcement.writer = user._id
    announcement.title = title
    announcement.content = content
    announcement.status = status
    
    announcement.displayDate = {
      start: new Date(dateStart),
      end: new Date(dateEnd)
    }

    await announcement.save()

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

export function RemoveAnnouncement(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Announcement.findOneAndDelete({_id: Types.ObjectId(id)})
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

export function AnnouncementData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Announcement.findOne({_id: Types.ObjectId(id)})
      .then(announcement =>
        res.json(<APIResponse<{announcement: AnnouncementInterface}>>{
          success: true,
          message: {
            announcement: announcement
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

export default function AnnouncementList(req: Request, res: Response) {
  const { user } = res.locals

  try {

    const aggregateQuery = [
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'writer',
          foreignField: '_id',
          as: 'writer'
        }
      },
      {
        $unwind: {
          path: '$writer'
        }
      },
      {
        $project: {
          title: '$title',
          content: '$content',
          writer: '$writer.fullname',
          writerId: '$writer._id',
          displayDate: '$displayDate',
          status: '$status'
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ]

    Announcement.aggregate(aggregateQuery)
      .then(announcements =>
        res.json(<APIResponse<{announcements: Array<AnnouncementInterface>}>>{
          success: true,
          message: {
            announcements: announcements
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