import { PaginationOutput, PaginationOutputMapper } from "../../../../shared/application/pagination-output";
import { SearchInput } from "../../../../shared/application/search-input";
import { UseCase } from "../../../../shared/application/use-case.interface";
import { CategoryFilter, CategoryRepository, CategorySearchParams, CategorySearchResult } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";

export class ListCategoriesUseCase
  implements UseCase<ListCategoriesInput,ListCategoriesOutput> {

    constructor(private readonly categoryRepository: CategoryRepository){}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const someParams = new CategorySearchParams(input)
    const aSearchResult = await this.categoryRepository.search(someParams)
    
    return this.toOutput(aSearchResult)
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
    const {items: _items} = searchResult
    const items = _items.map(item => (CategoryOutputMapper.toOutput(item)))

    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}


export type ListCategoriesInput = SearchInput<CategoryFilter>

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>