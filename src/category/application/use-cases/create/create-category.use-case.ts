
import { UseCase } from "../../../../shared/application/use-case.interface"
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error"
import { Category } from "../../../domain/category.entity"
import { CategoryRepository } from "../../../domain/category.repository"
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output"
import { CreateCategoryInput } from "./create-category.input"

export class CreateCategoryUseCase 
  implements UseCase<CreateCategoryInput, CreateCategoryOutput> {

  constructor(private readonly categoryRepository: CategoryRepository){}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const aCategory = Category.create(input)

    if (aCategory.notification.hasErrors()) {
      throw new EntityValidationError(aCategory.notification.toJSON());
    }

    await this.categoryRepository.insert(aCategory)

    return {
      category: CategoryOutputMapper.toOutput(aCategory)
    }
  }
}

export type CreateCategoryOutput = {
  category: CategoryOutput
}