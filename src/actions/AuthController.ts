import BCrypt from 'bcrypt'
import { Request, Response } from "express"
import fs from 'fs'
import JWT from 'jsonwebtoken'
import { FilterQuery } from 'mongoose'
import path from 'path'
import firebase from 'firebase-admin'
import { firestore } from '../app'
import UserInterface, { Privilege, UserStatus } from "../interfaces/documents/UserInterface"
import { APIResponse } from '../interfaces/response'

export default async function AuthController(req: Request, res: Response) {
  const { email, password } = req.body as Record<string, string>

  const firestore = firebase.firestore()

  const accountMissmatch: APIResponse = {
    success: false,
    message: 'Email or password missmatch'
  }

  const userResult = await firestore.collection('users').where('email', '==', email).get()
  
  if (userResult.docs.length == 0) {
    res.json(accountMissmatch)
    return
  }

  const user = {
    id: userResult.docs[0].id,
    ...userResult.docs[0].data() 
  } as UserInterface

  BCrypt.compare(password, user.password, async (err, valid) => {
    if (!valid) {
      res.json(accountMissmatch)
      return
    }
  })
  
  const jwt = JWT.sign(String(user.id), fs.readFileSync(path.join(__dirname, '../../private.key')), <JWT.SignOptions>{
      algorithm: 'PS256'
  })

  let endpoint = '/'
  switch (user.privilege) {
    case Privilege.Admin:
      endpoint = '/admin'
      break
    case Privilege.User:
      endpoint = '/user'
      break
    default:
  }
  interface MessageReponseInterface {
    token: string
    endpoint: string
  }

  res.json(<APIResponse<MessageReponseInterface>>{
    success: true,
    data: {
      token: jwt,
      endpoint: endpoint,
    }
  })

  return
}