import dotenv from 'dotenv'
import { NextFunction, Request, Response } from "express"
import fs from 'fs'
import JWT from 'jsonwebtoken'
import path from 'path'
import { firestore } from './app'
import UserInterface, { Privilege } from "./interfaces/documents/UserInterface"
import { APIResponse } from "./interfaces/response"

dotenv.config()

const DEFAULT_SITE = process.env.DEFAULT_SITE

const unauthorizedResponse = <APIResponse>{
  success: false,
  message: 'User not authorized',
  error: null
}

export function CORS(req: Request, res: Response, next: NextFunction) {
  const { origin } = req.headers

  res.set('Access-Control-Allow-Origin', origin ?? DEFAULT_SITE)
  res.set('Access-Control-Allow-Headers', 'authorization')
  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
  
  next()
}

export function Authentication(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers
  const token = authorization?.substring(7)

  if (!token) {
    res.json(<APIResponse>{
      success: false,
      message: 'User not authorized'
    })

    return
  }

  try {
    const id = JWT.verify(token, fs.readFileSync(path.join(__dirname, '../private.key')), <JWT.VerifyOptions>{
      algorithms: ['PS256']
    })

    firestore.collection('users').doc(id as string).get().then(async userResult => {
      if (!userResult.exists) {
        res.json(unauthorizedResponse)
        return
      }

      const user = {
        id: userResult.id,
        ...userResult.data()
      } as UserInterface

      res.locals.user = user
      next()
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'User not authorized',
      error: (err as Error).message
    })
  }
}

export function IsAdmin({res, next}: {res: Response, next: NextFunction}): void {
  const { user } = res.locals
    
  if (user.privilege !== Privilege.Admin) {
    res.json(<APIResponse>{
      success: false,
      message: 'Only admin that can use this API'
    })
    
    return
  }

  next()
}

export function IsUser({res, next}: {res: Response, next: NextFunction}): void {
  const { user } = res.locals

  if (user.privilege != Privilege.User) {
    res.json(<APIResponse>{
      success: false,
      message: 'Only user that can use this API'
    })

    return
  }

  next()
}