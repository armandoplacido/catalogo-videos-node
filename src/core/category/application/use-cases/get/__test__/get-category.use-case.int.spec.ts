import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository'
import { GetCategoryUseCase } from '../get-category.use-case'
import { setupSequelize } from '@core/shared/infra/testing/helpers'
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '@core/shared/domain/errors/not-found.error'
import { Category } from '@core/category/domain/category.entity'

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel)
    useCase = new GetCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    )
  })

  it('should returns a category', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)
    const output = await useCase.execute({ id: category.categoryId.id })
    expect(output.category).toStrictEqual({
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    })
  })
})
