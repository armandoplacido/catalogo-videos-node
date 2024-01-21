import { Controller, Get, INestApplication } from '@nestjs/common'
import request from 'supertest'
import { EntityValidationErrorFilter } from '../entity-validation-error.filter'
import { EntityValidationError } from '@core/shared/domain/validators/validation.error'
import { Test, TestingModule } from '@nestjs/testing'

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new EntityValidationError([
      'another erorr',
      {
        field1: ['field1 is required', 'error2'],
      },
      {
        field2: ['field2 is required'],
      },
    ])
  }
}

describe('EntityValidationErrorFilter Unit Test', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalFilters(new EntityValidationErrorFilter())
    await app.init()
  })

  afterEach(async () => {
    await app?.close()
  })

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: [
          'another erorr',
          'field1 is required',
          'error2',
          'field2 is required',
        ],
      })
  })
})
