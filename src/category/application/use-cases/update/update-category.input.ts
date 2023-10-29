import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator"

export type UpdatedCategoryInputConstructorProps = {
  name:string
  description?: string | null
  isActive: boolean
}

export class UpdatedCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?:string | null

  @IsBoolean()
  @IsOptional()
  isActive: boolean
  
  constructor(props: UpdatedCategoryInput) {
    if(!props) return
    this.name = props.name
    this.description = props.description
    this.isActive = props.isActive
  }
}


export class ValidateCategoryInput {
  static validate(input: UpdatedCategoryInput) {
    return validateSync(input)
  }
}