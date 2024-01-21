import { SortDirection } from '@core/shared/domain/repository/search-params'
import { CreateCategoryOutput } from '@core/category/application/use-cases/create/create-category.use-case'

import { UpdateCategoryInput } from '@core/category/application/use-cases/update/update-category.input'
import { GetCategoryOutput } from '@core/category/application/use-cases/get/get-category.use-case'
import { ListCategoriesOutput } from '@core/category/application/use-cases/list/list-categories.use-case'
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter'
import { CategoriesController } from '../categories.controller'
import { CreateCategoryDto } from '../dto/create-category.dto'

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController

  beforeEach(async () => {
    controller = new CategoriesController()
  })

  it('should creates a category', async () => {
    //Arrange
    const output: CreateCategoryOutput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt: new Date(),
    }
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase
    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      isActive: true,
    }

    //Act
    const presenter = await controller.create(input)

    //Assert
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input)
    expect(presenter).toBeInstanceOf(CategoryPresenter)
    expect(presenter).toStrictEqual(new CategoryPresenter(output))
  })

  it('should updates a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104'
    const output: CreateCategoryOutput = {
      id,
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt: new Date(),
    }
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase
    const input: Omit<UpdateCategoryInput, 'id'> = {
      name: 'Movie',
      description: 'some description',
      isActive: true,
    }
    const presenter = await controller.update(id, input)
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input })
    expect(presenter).toBeInstanceOf(CategoryPresenter)
    expect(presenter).toStrictEqual(new CategoryPresenter(output))
  })

  it('should deletes a category', async () => {
    const expectedOutput = undefined
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    }
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104'
    expect(controller.remove(id)).toBeInstanceOf(Promise)
    const output = await controller.remove(id)
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id })
    expect(expectedOutput).toStrictEqual(output)
  })

  it('should gets a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104'
    const output: GetCategoryOutput = {
      id,
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt: new Date(),
    }
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase
    const presenter = await controller.findOne(id)
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id })
    expect(presenter).toBeInstanceOf(CategoryPresenter)
    expect(presenter).toStrictEqual(new CategoryPresenter(output))
  })

  it('should list categories', async () => {
    const output: ListCategoriesOutput = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          description: 'some description',
          isActive: true,
          createdAt: new Date(),
        },
      ],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase
    const searchParams = {
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'desc' as SortDirection,
      filter: 'test',
    }
    const presenter = await controller.search(searchParams)
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter)
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams)
    expect(presenter).toEqual(new CategoryCollectionPresenter(output))
  })
})