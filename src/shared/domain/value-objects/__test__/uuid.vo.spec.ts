import { validate as uuidValidate } from "uuid"
import { InvalidUuidError, Uuid } from "../uuid.vo"

describe('Uuid Unit Test', () => {

  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')
  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid("invalid-uuid")
    }).toThrowError(new InvalidUuidError)
    
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should create a valid uuid', () => {
    const uuid = new Uuid()

    expect(uuid).toBeDefined()
    expect(uuid.id).toBeDefined
    expect(uuidValidate(uuid.id)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should accept a valid uuid', () => {
    const uuidString = 'c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c'

    const uuid = new Uuid(uuidString);

    expect(uuid.id).toBe(uuidString);
    expect(uuidValidate(uuid.id)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})