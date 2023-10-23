import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"
import { Category } from "./category.entity"
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields"

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string | null

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean

  constructor(entity: Category) {
    Object.assign(this, entity)
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(aCategory: Category): boolean {
    return super.validate(new CategoryRules(aCategory))
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator()
  }
}