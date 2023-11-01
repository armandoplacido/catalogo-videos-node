import { Entity } from '../../../domain/entity'
import {
  IRepository,
  ISearchableRepository,
} from '../../../domain/repository/repository-interface'
import {
  SearchParams,
  SortDirection,
} from '../../../domain/repository/search-params'
import { SearchResult } from '../../../domain/repository/search-result'
import { ValueObject } from '../../../domain/value-object'

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
> implements IRepository<E, EntityId>
{
  items: E[] = []

  async insert(aEntity: E): Promise<void> {
    this.items.push(aEntity)
  }

  async bulkInsert(someEntities: E[]): Promise<void> {
    this.items.push(...someEntities)
  }

  async update(aEntity: E): Promise<void> {
    const aIndexFound = this.items.findIndex((item) =>
      item.entityId.equals(aEntity.entityId),
    )

    this.items[aIndexFound] = aEntity
  }

  async delete(anEntityId: EntityId): Promise<void> {
    const aIndexFound = this.items.findIndex((item) =>
      item.entityId.equals(anEntityId),
    )

    this.items.splice(aIndexFound, 1)
  }

  async findById(anEntityId: EntityId): Promise<E | null> {
    const item = this.items.find((item) => item.entityId.equals(anEntityId))
    return typeof item === 'undefined' ? null : item
  }

  async findAll(): Promise<E[]> {
    return this.items
  }

  abstract getEntity(): new (...args: any[]) => E
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = []

  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter)
    const itemsSorted = this.applySort(itemsFiltered, props.sort, props.sortDir)
    const itemsPaginated = this.applyPaginate(
      itemsSorted,
      props.page,
      props.perPage,
    )

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
    })
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>

  protected applySort(
    items: E[],
    sort: string | null,
    sortDir: SortDirection | null,
    customGetter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }

    return [...items].sort((a, b) => {
      const aValue = customGetter ? customGetter(sort, a) : a[sort]
      const bValue = customGetter ? customGetter(sort, b) : b[sort]
      if (aValue < bValue) {
        return sortDir === 'asc' ? -1 : 1
      }

      if (aValue > bValue) {
        return sortDir === 'asc' ? 1 : -1
      }

      return 0
    })
  }
  protected applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ) {
    const start = (page - 1) * perPage
    const limit = start + perPage
    return items.slice(start, limit)
  }
}
