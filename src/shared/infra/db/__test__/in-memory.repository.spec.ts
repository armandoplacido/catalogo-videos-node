import { Entity } from "../../../domain/entity"
import { Uuid } from "../../../domain/value-objects/uuid.vo"
import { InMemoryRepository } from "../in-memory/in-memory.repository"



type StubEntityConstructor = {
  entityId?: Uuid
  name:string
  price: number
}

class StubEntity extends Entity {
  entityId: Uuid
  name:string
  price: number

  constructor(props: StubEntityConstructor){
    super()
    this.entityId = props.entityId ?? new Uuid()
    this.name = props.name
    this.price = props.price
  }

  toJSON() {
    return {
      entityId: this.entityId.id,
      name: this.name,
      price: this.price
    }
  }

}

class StubInMemoryRepository extends InMemoryRepository<StubEntity,Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }

}

describe('InMemoryRepository Unit Test', () => {
  let repository: StubInMemoryRepository

  beforeEach(() => {
    repository = new StubInMemoryRepository()
  })

  test('should inset a new entity', async () => {
    const aStubEntity = new StubEntity({
      name: 'Test',
      price: 100
    })

    await repository.insert(aStubEntity)

    expect(repository.items.length).toBe(1)
    expect(repository.items[0]).toBe(aStubEntity)
  })

  test('should bulk insert entities', async () => {
    const someEntities = [
      new StubEntity({
        name: 'Test',
        price: 100
      }),
      new StubEntity({
        name: 'Test',
        price: 100
      })
    ]

    await repository.bulkInsert(someEntities)

    expect(repository.items.length).toBe(2)
    expect(repository.items[0]).toBe(someEntities[0])
    expect(repository.items[1]).toBe(someEntities[1])
  })

  test('should returns all entities', async () => {
    const aStubEntity = new StubEntity({
      name: 'Test',
        price: 100
    })

    await repository.insert(aStubEntity)

    const aStubEntityList = await repository.findAll()

    expect(aStubEntityList).toStrictEqual([aStubEntity])
  })

  test('should return entity by id',async () => {
    const aStubEntity = new StubEntity({
      name: 'Test',
      price: 100
    })

    await repository.insert(aStubEntity)

    expect(repository.items).toHaveLength(1)
    expect(aStubEntity.toJSON()).toStrictEqual(repository.items[0].toJSON())

    const actualStubEntity = await repository.findById(aStubEntity.entityId)

    expect(actualStubEntity.toJSON()).toStrictEqual(repository.items[0].toJSON())
  })

  test('should return null when entity not found',async () => {
    const anWrongEntityId = new Uuid()
    const aStubEntity = new StubEntity({
      name: 'Test',
      price: 100
    })

    await repository.insert(aStubEntity)

    expect(repository.items).toHaveLength(1)
    expect(aStubEntity.toJSON()).toStrictEqual(repository.items[0].toJSON())

    const actualStubEntity = await repository.findById(anWrongEntityId)

    expect(actualStubEntity).toBeNull()
  })

  test('should updated a exists entity', async () => {
    const aStubEntity = new StubEntity({
      name: 'Test',
      price: 100
    })

    await repository.insert(aStubEntity)

    expect(repository.items).toHaveLength(1)
    expect(aStubEntity.toJSON()).toStrictEqual(repository.items[0].toJSON())

    const actualStubEntity = new StubEntity({
      entityId: aStubEntity.entityId,
      name: 'New Test',
      price: 200
    })

    await repository.update(actualStubEntity)

    expect(repository.items).toHaveLength(1)
    expect(actualStubEntity.toJSON()).toStrictEqual(repository.items[0].toJSON())
  })

  test('should deletes an entity',async () => {
    const aStubEntity = new StubEntity({
      name: 'Test',
      price: 100
    })

    await repository.insert(aStubEntity)

    expect(repository.items).toHaveLength(1)
    expect(repository.items[0].toJSON()).toStrictEqual(aStubEntity.toJSON())

    await repository.delete(aStubEntity.entityId)

    expect(repository.items).toHaveLength(0)
  })
})