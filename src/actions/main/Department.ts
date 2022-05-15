import dotenv from 'dotenv'
import { Request, Response } from "express"
import fastFolderSize from "fast-folder-size"
import fs from 'fs'
import { Types } from "mongoose"
import os from 'os'
import path from 'path'
import sharp from "sharp"
import DepartmentInterface, { DepartmentStatus } from "../../interfaces/documents/DepartmentInterface"
import { Privilege } from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import { StoreFile } from "../../modules/Storage"
import Department from "../../schemas/Department"
import User from "../../schemas/User"
import Proposal from "../../schemas/Proposal"

dotenv.config()

const ADMINISTRATOR_PIN = process.env.ADMINISTRATOR_PIN

export async function SubmitDepartment(req: Request, res: Response): Promise<void> {
  const { user } = res.locals
  const { department = undefined } = req.params

  const {
    title,
    description,
    address,
    website,
    email,
    phone,
    accentColor,
    radius
  } = req.body as Record<string, string>

  const status = req.body.status as DepartmentStatus
  const files = req.files as {[fieldname: string]: Express.Multer.File[]}
  
  try {
    const foundDepartment = await Department.findOne({_id: department})
    const departmentData = foundDepartment ?? new Department()

    if (user.privilege === Privilege.Admin) {
      departmentData.title = title
    }

    departmentData.description = description
    
    departmentData.accentColor = accentColor
    departmentData.website = website
    departmentData.email = email
    departmentData.phone = phone
    departmentData.status = status

    await departmentData.save()

    if (files !== undefined) {
      const {
        icon: favicon,
        logoWide,
        logoSquare
      } = files

      if (favicon?.length === 1) {
        const iconList = [
          {title: 'favicon.ico', width: 16, height: 16},
          {title: 'favicon-16x16.png', width: 16, height: 16},
          {title: 'favicon-32x32.png', width: 32, height: 32},
          {title: 'favicon-96x96.png', width: 96, height: 96},
          {title: 'favicon-192x192.png', width: 192, height: 192},
          {title: 'ms-icon-144x144.png', width: 144, height: 144}
        ]
  
        const iconResponse = await Promise.all(iconList.map(icon => new Promise<string>((resolve, reject) => {
          const tmpPath = path.join(os.tmpdir(), `/tmp-${Date.now()}-${icon.title}`)
  
          sharp(favicon[0].buffer)
            .resize(icon.width, icon.height, {
              withoutEnlargement: true,
              fit: 'contain',
              background: 'rgba(0, 0, 0, 0)'
            })
            .png()
            .toFile(tmpPath, err => {
              if (err) {
                reject(err)
              }

              StoreFile(departmentData.id, `icon/${icon.title}`, tmpPath, 'local')
                .then(resolve)
                .catch(reject)
            })
        })))

        departmentData.appIcon = iconResponse[4]
      }

      if (logoWide?.length === 1) {
        const submittedLogoWide = await new Promise<string>((resolve, reject) => {
          const tmpPath = path.join(os.tmpdir(), `/tmp-${Date.now()}-logoWide-${departmentData.id}`)
          
          sharp(logoWide[0].buffer)
            .resize(500, 110, {
              withoutEnlargement: true,
              fit: 'contain',
              background: 'rgba(0, 0, 0, 0)'
            })
            .png()
            .toFile(tmpPath, err => {
              if (err) {
                reject(err)
              }

              StoreFile(departmentData.id, `assets/logo-wide.png`, tmpPath, 'local')
                .then(resolve)
                .catch(reject)
            })
        })

        departmentData.logoWide = submittedLogoWide
      }

      if (logoSquare?.length === 1) {
        const submittedLogoSquare = await new Promise<string>((resolve, reject) => {
          const tmpPath = path.join(os.tmpdir(), `/tmp-${Date.now()}-logoSquare-${departmentData.id}`)

          sharp(logoSquare[0].buffer)
            .resize(480, 480, {
              withoutEnlargement: true,
              fit: 'contain',
              background: 'rgba(0, 0, 0, 0)'
            })
            .png()
            .toFile(tmpPath, err => {
              if (err) {
                reject(err)
              }

              StoreFile(departmentData.id, `assets/logo-square.png`, tmpPath, 'local')
                .then(resolve)
                .catch(reject)
            })
        })

        departmentData.logoSquare = submittedLogoSquare
      }

      await departmentData.save()
    }

    res.json(<APIResponse>{
      success: true,
      message: 'Ok'
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export function RemoveDepartment(req: Request, res: Response): void {
  const { department } = req.params
  const { pin } = req.query

  if (String(pin) !== String(ADMINISTRATOR_PIN)) {
    res.json(<APIResponse>{
      success: false,
      message: 'Anda tidak memiliki hak akses untuk melakukan ini'
    })

    return
  }

  // Return the JSON response first then removing data
  res.json(<APIResponse>{
    success: true,
    message: 'OK'
  })

  try {
    const departmentId = Types.ObjectId(department)

    User.find({'meta.department': departmentId})
    Promise.all([
      Department.deleteOne({_id: departmentId}),
      User.deleteMany({'meta.department': departmentId}),
    ])
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!'
    })
  }
}

export function DepartmentData(req: Request, res: Response): void {
  interface DepartmentCopyInterface extends DepartmentInterface {
    storage: number
  }

  const { department } = req.params

  Department.findOne({_id: Types.ObjectId(department)}).then(async departmentData => {
    if (departmentData === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'Department not found'
      })

      return
    }

    const departmentCopy = departmentData.toObject() as DepartmentCopyInterface
    
    departmentCopy.storage = await new Promise<number>((resolve, reject) => {
      const dir = path.join(__dirname, '../../../public/uploads/', departmentData._id.toString())

      if (!fs.existsSync(dir)) {
        resolve(0)
        return
      }

      fastFolderSize(dir, (err, size) => {
        if (err !== null) {
          reject(err)
          return
        }

        if (size === undefined) {
          reject('Path not found!')
          return
        }

        resolve(size)
      })
    })

    res.json(<APIResponse<{department: DepartmentInterface}>>{
      success: true,
      message: {
        department: departmentCopy
      }
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export async function DepartmentDashboard(req: Request, res: Response): Promise<void> {
  const { department } = req.params
  const { user } = res.locals
  
  try {
    const departmentId = Types.ObjectId(department ?? String(user.meta.department))
  
    if (user.privilege !== Privilege.Admin && String(user.meta?.department ?? '') !== department) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not authorized!'
      })
  
      return
    }
    
    const [
      departmentData,
      staffTotal,
      proposalTotal,
    ] = await Promise.all([
      Department.findOne({_id: departmentId}),
      User.countDocuments({'meta.department': departmentId, privilege: Privilege.Staff}),
      Proposal.countDocuments({department: departmentId}),
    ])

    res.json(<APIResponse<any>>{
      success: true,
      message: {
        department: departmentData,
        summary: {
          staffTotal: staffTotal,
          proposalTotal: proposalTotal,
        },
        currentUserData: user
      }
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export default function DepartmentList({res}: {res: Response}): void {
  Department.find().then(departments => {
    res.json(<APIResponse<{departments: Array<DepartmentInterface>}>>{
      success: true,
      message: {
        departments: departments
      }
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}