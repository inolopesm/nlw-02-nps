import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateSurveysUsers1614625102928 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'surveysUsers',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true
        },
        {
          name: 'userId',
          type: 'uuid'
        },
        {
          name: 'surveyId',
          type: 'uuid'
        },
        {
          name: 'value',
          type: 'number',
          isNullable: true
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'NOW()'
        }
      ],
      foreignKeys: [
        {
          name: 'FKUser',
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          columnNames: ['userId'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        {
          name: 'FKSurvey',
          referencedTableName: 'surveys',
          referencedColumnNames: ['id'],
          columnNames: ['surveyId'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('surveys_users')
  }
}
