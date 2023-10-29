import { UseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";

export class GetCategoryUseCase
  implements UseCase<GetCategoryInput,GetdCategoryOutput> {

    constructor(private readonly categoryRepository: CategoryRepository){}

  async execute(input: GetCategoryInput): Promise<GetdCategoryOutput> {
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


export type GetCategoryInput = {
  id: string
}

export type GetdCategoryOutput = {
  category: CategoryOutput
}