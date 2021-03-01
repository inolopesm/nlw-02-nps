import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Entity('surveys')
class Survey {
  @PrimaryColumn()
  readonly id: string

  @Column()
  title!: string

  @Column()
  description!: string

  @CreateDateColumn()
  createdAt!: Date

  constructor () {
    this.id = uuid()
  }
}

export { Survey }
