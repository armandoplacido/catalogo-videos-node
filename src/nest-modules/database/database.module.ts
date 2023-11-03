import { CategoryModel } from '@core/category/infra/db/sequelize/category.model'
import { CONFIG_SCHEMA_TYPE } from '@nest-modules/config/config.module'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

const models = [CategoryModel]

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        const dbVendor = configService.get('DB_VENDOR')

        if (dbVendor === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: configService.get('DB_HOST'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          }
        }

        if (dbVendor === 'mysql') {
          return {
            dialect: 'mysql',
            host: configService.get('DB_HOST'),
            database: configService.get('DB_DATABASE'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            port: configService.get('DB_PORT'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          }
        }

        throw new Error(`Unsupported database config ${dbVendor}`)
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
