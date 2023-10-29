import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator"

export type CreateCategoryInputConstructorProps = {
  name:string
  description?: string | null
  isActive: boolean
}

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?:string | null

  @IsBoolean()
  @IsOptional()
  isActive: boolean
  
  constructor(props: CreateCategoryInputConstructorProps) {
    if(!props) return
    this.name = props.name
    this.description = props.description
    this.isActive = props.isActive
  }
}


export class ValidateCategoryInput {
  static validate(input: CreateCategoryInput) {
    return validateSync(input)
  }
}