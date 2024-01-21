import { CreateCategoryUseCase } from '@core/category/application/use-cases/create/create-category.use-case'
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete/delete-category.use-case'
import { GetCategoryUseCase } from '@core/category/application/use-cases/get/get-category.use-case'
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list/list-categories.use-case'
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update/update-category.use-case'
import { CategoryRepository } from '@core/category/domain/category.repository'
import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository'
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository'
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model'
import { getModelToken } from '@nestjs/sequelize'

const REPOSITORIES = {
  CATEGORY_REPOSITORY: {
    provide: 'CategoryRepository',
    useExisting: CategorySequelizeRepository,
  },
  CATEGORY_IN_MEMORY_REPOSITORY: {
    provide: CategoryInMemoryRepository,
    useClass: CategoryInMemoryRepository,
  },
  CATEGORY_SEQUELIZE_REPOSITORY: {
    provide: CategorySequelizeRepository,
    useFactory: (categoryModel: typeof CategoryModel) => {
      return new CategorySequelizeRepository(categoryModel)
    },
    inject: [getModelToken(CategoryModel)],
  },
}

const USE_CASES = {
  CREATE_CATEGORY_USE_CASE: {
    provide: CreateCategoryUseCase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new CreateCategoryUseCase(categoryRepo)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  UPDATE_CATEGORY_USE_CASE: {
    provide: UpdateCategoryUseCase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new UpdateCategoryUseCase(categoryRepo)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListCategoriesUseCase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new ListCategoriesUseCase(categoryRepo)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  GET_CATEGORY_USE_CASE: {
    provide: GetCategoryUseCase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new GetCategoryUseCase(categoryRepo)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCategoryUseCase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new DeleteCategoryUseCase(categoryRepo)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
}

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
}
