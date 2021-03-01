import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateSurveys1614567245848 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'surveys',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true
        },
        {
          name: 'title',
          type: 'varchar'
        },
        {
          name: 'description',
          type: 'varchar'
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'NOW()'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('surveys')
  }
}
