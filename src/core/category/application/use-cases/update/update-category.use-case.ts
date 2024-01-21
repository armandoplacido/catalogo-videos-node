import { UseCase } from '@core/shared/application/use-case.interface'
import { CategoryOutput, CategoryOutputMapper } from '../common/category-output'
import { CategoryRepository } from '@core/category/domain/category.repository'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '@core/shared/domain/errors/not-found.error'
import { Category } from '@core/category/domain/category.entity'
import { EntityValidationError } from '@core/shared/domain/validators/validation.error'
import { UpdateCategoryInput } from './update-category.input'

export class UpdateCategoryUseCase
  implements UseCase<UpdateCategoryInput, UpdatedCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdatedCategoryOutput> {
    const anID = new Uuid(input.id)
    const aCategory = await this.categoryRepository.findById(anID)

    if (!aCategory) {
      throw new NotFoundError(input.id, Category)
    }

    input.name && aCategory.changeName(input.name)

    if (input.description !== undefined) {
      aCategory.changeDescription(input.description)
    }

    if (input.isActive === true) {
      aCategory.activate()
    }

    if (input.isActive === false) {
      aCategory.deactivate()
    }

    if (aCategory.notification.hasErrors()) {
      throw new EntityValidationError(aCategory.notification.toJSON())
    }

    await this.categoryRepository.update(aCategory)

    return CategoryOutputMapper.toOutput(aCategory)
  }
}

export type UpdatedCategoryOutput = CategoryOutput
