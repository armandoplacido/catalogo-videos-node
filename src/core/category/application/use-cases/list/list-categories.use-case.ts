import { UseCase } from '@core/shared/application/use-case.interface'
import { CategoryOutput, CategoryOutputMapper } from '../common/category-output'
import {
  CategoryFilter,
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from '@core/category/domain/category.repository'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@core/shared/application/pagination-output'
import { SearchInput } from '@core/shared/application/search-input'

export class ListCategoriesUseCase
  implements UseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const someParams = new CategorySearchParams(input)
    const aSearchResult = await this.categoryRepository.search(someParams)

    return this.toOutput(aSearchResult)
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
    const { items: _items } = searchResult
    const items = _items.map((item) => CategoryOutputMapper.toOutput(item))

    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}

export type ListCategoriesInput = SearchInput<CategoryFilter>

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>
