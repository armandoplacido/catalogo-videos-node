import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";

export class CategoryModelMapper {
  static toModel(aCategory: Category): CategoryModel {
    return CategoryModel.build({
      categoryId: aCategory.categoryId.id,
      name: aCategory.name,
      description: aCategory.description,
      isActive: aCategory.isActive,
      createdAt: aCategory.createdAt
    })
  }

  static toEntity(aCategoryModel: CategoryModel) : Category {
    const aCategory = new Category({
      categoryId: new Uuid(aCategoryModel.categoryId),
      name: aCategoryModel.name,
      description: aCategoryModel.description,
      isActive: aCategoryModel.isActive,
      createdAt: aCategoryModel.createdAt
    }) 
    Category.validate(aCategory)

    return aCategory
  }
}