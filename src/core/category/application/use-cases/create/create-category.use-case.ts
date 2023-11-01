import { UseCase } from '@core/shared/application/use-case.interface'
import { CategoryOutput, CategoryOutputMapper } from '../common/category-output'
import { CreateCategoryInput } from './create-category.input'
import { CategoryRepository } from '@core/category/domain/category.repository'
import { Category } from '@core/category/domain/category.entity'
import { EntityValidationError } from '@core/shared/domain/validators/validation.error'

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const aCategory = Category.create(input)

    if (aCategory.notification.hasErrors()) {
      throw new EntityValidationError(aCategory.notification.toJSON())
    }

    await this.categoryRepository.insert(aCategory)

    return {
      category: CategoryOutputMapper.toOutput(aCategory),
    }
  }
}

export type CreateCategoryOutput = {
  category: CategoryOutput
}
