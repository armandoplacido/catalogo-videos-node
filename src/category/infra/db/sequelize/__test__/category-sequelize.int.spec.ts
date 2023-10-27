import { Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category.model"
import { CategorySequelizeRepository } from "../category-sequelize.repository"
import { Category } from "../../../../domain/category.entity"
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo"
import { CategoryModelMapper } from "../category-model.mapper"
import { CategorySearchParams, CategorySearchResult } from "../../../../domain/category.repository"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"

describe('CategorySequelizeRepository Integration Test', () =>{
  let repository: CategorySequelizeRepository

  setupSequelize({
    models: [CategoryModel]
  })

  beforeEach( async () => {
    repository = new CategorySequelizeRepository(CategoryModel)
  })

  test('should insert a new category', async () => {
    const aCategory = Category.fake().aCategory().build()

    await repository.insert(aCategory)

    const aCategoryModel = await CategoryModel.findByPk(aCategory.categoryId.id)

    expect(aCategoryModel.toJSON()).toStrictEqual(aCategory.toJSON())
  })

  test('should bulk insert categories', async () => {
    const someCategories = Category.fake().theCategories(10).build()

    await repository.bulkInsert(someCategories)

    const someCategoriesModel = await CategoryModel.findAll()

    expect(someCategoriesModel).toHaveLength(10)
    expect(JSON.stringify(someCategories)).toBe(JSON.stringify(someCategoriesModel))
  })

  test('should finds a category by id', async () => {
    let aCategoryModel = await repository.findById(new Uuid())
    expect(aCategoryModel).toBeNull()

    const aCategory = Category.fake().aCategory().build()

    await repository.insert(aCategory)
    
    aCategoryModel = await repository.findById(aCategory.categoryId)
    expect(aCategoryModel.toJSON()).toStrictEqual(aCategory.toJSON())
  })

  test('should return all categories', async () => {
    const someCategories = Category.fake().theCategories(10).build()

    await repository.bulkInsert(someCategories)

    const someCategoriesModel = await repository.findAll()

    expect(someCategoriesModel).toHaveLength(10)
    expect(JSON.stringify(someCategoriesModel)).toBe(JSON.stringify(someCategories))
  })

  test('should update a category', async () =>{
    const aCategory = Category.fake().aCategory().build()

    await repository.insert(aCategory)

    aCategory.changeName('Movie updated')
    aCategory.changeDescription('Decription updated')
    aCategory.deactivate()

    await repository.update(aCategory)

    const aCategoryModel = await repository.findById(aCategory.categoryId)

    expect(aCategory.toJSON()).toStrictEqual(aCategoryModel.toJSON())
  })

  test('should delete a category', async () => {
    const aCategory = Category.fake().aCategory().build()

    await repository.insert(aCategory)

    await repository.delete(aCategory.categoryId)

    await expect(repository.findById(aCategory.categoryId)).resolves.toBeNull()
  })

  describe('search method tests', () => {
    test('should apply paginate when other params are null', async () => {
      const createdAt = new Date()
      const someCategories = Category.fake()
      .theCategories(16)
      .withName('Movie')
      .withDescription(null)
      .withCreatedAt(createdAt)
      .build()

      await repository.bulkInsert(someCategories)

      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity')

      const searchOutput = await repository.search(new CategorySearchParams())
      expect(searchOutput).toBeInstanceOf(CategorySearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total:16,
        currentPage: 1,
        lastPage: 2,
        perPage: 15
      })
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(Category)
        expect(item.categoryId).toBeDefined()
      })
      const items = searchOutput.items.map( item => item.toJSON())
      expect(items).toMatchObject(new Array(15).fill({
        name:'Movie',
        description: null,
        isActive: true,
        createdAt: createdAt
      }))
    })

    test('should order by createdAt DESC when search params are null', async () => {
      const createdAt = new Date()
      const someCategories = Category.fake()
      .theCategories(16)
      .withName((index) => `Movie ${index}`)
      .withDescription(null)
      .withCreatedAt((index) => new Date(createdAt.getTime() + index) )
      .build()

      await repository.bulkInsert(someCategories)

      const searchOutput = await repository.search(new CategorySearchParams())
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`${item.name}`).toBe(`${someCategories[index+1].name}`)
      })
    })

    it("should apply paginate and filter", async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ]

      await repository.bulkInsert(categories)

      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          perPage: 2,
          filter: "TEST",
        })
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
        }).toJSON(true)
      )

      searchOutput = await repository.search(
        new CategorySearchParams({
          page: 2,
          perPage: 2,
          filter: "TEST",
        })
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
        }).toJSON(true)
      )
    })

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "createdAt"])

      const categories = [
        Category.fake().aCategory().withName("b").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("d").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("c").build(),
      ]
      await repository.bulkInsert(categories)

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: "name",
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: "name",
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: "name",
            sortDir: "desc",
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: "name",
            sortDir: "desc",
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ]

      for (const i of arrange) {
        const result = await repository.search(i.params)
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true))
      }
    })

    describe("should search using filter, sort and paginate", () => {
      const categories = [
        Category.fake().aCategory().withName("test").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("TEST").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("TeSt").build(),
      ]

      const arrange = [
        {
          search_params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          search_params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ]

      beforeEach(async () => {
        await repository.bulkInsert(categories)
      })

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params)
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true))
        }
      )
    })
  })
})