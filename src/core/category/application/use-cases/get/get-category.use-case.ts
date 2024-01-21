import { UseCase } from '@core/shared/application/use-case.interface'
import { CategoryOutput, CategoryOutputMapper } from '../common/category-output'
import { CategoryRepository } from '@core/category/domain/category.repository'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '@core/shared/domain/errors/not-found.error'
import { Category } from '@core/category/domain/category.entity'

export class GetCategoryUseCase
  implements UseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const anID = new Uuid(input.id)
    const aCategory = await this.categoryRepository.findById(anID)

    if (!aCategory) {
      throw new NotFoundError(input.id, Category)
    }

    return CategoryOutputMapper.toOutput(aCategory)
  }
}

export type GetCategoryInput = {
  id: string
}

export type GetCategoryOutput = CategoryOutput
