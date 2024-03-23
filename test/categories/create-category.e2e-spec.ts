import { CategoryRepository } from '@core/category/domain/category.repository'
import { CATEGORY_PROVIDERS } from '@modules/categories-module/categories.providers'
import { CreateCategoryFixture } from '@modules/categories-module/testing/category-fixture'
import request from 'supertest'
import { startApp } from '@modules/shared-module/testing/helpers'

describe('CategoriesController (e2e)', () => {
  let categoryRepo: CategoryRepository
  const appHelper = startApp()

  beforeEach(async () => {
    categoryRepo = appHelper.app.get<CategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    )
  })

  describe('/categories (POST)', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate()
    test.each(arrange)(
      'when body is $sendData',
      async ({ sendData, expected }) => {
        const response = await request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(sendData)
          .expect(201)

        const keysInResponse = CreateCategoryFixture.keysInResponse
        expect(Object.keys(response.body)).toStrictEqual(['data'])
      },
    )
  })
})
