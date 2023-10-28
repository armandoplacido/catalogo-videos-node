
import { UseCase } from "../../../../shared/application/use-case.interface"
import { Category } from "../../../domain/category.entity"
import { CategoryRepository } from "../../../domain/category.repository"
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output"



export type CreateCategoryRequest = {
  name:string
  description?: string | null
  isActive?: boolean
}

export type CreateCategoryResponse = {
  category: CategoryOutput
}

export class CreateCategoryUseCase 
  implements UseCase<CreateCategoryRequest, CreateCategoryResponse> {

  constructor(private readonly categoryRepository: CategoryRepository){}

  async execute(input: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const aCategory = Category.create(input)

    await this.categoryRepository.insert(aCategory)

    return {
      category: CategoryOutputMapper.toOutput(aCategory)
    }
  }
}