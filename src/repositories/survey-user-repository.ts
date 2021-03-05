import { EntityRepository, Repository } from 'typeorm'
import { SurveyUser } from '../models/survery-user'

@EntityRepository(SurveyUser)
class SurveyUserRepository extends Repository<SurveyUser> {
  //
}

export { SurveyUserRepository }
