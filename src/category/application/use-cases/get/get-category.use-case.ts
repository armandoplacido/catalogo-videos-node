import { UseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";

export class GetCategoryUseCase
  implements UseCase<GetCategoryRequest,GetdCategoryResponse> {

    constructor(private readonly categoryRepository: CategoryRepository){}

  async execute(input: GetCategoryRequest): Promise<GetdCategoryResponse> {
    const anID = new Uuid(input.id)
    const aCategory = await this.categoryRepository.findById(anID)

    if(!aCategory) {
      throw new NotFoundError(input.id, Category)
    }

    return {
      category: CategoryOutputMapper.toOutput(aCategory)
    }
  }
}


export type GetCategoryRequest = {
  id: string
}

export type GetdCategoryResponse = {
  category: CategoryOutput
}