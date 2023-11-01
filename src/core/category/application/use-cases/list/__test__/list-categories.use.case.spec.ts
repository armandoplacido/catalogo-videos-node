import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository'
import { CategoryOutputMapper } from '../../common/category-output'
import { ListCategoriesUseCase } from '../list-categories.use-case'
import { CategorySearchResult } from '@core/category/domain/category.repository'
import { Category } from '@core/category/domain/category.entity'

describe('ListCategoriesUseCase Unit Tests', () => {
  let useCase: ListCategoriesUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new ListCategoriesUseCase(repository)
  })

  test('toOutput method', () => {
    let result = new CategorySearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
    })
    let output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    })

    const entity = Category.fake().aCategory().withName('Movie').build()
    result = new CategorySearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
    })

    output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [entity].map(CategoryOutputMapper.toOutput),
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    })
  })

  it('should return output sorted by createdAt when input param is empty', async () => {
    const items = [
      Category.fake().aCategory().withName('test 1').build(),
      Category.fake()
        .aCategory()
        .withName('test 2')
        .withCreatedAt(new Date(new Date().getTime() + 100))
        .build(),
    ]
    repository.items = items

    const output = await useCase.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(CategoryOutputMapper.toOutput),
      total: 2,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    })
  })

  it('should return output using pagination, sort and filter', async () => {
    const items = [
      Category.fake().aCategory().withName('a').build(),
      Category.fake().aCategory().withName('AAA').build(),
      Category.fake().aCategory().withName('AaA').build(),
      Category.fake().aCategory().withName('b').build(),
      Category.fake().aCategory().withName('c').build(),
    ]
    repository.items = items

    let output = await useCase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    })

    output = await useCase.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0]].map(CategoryOutputMapper.toOutput),
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    })

    output = await useCase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0], items[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    })
  })
})
