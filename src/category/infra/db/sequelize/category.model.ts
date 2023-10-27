import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

export type CategoryModelProps = {
  categoryId: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: Date
}

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model<CategoryModelProps> {
  @PrimaryKey
  @Column({field:'category_id', type: DataType.UUID})
  declare categoryId: string

  @Column({field:'name', allowNull: false ,type: DataType.STRING(255)})
  declare name:string

  @Column({field:'description', allowNull: true, type: DataType.TEXT})
  declare description: string | null

  @Column({field:'is_active', allowNull:false, type: DataType.BOOLEAN})
  declare isActive: boolean

  @Column({field:'created_at', allowNull: false, type: DataType.DATE(3)})
  declare createdAt: Date
}