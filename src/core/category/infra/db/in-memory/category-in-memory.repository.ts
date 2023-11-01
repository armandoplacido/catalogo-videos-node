import { Category } from '@core/category/domain/category.entity'
import {
  CategoryFilter,
  CategoryRepository,
} from '@core/category/domain/category.repository'
import { SortDirection } from '@core/shared/domain/repository/search-params'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'
import { InMemorySearchableRepository } from '@core/shared/infra/db/in-memory/in-memory.repository'

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements CategoryRepository
{
  sortableFields: string[] = ['name', 'createdAt']

  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter,
  ): Promise<Category[]> {
    if (!filter) {
      return items
    }

    return items.filter((item) => {
      return item.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    })
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Category[] {
    return sort
      ? super.applySort(items, sort, sortDir)
      : super.applySort(items, 'createdAt', 'desc')
  }
}
