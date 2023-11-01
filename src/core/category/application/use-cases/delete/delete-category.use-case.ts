import { Category } from '@core/category/domain/category.entity'
import { CategoryRepository } from '@core/category/domain/category.repository'
import { UseCase } from '@core/shared/application/use-case.interface'
import { NotFoundError } from '@core/shared/domain/errors/not-found.error'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'

export class DeleteCategoryUseCase
  implements UseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const anID = new Uuid(input.id)

    const aCategory = await this.categoryRepository.findById(anID)

    if (!aCategory) {
      throw new NotFoundError(input.id, Category)
    }

    await this.categoryRepository.delete(anID)
  }
}

export type DeleteCategoryInput = {
  id: string
}

export type DeleteCategoryOutput = void
