import BCrypt from 'bcrypt'
import { Workbook } from 'exceljs'
import { Request, Response } from "express"
import fs from 'fs'
import JWT from 'jsonwebtoken'
import { FilterQuery, Types } from "mongoose"
import path from 'path'
import sanitize from 'sanitize-filename'
import sharp from 'sharp'
import UserInterface, {
  EmploymentStatus,
  Gender,
  MaritalStatus,
  Privilege,
  Religion,
  UserStatus
} from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import Department from '../../schemas/Department'
import User from "../../schemas/User"

const ADMINISTRATOR_PIN = process.env.ADMINISTRATOR_PIN

export function UpdateUserData(req: Request, res: Response): void {
  const { user } = res.locals
  const { fullname, address, password } = req.body
  const photo = req.file

  User.findOne({ _id: user._id }).then(async userData => {
    if (userData === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found',
        error: null
      })

      return
    }

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
      const dirPath = path.join(__dirname, `../../../public/uploads/${String(userData._id)}`)

      const filePath = {
        local: path.join(dirPath, `/${fileName}`),
        public: path.join(`/uploads/${String(userData._id)}/${fileName}`)
      }

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }

      sharp(photo.buffer)
        .resize(200, 200)
        .toFile(filePath.local)

      userData.photo = filePath.public

      await userData.save().then((newUserData) => {
        res.json(<APIResponse<{ user: UserInterface }>>{
          success: true,
          message: {
            user: newUserData
          }
        })
      })
    } else {
      await userData.save().then((newUserData) => {
        res.json(<APIResponse<{ user: UserInterface }>>{
          success: true,
          message: {
            user: newUserData
          }
        })
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
export function UserData(req: Request, res: Response): void {
  const { id } = req.params

  User.findOne({ _id: Types.ObjectId(id) }).then(user => {
    if (user === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found',
        error: null
      })

      return
    }

    res.json(<APIResponse<{ user: UserInterface }>>{
      success: true,
      message: {
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

export function UserPhoto(req: Request, res: Response): void {
  const { id } = req.params

  User.findOne({ _id: Types.ObjectId(id) }).then(user => {
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

export async function ImportStaff(req: Request, res: Response): Promise<void> {
  const { department } = req.params
  const userInitData = new User()
  const staffDocFile = req.file?.buffer

  if (!staffDocFile) {
    res.json(<APIResponse>{
      success: false,
      message: 'File gagal diupload!'
    })

    return
  }

  try {
    const workBook = new Workbook()
    const loadedWorkbook = await workBook.xlsx.load(staffDocFile)
    const [worksheet] = loadedWorkbook.worksheets
    const insertBatch = <Array<Pick<UserInterface, "email" | "password" | "fullname" | "meta" | "privilege" | "status">>>[]
    const updateBatch = <Array<{
      id: Types.ObjectId
      data: Partial<UserInterface>
    }>>[]
    let userData: Pick<UserInterface, "email" | "password" | "fullname" | "meta" | "privilege" | "status">
    let rowArray: Array<string> = []

    for (let i = 2; i <= worksheet.rowCount; i++) {
      rowArray = []

      for (let j = 1; j <= 19; j++) {
        rowArray.push(worksheet.getRow(i).getCell(j).text)
      }

      const [
        id,
        fullname,
        email,
        password,
        gender,
        religion,
        phone,
        address,
        NIP,
        NUPTK,
        fieldOfStudy,
        actionResearchText,
        employmentStatus,
        employmentGroup,
        maritalStatus,
        NIK,
        NPWP,
        privilege,
        status,
        action
      ] = rowArray

      userData = {
        email: email,
        fullname: fullname,
        password: password,
        meta: {
          ...userInitData.meta,
          department: Types.ObjectId(department),
          gender: ((gender: string): Gender => {
            switch (gender) {
              case 'laki-laki':
              case 'pria':
                return Gender.Man

              case 'perempuan':
              case 'wanita':
                return Gender.Woman

              default:
                return Gender.Other
            }
          })(gender.toLowerCase()),
          religion: ((religionText: string): Religion => {
            switch (religionText) {
              case 'islam':
              case 'muslim':
              case 'moeslim':
                return Religion.Islam

              case 'kristen protestan':
              case 'protestan':
                return Religion.ProtestantChristian

              case 'kristen katolik':
              case 'katolik':
                return Religion.CatholicChristian

              case 'budha':
              case 'buddha':
                return Religion.Buddha

              case 'hindu':
                return Religion.Hindu

              case 'konghucu':
                return Religion.Konghucu

              default:
                return Religion.Other
            }
          })(religion.toLowerCase()),
          phone: phone.split(',').map(phoneNumber => phoneNumber.trim()),
          address: address,
          NIP: NIP,
          NUPTK: NUPTK,
          fieldOfStudy: fieldOfStudy,
          employmentStatus: ((employmentStatusText: string): EmploymentStatus => {
            switch (employmentStatusText) {
              case 'gtt':
              case 'guru kontrak':
                return EmploymentStatus.GTT

              case 'honorer':
              case 'guru honorer':
              case 'pegawai kontrak':
              case 'kontrak':
              case 'ptt':
                return EmploymentStatus.PTT

              case 'pns':
                return EmploymentStatus.PNS

              case 'cpns':
                return EmploymentStatus.CPNS

              default:
                return EmploymentStatus.GTT
            }
          })(employmentStatus.toLowerCase()),
          employmentGroup: employmentGroup.toUpperCase(),
          maritalStatus: ((maritalStatusText): MaritalStatus => {
            switch (maritalStatusText) {
              case 'menikah':
              case 'kawin':
                return MaritalStatus.Married

              case 'cerai':
              case 'bercerai':
                return MaritalStatus.Widow

              case 'belum menikah':
              case 'belum kawin':
                return MaritalStatus.Single

              case 'janda':
              case 'duda':
                return MaritalStatus.Widow

              case 'sendiri':
                return MaritalStatus.Single

              default:
                return MaritalStatus.Single
            }
          })(maritalStatus.toLowerCase()),
          NIK: NIK,
          NPWP: NPWP
        },
        privilege: ((privilege: string): Privilege => {
          switch (privilege) {
            case 'admin':
            case 'administrasi':
            case 'staff admin':
            case 'staff administrasi':
              return Privilege.Staff
            default:
              return Privilege.Staff
          }
        })(privilege.toLocaleLowerCase()),
        status: ((statusText: string): UserStatus => {
          switch (statusText) {
            case 'aktif':
            case 'active':
            case 'aktiv':
            case 'aktip':
              return UserStatus.Active

            case 'tidak aktif':
            case 'inactive':
            case 'tidak aktiv':
            case 'keluar':
            case 'tidak ada':
              return UserStatus.Inactive

            default:
              return UserStatus.Inactive
          }
        })(status.toLowerCase())
      }

      if (id.trim()) {
        updateBatch.push({
          id: Types.ObjectId(id),
          data: userData
        })
      } else {
        insertBatch.push(userData)
      }
    }

    User.insertMany(insertBatch.map(insertData => {
      const { password } = insertData

      return {
        ...insertData,
        password: BCrypt.hashSync(password, 10)
      }
    }))

    updateBatch.map(async updateQueue => {
      const { data, id } = updateQueue
      const prevUserData = await User.findOne({ _id: id })
      data.photo = prevUserData?.photo

      if (data.password?.length) {
        data.password = BCrypt.hashSync(data.password, 10)
      } else {
        delete data.password
      }

      await User.findOneAndUpdate({ _id: id }, data)
    })

    res.json(<APIResponse<{ inserted: number, updated: number }>>{
      success: true,
      message: {
        inserted: insertBatch.length,
        updated: updateBatch.length
      }
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Failed when import file.',
      error: (err as Error).message
    })
  }
}

export async function ExportStaff(req: Request, res: Response): Promise<void> {
  const { department } = req.params

  try {
    const departmentId = Types.ObjectId(department)

    const aggregateQuery = [
      {
        $match: {
          'meta.department': departmentId,
          privilege: {
            $in: [
              Privilege.Staff
            ]
          }
        }
      },
      {
        $unwind: {
          path: '$meta.actionResearch',
          preserveNullAndEmptyArrays: true
        }
      }
    ]

    const staffs = await User.aggregate(aggregateQuery)
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet()

    worksheet.addRow([
      'ID',
      'Nama Lengkap',
      'Email',
      'Password',
      'Jenis Kelamin',
      'Agama',
      'Nomor Telepon',
      'Alamat',
      'NIP',
      'NUPTK',
      'Bidang Study',
      'Jenis PTK',
      'Status Kepegawaian',
      'Golongan Pegawai',
      'Status Pernikahan',
      'NIK',
      'NPWP',
      'Hak Akses',
      'Status',
      'Aksi'
    ])

    staffs.map(async staff => {
      worksheet.addRow([
        staff._id.toString(),
        staff.fullname,
        staff.email,
        '',
        ((gender: Gender): string => {
          switch (gender) {
            case Gender.Man:
              return 'Laki-laki'

            case Gender.Woman:
              return 'Perempuan'

            default:
              return 'Tidak diketahui'
          }
        })(staff.meta.gender),
        ((religion: Religion): string => {
          switch (religion) {
            case Religion.Islam:
              return 'Islam'

            case Religion.ProtestantChristian:
              return 'Kristen Protestan'

            case Religion.CatholicChristian:
              return 'Kristen katolik'

            case Religion.Hindu:
              return 'Hindu'

            case Religion.Buddha:
              return 'Budha'

            case Religion.Konghucu:
              return 'Konghucu'

            default:
              return 'Lainnya'
          }
        })(staff.meta.religion),
        staff.meta.phone?.filter((phone: string) => phone.trim().length > 0).join(', '),
        staff.meta.address,
        staff.meta.NIP,
        staff.meta.NUPTK,
        staff.meta.fieldOfStudy,
        staff.meta.actionResearch?.title ?? '',
        staff.meta.employmentStatus,
        staff.meta.employmentGroup,
        staff.meta.maritalStatus,
        staff.meta.NIK,
        staff.meta.NPWP,
        staff.privilege === Privilege.Staff ? 'Staff Administrasi' : 'Staff Pengajar',
        staff.status
      ])
    })

    const resultBuffer = await workbook.xlsx.writeBuffer()

    res.setHeader('Content-type', 'application/vnd.ms-excel')
    res.setHeader('Content-disposition', `attachment; filename=Staff output.xlsx`)
    res.end(resultBuffer)
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Failed when import file.',
      error: (err as Error).message
    })
  }
}

export async function SubmitStaff(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const {
    department,
    fullname,
    email,
    password,
    gender,
    religion,
    phone,
    address,
    NIP,
    NUPTK,
    fieldOfStudy,
    actionResearch,
    employmentStatus,
    maritalStatus,
    NIK,
    employmentGroup,
    NPWP,
    status,
    privilege
  } = req.body
  console.log("/.")
console.log(department)
  try {
    const userId = Types.ObjectId(id)
    const departmentId = Types.ObjectId(department)

    const foundUser = await User.findOne({
      _id: userId,
      privilege: {
        $in: [
          Privilege.Staff,
        ]
      }
    })

    const newUser = new User()

    const user = foundUser ?? newUser

    if (password && password.length > 4) {
      user.password = BCrypt.hashSync(password, 10)
    }

    user.email = email
    user.fullname = fullname

    user.meta = {
      department: departmentId,
    }

    user.status = status
    user.privilege = Privilege.Staff

    const savedUser = await user.save()

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

export function RemoveStaff(req: Request, res: Response): void {
  const { id, department } = req.params

  User.findOneAndDelete({ _id: Types.ObjectId(id), 'meta.department': Types.ObjectId(department) }).then(deletedUser => {
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

export function StaffData(req: Request, res: Response): void {
  const { id, department } = req.params

  User.findOne({
    _id: Types.ObjectId(id),
    'meta.department': Types.ObjectId(department),
    privilege: { $in: [Privilege.Staff] }
  }).then(user => {
    if (user === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found',
        error: null
      })

      return
    }

    res.json(<APIResponse<{ staff: UserInterface }>>{
      success: true,
      message: {
        staff: user
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

export function StaffList(req: Request, res: Response): void {
  const { department } = req.query

  let matchQuery = department ?
    {
      $match: {
        privilege: {
          $in: [Privilege.Staff]
        },
        'meta.department': Types.ObjectId(department as string)
      }
    } : {
      $match: {
        privilege: {
          $in: [Privilege.Staff]
        }
      }
    }

  const aggregateQuery = [
    matchQuery,
    {
      $lookup: {
        from: Department.collection.collectionName,
        localField: 'meta.department',
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
      $unwind: {
        path: '$actionResearch',
        preserveNullAndEmptyArrays: true
      }
    }
  ]

  User.aggregate(aggregateQuery).then(users => {
    res.json(<APIResponse<{ staffs: Array<UserInterface> }>>{
      success: true,
      message: {
        staffs: users
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
  const { fullname, email, password, status, pin } = req.body
  let state = 'update'

  try {
    let admin = await User.findOne({ _id: Types.ObjectId(id), privilege: Privilege.Admin })

    if (admin === null) {
      state = 'new'
      admin = new User()
      admin.privilege = Privilege.Admin
    }

    if (state === 'update' && pin !== ADMINISTRATOR_PIN) {
      if (admin.status !== status) {
        res.json(<APIResponse>{
          success: false,
          message: 'Anda tidak memiliki hak akses untuk melakukan ini',
          error: null
        })

        return
      }
    }

    if (password && password.length > 4) {
      if (state === 'update' && pin !== ADMINISTRATOR_PIN) {
        res.json(<APIResponse>{
          success: false,
          message: 'Anda tidak memiliki hak akses untuk melakukan ini',
          error: null
        })

        return
      }

      admin.password = BCrypt.hashSync(password, 10)
    }

    admin.fullname = fullname
    admin.email = email
    admin.status = status

    const savedAdmin = await admin.save()

    res.json(<APIResponse<{ administrator: UserInterface }>>{
      success: true,
      message: {
        administrator: savedAdmin
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
  const { pin } = req.query

  if (String(pin) !== String(ADMINISTRATOR_PIN)) {
    res.json(<APIResponse>{
      success: false,
      message: 'Anda tidak memiliki hak akses untuk melakukan ini',
      error: null
    })

    return
  }

  if (String(id) === String(user._id)) {
    res.json(<APIResponse>{
      success: false,
      message: 'Anda tidak bisa menghapus data diri sendiri.',
      error: null
    })

    return
  }

  User.findOneAndDelete({ _id: Types.ObjectId(id), privilege: Privilege.Admin }).then(deletedAdmin => {
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

  User.findOne({ _id: Types.ObjectId(id), privilege: Privilege.Admin }).then(admin => {
    if (admin === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'Admin data not found',
        error: null
      })

      return
    }

    res.json(<APIResponse<{ administrator: UserInterface }>>{
      success: true,
      message: {
        administrator: admin
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

export function AdminList(req: Request, res: Response): void {
  User.find({ privilege: Privilege.Admin }).then(admins => {
    res.json(<APIResponse<{ administrators: Array<UserInterface> }>>{
      success: true,
      message: {
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

export async function OverrideUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>
  const { user: userSession } = res.locals

  try {
    const user = await User.findOne({ _id: Types.ObjectId(id) })

    if (!user) {
      res.json(<APIResponse>{
        success: false,
        message: 'User data not found!'
      })

      return
    }

    switch (userSession.privilege) {
      case Privilege.Staff:
        res.json(<APIResponse>{
          success: false,
          message: 'User not authorized!'
        })

        return

      case Privilege.Reviewer:
        res.json(<APIResponse>{
          success: false,
          message: 'User not authorized!'
        })

        return

      default:
    }

    if (userSession.privilege !== Privilege.Admin && user?.meta?.department?.toString() !== userSession.meta?.department?.toString()) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not authorized!'
      })

      return
    }

    const jwt = JWT.sign(String(user._id), fs.readFileSync(path.join(__dirname, '../../../private.key')), <JWT.SignOptions>{
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
        endpoint = '/'
    }

    interface MessageReponseInterface {
      token: string
      endpoint: string
    }

    res.json(<APIResponse<MessageReponseInterface>>{
      success: true,
      message: {
        token: jwt,
        endpoint: endpoint
      }
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export async function UserList(req: Request, res: Response): Promise<void> {
  const { department } = req.params as Record<string, string>
  const { find } = req.query as Record<string, string>
  const { user } = res.locals

  switch (user.privilege) {
    case Privilege.Staff:
      res.json(<APIResponse>{
        success: false,
        message: 'User not authorized!'
      })

      return

    case Privilege.Reviewer:
      res.json(<APIResponse>{
        success: false,
        message: 'User not authorized!'
      })

      return

    default:
  }

  if (user.privilege !== Privilege.Admin && user?.meta?.department?.toString() !== department) {
    res.json(<APIResponse>{
      success: false,
      message: 'User not authorized!'
    })

    return
  }

  try {
    const findQuery = new RegExp(find, 'ig')
    const userFilterQuery: FilterQuery<UserInterface> = {
      $or: [
        { fullname: findQuery },
        { email: findQuery }
      ],
      'meta.department': Types.ObjectId(department)
    }

    const foundUser = await User.find(userFilterQuery, ['email', 'fullname', 'status', 'privilege'])
      .limit(20)

    res.json(<APIResponse<{ users: Array<UserInterface> }>>{
      success: true,
      message: {
        users: foundUser
      }
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export async function UpdateFCMToken(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const { fcmToken } = req.body

  try {
    const foundUser = await User.findOne({ _id: id })

    if (!foundUser) {
      res.json(<APIResponse>{
        success: false,
        message: 'User not found'
      })

      return
    }

    const user = foundUser
    const newFcmTokenList = user.meta.fcmToken ?? []

    if (newFcmTokenList.indexOf(fcmToken) < 0) {
      newFcmTokenList.push(fcmToken)

      user.meta = {
        ...user.meta,
        fcmToken: newFcmTokenList
      }

      await user.save()
    }

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