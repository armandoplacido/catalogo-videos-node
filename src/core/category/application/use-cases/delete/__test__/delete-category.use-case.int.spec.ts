import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository'
import { DeleteCategoryUseCase } from '../delete-category.use-case'
import { setupSequelize } from '@core/shared/infra/testing/helpers'
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'
import { Category } from '@core/category/domain/category.entity'
import { NotFoundError } from '@core/shared/domain/errors/not-found.error'

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel)
    useCase = new DeleteCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    )
  })

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)
    await useCase.execute({
      id: category.categoryId.id,
    })
    await expect(repository.findById(category.categoryId)).resolves.toBeNull()
  })
})
