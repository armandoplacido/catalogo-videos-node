import { PaginationOutput, PaginationOutputMapper } from "../../../../shared/application/pagination-output";
import { UseCase } from "../../../../shared/application/use-case.interface";
import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { Category } from "../../../domain/category.entity";
import { CategoryFilter, CategoryRepository, CategorySearchParams, CategorySearchResult } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";

export class ListCategoriesUseCase
  implements UseCase<ListCategoriesRequest,ListCategoriesResponse> {

    constructor(private readonly categoryRepository: CategoryRepository){}

  async execute(input: ListCategoriesRequest): Promise<ListCategoriesResponse> {
    const someParams = new CategorySearchParams(input)
    const aSearchResult = await this.categoryRepository.search(someParams)
    
    return this.toOutput(aSearchResult)
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoriesResponse {
    const {items: _items} = searchResult
    const items = _items.map(item => (CategoryOutputMapper.toOutput(item)))

    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}


export type ListCategoriesRequest = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: CategoryFilter | null;
}

export type ListCategoriesResponse = PaginationOutput<CategoryOutput>