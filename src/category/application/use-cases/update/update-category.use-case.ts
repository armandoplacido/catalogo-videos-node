import { UseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";

export class UpdateCategoryUseCase
  implements UseCase<UpdateCategoryRequest,UpdatedCategoryResponse> {

    constructor(private readonly categoryRepository: CategoryRepository){}

  async execute(input: UpdateCategoryRequest): Promise<UpdatedCategoryResponse> {
    const anID = new Uuid(input.id)
    const aCategory = await this.categoryRepository.findById(anID)

    if(!aCategory) {
      throw new NotFoundError(input.id, Category)
    }

    input.name && aCategory.changeName(input.name)
    
    if('description' in input){
      aCategory.changeDescription(input.description)
    }

    if(input.isActive === true) {
      aCategory.activate()
    }

    if(input.isActive === false) {
      aCategory.deactivate()
    }

    await this.categoryRepository.update(aCategory)

    return {
      category: CategoryOutputMapper.toOutput(aCategory)
    }
  }
}


export type UpdateCategoryRequest = {
  id: string
  name?: string
  description?: string
  isActive?: boolean
}

export type UpdatedCategoryResponse = {
  category: CategoryOutput
}