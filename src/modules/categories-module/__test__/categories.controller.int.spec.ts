import { CategoryRepository } from '@core/category/domain/category.repository'
import { CategoriesController } from '../categories.controller'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@modules/config-module/config.module'
import { DatabaseModule } from '@modules/database-module/database.module'
import { CategoriesModule } from '../categories.module'
import { CATEGORY_PROVIDERS } from '../categories.providers'
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create/create-category.use-case'
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update/update-category.use-case'
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list/list-categories.use-case'
import { GetCategoryUseCase } from '@core/category/application/use-cases/get/get-category.use-case'
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete/delete-category.use-case'
import {
  CreateCategoryFixture,
  ListCategoriesFixture,
  UpdateCategoryFixture,
} from '../testing/category-fixture'
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter'
import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'
import { Category } from '@core/category/domain/category.entity'

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController
  let repository: CategoryRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile()
    controller = module.get<CategoriesController>(CategoriesController)
    repository = module.get<CategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(controller['createUseCase']).toBeInstanceOf(CreateCategoryUseCase)
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCategoryUseCase)
    expect(controller['listUseCase']).toBeInstanceOf(ListCategoriesUseCase)
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase)
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCategoryUseCase)
  })

  describe('should create a category', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate()
    test.each(arrange)(
      'when body is $sendData',
      async ({ sendData, expected }) => {
        const presenter = await controller.create(sendData)
        const entity = await repository.findById(new Uuid(presenter.id))
        expect(entity.toJSON()).toStrictEqual({
          categoryId: presenter.id,
          createdAt: presenter.createdAt,
          ...expected,
        })
        const output = CategoryOutputMapper.toOutput(entity)
        expect(presenter).toEqual(new CategoryPresenter(output))
      },
    )
  })

  describe('should update a category', () => {
    const arrange = UpdateCategoryFixture.arrangeForUpdate()

    const category = Category.fake().aCategory().build()

    beforeEach(async () => {
      await repository.insert(category)
    })

    test.each(arrange)(
      'when body is $sendData',
      async ({ sendData, expected }) => {
        const presenter = await controller.update(
          category.categoryId.id,
          sendData,
        )
        const entity = await repository.findById(new Uuid(presenter.id))
        expect(entity.toJSON()).toStrictEqual({
          categoryId: presenter.id,
          createdAt: presenter.createdAt,
          name: expected.name ?? category.name,
          description:
            'description' in expected
              ? expected.description
              : category.description,
          isActive:
            expected.isActive === true || expected.isActive === false
              ? expected.isActive
              : category.isActive,
        })
        const output = CategoryOutputMapper.toOutput(entity)
        expect(presenter).toEqual(new CategoryPresenter(output))
      },
    )
  })

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)
    const response = await controller.remove(category.categoryId.id)
    expect(response).not.toBeDefined()
    await expect(repository.findById(category.categoryId)).resolves.toBeNull()
  })

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)
    const presenter = await controller.findOne(category.categoryId.id)

    expect(presenter.id).toBe(category.categoryId.id)
    expect(presenter.name).toBe(category.name)
    expect(presenter.description).toBe(category.description)
    expect(presenter.isActive).toBe(category.isActive)
    expect(presenter.createdAt).toStrictEqual(category.createdAt)
  })

  describe('search method', () => {
    describe('should sorted categories by createdAt', () => {
      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt()

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap))
      })

      test.each(arrange)(
        'when sendData is $sendData',
        async ({ sendData, expected }) => {
          const presenter = await controller.search(sendData)
          const { entities, ...paginationProps } = expected

          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map(CategoryOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          )
        },
      )
    })

    describe('should return categories using pagination, sort and filter', () => {
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted()

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap))
      })

      test.each(arrange)(
        'when sendData is $sendData',
        async ({ sendData, expected }) => {
          const presenter = await controller.search(sendData)
          const { entities, ...paginationProps } = expected

          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map(CategoryOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          )
        },
      )
    })
  })
})
