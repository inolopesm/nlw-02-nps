import { Request, response, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveyUserRepository } from '../repositories/survey-user-repository'

class NpsController {
  async execute (req: Request, res: Response) {
    const { surveyId } = req.params
    const surveyUserRepository = getCustomRepository(SurveyUserRepository)
    const surveysUsers = await surveyUserRepository.find({ surveyId })
    const answers = { total: surveysUsers.length, detractors: 0, passives: 0, promoters: 0 }
    for (const { value } of surveysUsers) {
      if (value === undefined) continue
      const category = value < 7 ? 'detractors' : value < 9 ? 'passives' : 'promoters'
      answers[category]++
    }
    const nps = Number((((answers.promoters - answers.detractors) / answers.total) * 100).toFixed(2))
    return response.json({ ...answers, nps })
  }
}

export { NpsController }
