import { UseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.repository";

export class DeleteCategoryUseCase 
  implements UseCase<DeleteCategoryRequest, DeleteCategoryResponse> {

    constructor(private readonly categoryRepository:CategoryRepository){}

  async execute(input: DeleteCategoryRequest): Promise<DeleteCategoryResponse> {
    const anID = new Uuid(input.id)
    
    const aCategory = await this.categoryRepository.findById(anID)

    if(!aCategory){
      throw new NotFoundError(input.id, Category)
    }

    await this.categoryRepository.delete(anID)
  }
}


export type DeleteCategoryRequest = {
  id:string
}

export type DeleteCategoryResponse = void
