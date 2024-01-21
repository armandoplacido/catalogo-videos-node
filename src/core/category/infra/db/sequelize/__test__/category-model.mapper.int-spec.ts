import { setupSequelize } from '@core/shared/infra/testing/helpers'
import { CategoryModel } from '../category.model'
import { CategoryModelMapper } from '../category-model.mapper'
import { LoadEntityError } from '@core/shared/domain/validators/validation.error'
import { Category } from '@core/category/domain/category.entity'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel],
  })

  test('should throws error when category is invalid', () => {
    expect.assertions(2)
    const aCategoryModel = CategoryModel.build({
      categoryId: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'a'.repeat(256),
    })
    try {
      CategoryModelMapper.toEntity(aCategoryModel)
      fail('The category is valid, but it needs throws a EntityValidationError')
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError)
      expect((e as LoadEntityError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ])
    }
  })

  test('should convert a category aCategoryModel to a category entity', () => {
    const createdAt = new Date()
    const aCategoryModel = CategoryModel.build({
      categoryId: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      description: 'some description',
      isActive: true,
      createdAt,
    })
    const aggregate = CategoryModelMapper.toEntity(aCategoryModel)
    expect(aggregate.toJSON()).toStrictEqual(
      Category.fake()
        .aCategory()
        .withUuid(new Uuid('5490020a-e866-4229-9adc-aa44b83234c4'))
        .withName('some value')
        .withDescription('some description')
        .activate()
        .withCreatedAt(createdAt)
        .build()
        .toJSON(),
    )
  })

  test('should conver a category entity to a category aCategoryModel', () => {
    const createdAt = new Date()
    const aCategory = Category.fake()
      .aCategory()
      .withCreatedAt(createdAt)
      .build()

    const aCategoryModel = CategoryModelMapper.toModel(aCategory)

    expect(aCategoryModel.toJSON()).toStrictEqual(aCategory.toJSON())
  })
})
