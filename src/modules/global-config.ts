import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import { WrapperDataInterceptor } from './shared-module/interceptors/wrapper-data/wrapper-data.interceptor'
import { NotFoundErrorFilter } from './shared-module/filters/not-found-error.filter'
import { EntityValidationErrorFilter } from './shared-module/filters/entity-validation-error.filter'
import { Reflector } from '@nestjs/core'

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  )
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new WrapperDataInterceptor(),
  )
  app.useGlobalFilters(
    new NotFoundErrorFilter(),
    new EntityValidationErrorFilter(),
  )
}
