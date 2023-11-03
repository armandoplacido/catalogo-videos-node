import { CategoryModel } from '@core/category/infra/db/sequelize/category.model'
import { Module } from '@nestjs/common'
import { SequelizeModule, getModelToken } from '@nestjs/sequelize'
import { CategoriesController } from './categories.controller'
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository'

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    {
      provide: CategorySequelizeRepository,
      useFactory: (categoryModel: typeof CategoryModel) => {
        return new CategorySequelizeRepository(categoryModel)
      },
      inject: [getModelToken(CategoryModel)],
    },
  ],
})
export class CategoriesModule {}
