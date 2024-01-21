import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository'
import { GetCategoryUseCase } from '../get-category.use-case'
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '@core/shared/domain/errors/not-found.error'
import { Category } from '@core/category/domain/category.entity'

describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new GetCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    )

    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    )
  })

  it('should returns a category', async () => {
    const items = [
      Category.fake()
        .aCategory()
        .withName('Movie')
        .withDescription(null)
        .build(),
    ]
    repository.items = items
    const spyFindById = jest.spyOn(repository, 'findById')
    const output = await useCase.execute({ id: items[0].categoryId.id })
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: items[0].categoryId.id,
      name: 'Movie',
      description: null,
      isActive: true,
      createdAt: items[0].createdAt,
    })
  })
})
