import BCrypt from 'bcrypt'
import { Request, Response } from "express"
import fs from 'fs'
import path from 'path'
import sanitize from 'sanitize-filename'
import { firestore } from '../../app'
import UserInterface, {
  Privilege, UserStatus
} from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import { StorageProvider, StoreFile } from '../../modules/Storage'

export function UpdateUserData(req: Request, res: Response): void {
  const { id } = req.params
  const { fullname, address, password } = req.body
  const photo = req.file

  firestore.collection('users').doc(id).get().then(async userResult => {
    if (!userResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found',
        error: null
      })

      return
    }

    const userData = {
      id: userResult.id,
      ...userResult.data()
    } as UserInterface

    if (fullname) {
      userData.fullname = fullname
    }

    if (address) {
      userData.meta.address = address
    }

    if (password !== undefined && password.length > 4) {
      userData.password = BCrypt.hashSync(password, 10)
    }

    if (photo !== undefined) {
      const fileName = `profile-pict-${Date.now()}-${sanitize(photo.originalname)}`
      const dirPath = path.join(__dirname, `../../../public/uploads/${String(userData.id)}`)

      const filePath = {
        local: photo.path,
        public: path.join(`/uploads/${String(userData.id)}/${fileName}`)
      }

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }

      const publicUrl = await StoreFile(filePath.public, filePath.local, StorageProvider.Firebase)

      userData.photo = publicUrl

      firestore.collection('users').doc(id).update({
        ...userData
      }).then(() => {
        res.json(<APIResponse<{ user: UserInterface }>>{
          success: true,
          message: 'Ok'
        })
        return
      })
    } else {
      firestore.collection('users').doc(id).update({
        ...userData
      }).then(() => {
        res.json(<APIResponse<{ user: UserInterface }>>{
          success: true,
          message: 'Ok'
        })
        return
      })
    }
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}


export function UserPhoto(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('users').doc(id).get().then(userResult => {
    const user = userResult.data() as UserInterface

    if (user === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found',
        error: null
      })

      return
    }

    let url = "/profile.png"

    if (user.photo) {
      url = user.photo
    }

    res.sendFile(path.resolve(__dirname, '../../../public' + url))
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export function UserData(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('users').doc(id).get().then(userResult => {
    if (!userResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found',
        error: null
      })

      return
    }

    const user = {
      id: userResult.id,
      ...userResult.data()
    } as UserInterface

    res.json(<APIResponse<{ user: UserInterface }>>{
      success: true,
      data: {
        user: user
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

export async function SubmitUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const {
    fullname,
    email,
    password,
    phone,
    status
  } = req.body

  try {
    let foundUser: UserInterface | null = null

    if (id) {
      const userResult = await firestore.collection('users').doc(id).get()

      if (userResult.exists) {
        foundUser = {
          id: userResult.id,
          ...userResult.data()
        } as UserInterface
      }
    }

    const user: UserInterface = foundUser ?? {
      fullname: '',
      email: '',
      password: '',
      meta: {

      },
      privilege: Privilege.User,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: UserStatus.Active,
    } as UserInterface

    if (password && password.length > 4) {
      user.password = BCrypt.hashSync(password, 10)
    }

    user.email = email
    user.fullname = fullname
    user.status = status
    user.privilege = Privilege.User

    if (phone) {
      user.meta.phone = phone
    }

    if (foundUser) {
      await firestore.collection('users').doc(id).update(user)
    } else {
      await firestore.collection('users').add(user)
    }

    res.json(<APIResponse>{
      success: true,
      message: 'ok'
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export function RemoveUser(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('users').doc(id).delete().then(deletedUser => {
    if (deletedUser === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found',
        error: null
      })

      return
    }

    res.json(<APIResponse>{
      success: true,
      message: 'ok'
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export function UserList(req: Request, res: Response): void {
  firestore.collection('users').get().then(usersResult => {
    const users: Array<UserInterface> = []

    usersResult.docs.map((user) => users.push({
      id: user.id,
      ...user.data(),
    } as UserInterface))

    res.json(<APIResponse<{ users: Array<UserInterface> }>>{
      success: true,
      data: {
        users: users
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

export async function SubmitAdmin(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const { fullname, email, password, status } = req.body
  let state = 'update'

  try {
    let admin: UserInterface | null = {
      id: '',
      fullname: '',
      email: '',
      password: '',
      privilege: Privilege.Admin,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: UserStatus.Active
    } as UserInterface

    if (id) {
      let adminResult = await firestore.collection('users').doc(id).get()

      if (!adminResult.exists) {
        state = 'new'
        admin = {
          id: adminResult.id,
          ...adminResult.data()
        } as UserInterface
      }
    }

    if (password && password.length > 4) {
      admin!.password = BCrypt.hashSync(password, 10)
    }

    admin!.fullname = fullname
    admin!.email = email
    admin!.status = status

    //const savedAdmin = await admin.save()

    res.json(<APIResponse<{ administrator: UserInterface }>>{
      success: true,
      data: {
        //administrator: savedAdmin
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

export function RemoveAdmin(req: Request, res: Response): void {
  const { id } = req.params
  const { user } = req.body

  firestore.collection('users').doc(id).delete().then(deletedAdmin => {
    if (deletedAdmin === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'Admin data not found',
        error: null
      })

      return
    }

    res.json(<APIResponse>{
      success: true,
      message: 'ok'
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export function AdminData(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('users').doc(id).get().then((adminResult) => {
    if (!adminResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'Admin data not found',
      })
      return
    }

    res.json(<APIResponse<{ administrator: UserInterface }>>{
      success: true,
      data: {
        administrator: {
          id: adminResult.id,
          ...adminResult.data()
        } as UserInterface
      }
    })
    return
  }).catch((err) => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export function AdminList(req: Request, res: Response): void {
  firestore.collection('users').where('privilege', '==', Privilege.Admin).get().then(adminsResult => {
    let admins: Array<UserInterface> = []

    adminsResult.docs.map((adminResult) => {
      admins.push({
        id: adminResult.id,
        ...adminResult.data()
      } as UserInterface)
    })

    res.json(<APIResponse<{ administrators: Array<UserInterface> }>>{
      success: true,
      data: {
        administrators: admins
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

export async function UpdateFCMToken(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const { fcmToken } = req.body

  try {
    const userResult = await firestore.collection('users').doc(id).get()
    if (!userResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found',
        error: null
      })

      return
    }

    const user = {
      id: userResult.id,
      ...userResult.data()
    } as UserInterface

    user.meta = {
      ...user.meta,
      fcmToken: fcmToken
    }

    //await user.save()

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