import { Request, response, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { AppError } from '../errors/AppError'
import { SurveyUserRepository } from '../repositories/survey-user-repository'

class AnswerController {
  async execute (req: Request, res: Response) {
    const { value } = req.params
    const { u } = req.query
    const surveyUserRepository = getCustomRepository(SurveyUserRepository)
    const surveyUser = await surveyUserRepository.findOne({ id: String(u) })
    if (!surveyUser) throw new AppError('Survey User doest not exists!')
    surveyUser.value = Number(value)
    await surveyUserRepository.save(surveyUser)
    return response.json(surveyUser)
  }
}

export { AnswerController }
