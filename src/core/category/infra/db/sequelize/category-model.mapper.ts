import { Category } from '@core/category/domain/category.entity'
import { CategoryModel } from './category.model'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'
import { LoadEntityError } from '@core/shared/domain/validators/validation.error'

export class CategoryModelMapper {
  static toModel(aCategory: Category): CategoryModel {
    return CategoryModel.build({
      categoryId: aCategory.categoryId.id,
      name: aCategory.name,
      description: aCategory.description,
      isActive: aCategory.isActive,
      createdAt: aCategory.createdAt,
    })
  }

  static toEntity(aCategoryModel: CategoryModel): Category {
    const aCategory = new Category({
      categoryId: new Uuid(aCategoryModel.categoryId),
      name: aCategoryModel.name,
      description: aCategoryModel.description,
      isActive: aCategoryModel.isActive,
      createdAt: aCategoryModel.createdAt,
    })
    aCategory.validate()

    if (aCategory.notification.hasErrors()) {
      throw new LoadEntityError(aCategory.notification.toJSON())
    }

    return aCategory
  }
}
