import BCrypt from 'bcrypt'
import { Workbook } from 'exceljs'
import { Request, Response } from "express"
import { Types } from "mongoose"
import UserInterface, {
    EmploymentStatus,
    Gender,
    MaritalStatus,
    Privilege,
    Religion,
    UserStatus
} from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import User from "../../schemas/User"

export async function ImportReviewer(req: Request, res: Response): Promise<void> {
    const { department } = req.params
    const userInitData = new User()
    const reviewerDocFile = req.file?.buffer

    if (!reviewerDocFile) {
        res.json(<APIResponse>{
            success: false,
            message: 'File gagal diupload!'
        })

        return
    }

    try {
        const workBook = new Workbook()
        const loadedWorkbook = await workBook.xlsx.load(reviewerDocFile)
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
                        case 'reviewer admin':
                        case 'reviewer administrasi':
                            return Privilege.Reviewer
                        default:
                            return Privilege.Reviewer
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

export async function ExportReviewer(req: Request, res: Response): Promise<void> {
    const { department } = req.params

    try {
        const departmentId = Types.ObjectId(department)

        const aggregateQuery = [
            {
                $match: {
                    'meta.department': departmentId,
                    privilege: {
                        $in: [
                            Privilege.Reviewer
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

        const reviewers = await User.aggregate(aggregateQuery)
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

        reviewers.map(async reviewer => {
            worksheet.addRow([
                reviewer._id.toString(),
                reviewer.fullname,
                reviewer.email,
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
                })(reviewer.meta.gender),
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
                })(reviewer.meta.religion),
                reviewer.meta.phone?.filter((phone: string) => phone.trim().length > 0).join(', '),
                reviewer.meta.address,
                reviewer.meta.NIP,
                reviewer.meta.NUPTK,
                reviewer.meta.fieldOfStudy,
                reviewer.meta.actionResearch?.title ?? '',
                reviewer.meta.employmentStatus,
                reviewer.meta.employmentGroup,
                reviewer.meta.maritalStatus,
                reviewer.meta.NIK,
                reviewer.meta.NPWP,
                reviewer.privilege === Privilege.Reviewer ? 'Reviewer Administrasi' : 'Reviewer Pengajar',
                reviewer.status
            ])
        })

        const resultBuffer = await workbook.xlsx.writeBuffer()

        res.setHeader('Content-type', 'application/vnd.ms-excel')
        res.setHeader('Content-disposition', `attachment; filename=Reviewer output.xlsx`)
        res.end(resultBuffer)
    } catch (err) {
        res.json(<APIResponse>{
            success: false,
            message: 'Failed when import file.',
            error: (err as Error).message
        })
    }
}

export async function SubmitReviewer(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const {
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

    try {
        const userId = Types.ObjectId(id)
        const actionResearchId = actionResearch && Types.ObjectId(actionResearch)

        const foundUser = await User.findOne({
            _id: userId,
            privilege: {
                $in: [
                    Privilege.Reviewer
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
            gender: gender,
            religion: religion,
            phone: <Array<string> | null>phone ?? [],
            address: address,
            NIP: NIP,
            NUPTK: NUPTK,
            fieldOfStudy: fieldOfStudy,
            actionResearch: actionResearchId,
            employmentStatus: employmentStatus,
            employmentGroup: employmentGroup,
            maritalStatus: maritalStatus,
            NIK: NIK,
            NPWP: NPWP
        }

        user.status = status
        user.privilege = privilege

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

export function RemoveReviewer(req: Request, res: Response): void {
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

export function ReviewerData(req: Request, res: Response): void {
    const { id, department } = req.params

    User.findOne({
        _id: Types.ObjectId(id),
        'meta.department': Types.ObjectId(department),
        privilege: { $in: [Privilege.Reviewer] }
    }).then(user => {
        if (user === null) {
            res.json(<APIResponse>{
                success: false,
                message: 'User not found',
                error: null
            })

            return
        }

        res.json(<APIResponse<{ reviewer: UserInterface }>>{
            success: true,
            message: {
                reviewer: user
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

export function ReviewerList(req: Request, res: Response): void {
    const aggregateQuery = [
        {
            $match: {
                privilege: {
                    $in: [Privilege.Reviewer]
                },
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
        res.json(<APIResponse<{ reviewers: Array<UserInterface> }>>{
            success: true,
            message: {
                reviewers: users
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
