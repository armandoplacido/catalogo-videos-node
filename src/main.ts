import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { WrapperDataInterceptor } from '@modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor'
import { NotFoundErrorFilter } from '@modules/shared-module/filters/not-found/not-found-error.filter'
import { EntityValidationErrorFilter } from '@modules/shared-module/filters/entity-validation/entity-validation-error.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalInterceptors(new WrapperDataInterceptor())
  app.useGlobalFilters(
    new NotFoundErrorFilter(),
    new EntityValidationErrorFilter(),
  )

  await app.listen(3000)
}
bootstrap()
