import { Op } from "sequelize";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryRepository, CategorySearchParams, CategorySearchResult } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model.mapper";

export class CategorySequelizeRepository implements CategoryRepository {

  sortableFields: string[] = ['name','createdAt'];

  constructor(private categoryModel: typeof CategoryModel) {

  }

  async insert(aCategory: Category): Promise<void> {
    const aCategoryModel = CategoryModelMapper.toModel(aCategory)

    await this.categoryModel.create(aCategoryModel.toJSON())
  }

  async bulkInsert(someEntities: Category[]): Promise<void> {
    const someCategoriesModel = someEntities.map(CategoryModelMapper.toModel)
    this.categoryModel.bulkCreate(
      someCategoriesModel.map(aCategoryModel => aCategoryModel.toJSON())
    )
  }
  
  async update(aCategory: Category): Promise<void> {
    const aCategoryModel = CategoryModelMapper.toModel(aCategory)

    await this.categoryModel.update(
      aCategoryModel.toJSON(),
      { where: { categoryId: aCategory.categoryId.id } }
      )
  }

  async delete(anCategoryId: Uuid): Promise<void> {
    await this.categoryModel.destroy({ where: { categoryId: anCategoryId.id }})
  }

  async findById(anCategoryId: Uuid): Promise<Category | null> {
    const aCategoryModel = await this.categoryModel.findByPk(anCategoryId.id) 

    return aCategoryModel 
    ? CategoryModelMapper.toEntity(aCategoryModel) : null
  }

  async findAll(): Promise<Category[]> {
    const someCategoryModel = await this.categoryModel.findAll()

    return someCategoryModel.map(CategoryModelMapper.toEntity)
  }

  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page -1) * props.perPage
    const limit = props.perPage

    const {rows: someCategoriesModel, count} = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: {[Op.like]: `%${props.filter}%`}
        }
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)) 
      ? {order: [[props.sort, props.sortDir]]}
      : {order: [['createdAt', 'desc']]},
      offset,
      limit
    })

    return new CategorySearchResult({
      items: someCategoriesModel.map(CategoryModelMapper.toEntity),
      currentPage: props.page,
      perPage: props.perPage,
      total: count
    })
  }
}