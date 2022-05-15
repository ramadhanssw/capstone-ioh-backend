import request from "supertest"
import mongoose, { Types } from "mongoose"
import User from "../src/schemas/User"
import BCrypt from "bcrypt"
import { Privilege, UserStatus } from "../src/interfaces/documents/UserInterface"
import Department from "../src/schemas/Department"
import { DepartmentStatus } from "../src/interfaces/documents/DepartmentInterface"
import app from "../src/app"
import RedisCacheClient from "../src/redis-client"
import JWT from "jsonwebtoken"
import fs from "fs"
import path from "path"
import Grade from "../src/schemas/Grade"
import { GradeStatus } from "../src/interfaces/documents/GradeInterface"
import { initial } from "lodash"

const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI ?? 'mongodb://localhost:27017/test'

describe('Student', () => {
  let db: typeof mongoose
  let tokenStudent1: string
  let tokenStudent2: string

  beforeAll(async () => {
    db = await mongoose.connect(MONGODB_TEST_URI + '_student', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      directConnection: true
    })

    jest.useFakeTimers()

    const departmentList: Array<{title: string, status: DepartmentStatus}> = [
      {title: 'Department 1', status: DepartmentStatus.Active},
      {title: 'Department 2', status: DepartmentStatus.Inactive}
    ]

    const studentList: Array<string> = ['student1', 'student2', 'student3', 'student4']

    const [department1, department2] = await Department.insertMany(departmentList.map(department => ({
      title: department.title,
      description: '-',
      NPSN: '-',
      NSS: '-',
      headquarterLocation: {
        address: '-',
        lat: 0,
        lng: 0
      },
      website: '-',
      email: '-',
      phone: [],
      service: {
        mobileStudent: true,
        webStudent: true,
        attendance: true,
        lesson: true,
        schedule: true,
        article: true,
        library: true,
        payment: true,
        fcmToken: [],
        fcmTopic: []
      },
      status: department.status
    })))

    await Grade.insertMany([
      {
        level: 1,
        title: '1 A',
        homeroomTeacher: Types.ObjectId(),
        major: Types.ObjectId(),
        department: department1._id,
        status: GradeStatus.Active
      }
    ])

    const [student1, student2] = await User.insertMany(studentList.map((student, index) => ({
      fullname: `${student} ${index + 1}`,
      email: student + '@department1.com',
      password: BCrypt.hashSync(student, 10),
      meta: {
        department: department1._id,
        phone: []
      },
      privilege: Privilege.Student,
      status: UserStatus.Active
    })))

    await User.insertMany(studentList.map((student, index) => ({
      fullname: `${student} ${index + 1}`,
      email: student + '@department2.com',
      password: BCrypt.hashSync(student, 10),
      meta: {
        department: department2._id,
        phone: []
      },
      privilege: Privilege.Student,
      status: UserStatus.Active
    })))
  })

  afterAll(async () => {
    await db.connection.dropDatabase()
    await db.connection.close()
    RedisCacheClient.quit(() => process.exit(0))
  })

  it('Authentication', async () => {
    const responseStudent1Department1 = await request(app)
      .post('/auth')
      .send({
        email: 'student1@department1.com',
        password: 'student1'
      })

    expect(responseStudent1Department1.body.success).toEqual(true)
    tokenStudent1 = responseStudent1Department1.body.message.token

    const responseStudent2Department2 = await request(app)
      .post('/auth')
      .send({
        email: 'student1@department2.com',
        password: 'student1'
      })

    expect(responseStudent2Department2.body.success).toEqual(false)

    const verifyTokenResponse = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${tokenStudent1}`)

    expect(verifyTokenResponse.body.success).toEqual(true)
  })

  it('Can access profile', async () => {
    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${tokenStudent1}`)

    expect(response.body.success).toEqual(true)
  })

  it('Can access assignment list', async () => {
    const response = await request(app)
      .get('/student/assignment')
      .set('Authorization', `Bearer ${tokenStudent1}`)

    expect(response.body.success).toEqual(true)
  })

  it('Can access study material list', async () => {
    const response = await request(app)
      .get('/student/study-material')
      .set('Authorization', `Bearer ${tokenStudent1}`)

    expect(response.body.success).toEqual(true)
  })

  it('Can access exam list', async () => {
    const response = await request(app)
      .get('/student/exam')
      .set('Authorization', `Bearer ${tokenStudent1}`)

    expect(response.body.success).toEqual(true)
  })
})
