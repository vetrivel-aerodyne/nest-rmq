import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { employee, EmployeeSchema } from './db-schema/employee';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
const RMQ_Config = {
  uri: "amqp://admin:admin@172.20.6.22:5672",
  exchanges: [
    {
      name: "auth",
      type: 'topic',
      createExchangeIfNotExists: true
    },
  ],
  connectionInitOptions: { wait: true }
};

describe('Employee Crud APIs', () => {
  let appController: AppController;
  let appService: AppService;
  let app: INestApplication;
  let mongoServer: any;

  const addMockData = {
    "employeeName": "vetrivel",
    "username": "vetri@Areo",
    "password": "Vetri@Areo123",
    "age": 26,
    "gender": "Male",
    "roles": ["Field Officer"]
  };

  let listData: any = {};

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongoServer = (await MongoMemoryServer.create());
            const mongoUri = mongoServer.getUri();
            return {
              uri: mongoUri
            };
          },
        }),
        MongooseModule.forFeature([{ name: employee.name, schema: EmployeeSchema }]),
        RabbitMQModule.forRoot(RabbitMQModule, RMQ_Config)
      ],

      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.init();
  }, 10000);

  const clearDB = async () => {
    const collections = mongoose.connection.collections

    for (const key in collections) {
      await collections[key].deleteMany()
    }
  }

  afterAll(async () => {
    await clearDB();
    await mongoose.disconnect();
    await mongoServer.stop();

  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
  });

  describe("Create Employee",()=>{
    it("add new employee test case", async () => {
      let createdBodyData = {
        success: true,
        message: 'Employee Created Successfully',
        code: 'SUC-DONE'
      };
      let result = await request(app.getHttpServer())
        .post('/employee')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(addMockData);
  
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(createdBodyData);
    });
  
    it("add employee with exist details test case", async () => {
      const existBodyData = { "success": false, "message": "User Name Already Exist", "code": "ERR-EXIST" };
      let result = await request(app.getHttpServer())
        .post('/employee')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(addMockData);
  
      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual(existBodyData);
    });
  
    it("add employee with empty data test case", async () => {
      const emptyBodyData = {
        message: [
          'username must be shorter than or equal to 30 characters',
          'username must be longer than or equal to 5 characters',
          'username must be a string',
          'username should not be empty',
          'password must be longer than or equal to 8 characters',
          'password is not strong enough',
          'password should not be empty',
          'employeeName must be shorter than or equal to 50 characters',
          'employeeName must be longer than or equal to 5 characters',
          'employeeName must contain only letters (a-zA-Z)',
          'employeeName should not be empty',
          'age must be a number conforming to the specified constraints',
          'age must not be greater than 150',
          'age must not be less than 18',
          'gender must be one of the following values: Male/Female/Others',
          'gender must be a string',
          'gender should not be empty'
        ],
        error: 'Bad Request',
        statusCode: 400
      };
      let result = await request(app.getHttpServer())
        .post('/employee')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({});
      expect(result.statusCode).toBe(400)
      expect(result.body).toEqual(emptyBodyData);
    });
  })

  describe("Fetch Employee",()=>{
    it("list employee test case", async () => {

      let result = await request(app.getHttpServer())
        .post('/employee/list')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          "itemPerPage": 10,
          "pageNo": 1,
          "searchText": addMockData.employeeName
        });
  
      expect(result.statusCode).toBe(201);
      let data = result.body.data;
      expect(data).not.toBe(null);
      expect(data.list.length).toBe(1);
      expect(data.total).toEqual(1);
      listData = data.list[0];
    });


    it("empty list employee test case", async () => {

      let result = await request(app.getHttpServer())
        .post('/employee/list')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          "itemPerPage": 1,
          "pageNo": 1,
          "searchText": "empty"
        }).expect(201);

      let data = result.body.data;
      expect(data).not.toBe(null);
      expect(data.list.length).toBe(0);
      expect(data.total).toEqual(0);
    });

  });

  describe("Update Employee",()=>{
    it("update employee test case", async () => {
      const updateBodyData = {
        success: true,
        message: 'Employee Updated Successfully',
        code: 'SUC-DONE'
      };
  
      let updateData = {
        ...listData,
        employeeId: listData._id,
        "roles": ["Sales Officer", "Field Officer"]
      };
      delete updateData._id;
      delete updateData.password;
      let result = await request(app.getHttpServer())
        .put('/employee')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(updateData);
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(updateBodyData);
    });
  
    it("update employee empty data test case", async () => {
      let emptyUpdateBodyData = {
        message: [
          'employeeId must be a mongodb id',
          'employeeId should not be empty',
          'username must be a string',
          'username must be shorter than or equal to 30 characters',
          'username must be longer than or equal to 5 characters',
          'username should not be empty',
          'employeeName must be shorter than or equal to 50 characters',
          'employeeName must be longer than or equal to 5 characters',
          'employeeName must contain only letters (a-zA-Z)',
          'employeeName should not be empty',
          'age must be a number conforming to the specified constraints',
          'age must not be greater than 150',
          'age must not be less than 18',
          'gender must be one of the following values: Male/Female/Others',
          'gender must be a string',
          'gender should not be empty',
          'isActive must be a boolean value'
        ],
        error: 'Bad Request',
        statusCode: 400
      };
      let result = await request(app.getHttpServer())
        .put('/employee')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({});
      expect(result.statusCode).toBe(400)
      expect(result.body).toEqual(emptyUpdateBodyData);
    });
  
    it("check employee list get updated test case", async () => {
  
      let result = await request(app.getHttpServer())
        .post('/employee/list')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          "itemPerPage": 1,
          "pageNo": 1,
          "searchText": ""
        });
  
      expect(result.statusCode).toBe(201);
      let data = result.body.data;
      expect(data).not.toBe(null);
      expect(data.list).not.toBe([]);
      expect(data.list.length).toBe(1);
      let employeeData = data.list[0];
      expect(employeeData.roles).toStrictEqual(["Sales Officer", "Field Officer"]);
    });  
  });

  describe("Delete Employee",()=>{
    it("delete employee test case", async () => {
      let deletedBodyData = {
        success: true,
        message: 'Employee Deleted Successfully',
        code: 'SUC-DONE'
      };
      let result = await request(app.getHttpServer())
        .delete('/employee')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .query({
          "employeeId": listData._id
        });
  
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(deletedBodyData);
    });
  
    it("delete employee not exist test case", async () => {
      let notExistBodyData = {
        "success": false,
        "message": "Employee Not Exist",
        "code": "ERR-Deleted"
      };
      let result = await request(app.getHttpServer())
        .delete('/employee')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .query({ "employeeId": listData._id });
  
      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual(notExistBodyData);
    });
  
    it("delete employee invalid data test case", async () => {
      let deleteInvalidBodyData = {
        message: ['employeeId must be a mongodb id'],
        error: 'Bad Request',
        statusCode: 400
      };
      let invalidEMployeeId = "65017e7c5479899e70f7d89s";
  
      let result = await request(app.getHttpServer())
        .delete('/employee')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .query({ "employeeId": invalidEMployeeId });
  
      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual(deleteInvalidBodyData);
    });
  })
});