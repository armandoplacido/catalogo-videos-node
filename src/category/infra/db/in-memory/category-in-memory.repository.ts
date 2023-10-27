import { SortDirection } from "../../../../shared/domain/repository/search-params"
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo"
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository"
import { Category } from "../../../domain/category.entity"
import { CategoryFilter, CategoryRepository } from "../../../domain/category.repository"


export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements CategoryRepository {
  sortableFields: string[] = ['name', 'createdAt']

  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  protected async applyFilter(items: Category[], filter: CategoryFilter): Promise<Category[]> {
    if(!filter) {
      return items
    }

    return items.filter( item => {
      return (
        item.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
      )
    })
  }
  
  protected applySort(
    items: Category[], 
    sort: string | null, 
    sortDir: SortDirection | null, 
    ): Category[] {
      return sort ? super.applySort(items,sort,sortDir) :super.applySort(items, 'createdAt', 'desc')
  }
}