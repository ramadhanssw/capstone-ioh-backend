import BCrypt from 'bcrypt'
import { Request, Response } from "express"
import fs from 'fs'
import JWT from 'jsonwebtoken'
import path from 'path'
import DepartmentInterface, { DepartmentStatus } from '../interfaces/documents/DepartmentInterface'
import UserInterface, { Privilege, UserStatus } from "../interfaces/documents/UserInterface"
import { APIResponse } from "../interfaces/response"
import Department from '../schemas/Department'
import User from "../schemas/User"
import fetch, { RequestInit } from 'node-fetch'
import { FilterQuery, LeanDocument, Types } from 'mongoose'
import RedisCacheClient from '../redis-client'

async function VerifyUserDepartment(user: UserInterface): Promise<boolean> {
  if (user.privilege === Privilege.Admin) {
    return true
  }
  
  const department = await Department.findOne({_id: user.meta?.department})
  return department?.status === DepartmentStatus.Active
}

async function GetDepartmentData(department?: Types.ObjectId): Promise<LeanDocument<DepartmentInterface>|undefined> {
  if (!department) {
    return undefined
  }

  return new Promise<LeanDocument<DepartmentInterface>>((resolve, reject) => {
    const cacheKey = `department-${department}`

        RedisCacheClient.get(cacheKey, async (err, data) => {
          try {
            if (err !== null || data === null) {
              const departmentData = await Department.findOne({_id: department}).lean(true)

              if (departmentData === null) {
                reject('Department not found!')
                return
              }

              RedisCacheClient.set(cacheKey, JSON.stringify(departmentData))
              resolve(departmentData)
              return
            }

            resolve(JSON.parse(data) as LeanDocument<DepartmentInterface>)
          } catch (err) {
            reject(err)
          }
        })
  })
}

export function MSAuth(req: Request, res: Response): void {
  const { accessToken } = req.body

  const reqInit = <RequestInit>{
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }

  fetch('https://graph.microsoft.com/v1.0/me', reqInit)
    .then(result => result.json())
    .then(async (response) => {
      if (response.error) {
        throw new Error('JWT token invalid')
      }

      const userFilterQuery: FilterQuery<UserInterface> = {
        email: response.mail.toLowerCase()
      }

      const user = await User.findOne(userFilterQuery)

      if (user === null) {
        throw new Error('User not found')
      }

      const token = JWT.sign(String(user._id), fs.readFileSync(path.join(__dirname, '../../private.key')), <JWT.SignOptions>{
        algorithm: 'PS256'
      })

      let endpoint = '/'

      switch (user.privilege) {
        case Privilege.Admin:
          endpoint = '/admin'
          break

        case Privilege.Staff:
          endpoint = '/staff'
          break

        case Privilege.Reviewer:
          endpoint = '/teacher'
          break
      }

      const department = await GetDepartmentData(user.meta.department)

      interface MessageResponseInterface {
        token: string
        msToken: string
        endpoint: string
      }

      res.json(<APIResponse<MessageResponseInterface>>{
        success: true,
        message: {
          token: token,
          msToken: accessToken,
          endpoint: endpoint,
        }
      })
    })
    .catch(err => {
      res.json(<APIResponse>{
        success: false,
        message: 'Token invalid',
        error: null
      })
    })
}

export default function AuthController(req: Request, res: Response): void {
  const { email, password } = req.body as Record<string, string>

  const accountMissmatch: APIResponse = {
    success: false,
    message: 'Email or password missmatch'
  }

  const userFilterQuery: FilterQuery<UserInterface> = {
    email: email.toLowerCase(),
    status: UserStatus.Active
  }

  User.findOne(userFilterQuery).then(async user => {
    if (user === null) {
      res.json(accountMissmatch)
      return
    }

    BCrypt.compare(password, user.password, async (err, valid) => {
      if (!valid) {
        res.json(accountMissmatch)
        return
      }
      
      const jwt = JWT.sign(String(user._id), fs.readFileSync(path.join(__dirname, '../../private.key')), <JWT.SignOptions>{
        algorithm: 'PS256'
      })

      let endpoint = '/'

      switch (user.privilege) {
        case Privilege.Admin:
          endpoint = '/admin'
          break

        case Privilege.Staff:
          endpoint = '/staff'
          break

          case Privilege.Reviewer:
            endpoint = '/reviewer'
            break

        default:
      }

      const department = await GetDepartmentData(user.meta.department)

      interface MessageReponseInterface {
        token: string
        endpoint: string
      }

      res.json(<APIResponse<MessageReponseInterface>>{
        success: true,
        message: {
          token: jwt,
          endpoint: endpoint,
        }
      })
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}