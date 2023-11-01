import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository'
import { CreateCategoryUseCase } from '../create-category.use-case'
import { setupSequelize } from '@core/shared/infra/testing/helpers'
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel)
    useCase = new CreateCategoryUseCase(repository)
  })

  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' })
    let entity = await repository.findById(new Uuid(output.category.id))
    expect(output.category).toStrictEqual({
      id: entity.categoryId.id,
      name: 'test',
      description: null,
      isActive: true,
      createdAt: entity.createdAt,
    })

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
    })
    entity = await repository.findById(new Uuid(output.category.id))
    expect(output.category).toStrictEqual({
      id: entity.categoryId.id,
      name: 'test',
      description: 'some description',
      isActive: true,
      createdAt: entity.createdAt,
    })

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      isActive: true,
    })
    entity = await repository.findById(new Uuid(output.category.id))
    expect(output.category).toStrictEqual({
      id: entity.categoryId.id,
      name: 'test',
      description: 'some description',
      isActive: true,
      createdAt: entity.createdAt,
    })

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      isActive: false,
    })
    entity = await repository.findById(new Uuid(output.category.id))
    expect(output.category).toStrictEqual({
      id: entity.categoryId.id,
      name: 'test',
      description: 'some description',
      isActive: false,
      createdAt: entity.createdAt,
    })
  })
})
