import { applyGlobalConfig } from '@modules/global-config'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../../app.module'

export function startApp() {
  let _app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    _app = moduleFixture.createNestApplication()
    applyGlobalConfig(_app)
    await _app.init()
  })

  afterEach(async () => {
    await _app?.close()
  })

  return {
    get app() {
      return _app
    },
  }
}