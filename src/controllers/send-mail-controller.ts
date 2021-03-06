import path from 'path'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveyRepository } from '../repositories/survey-repository'
import { SurveyUserRepository } from '../repositories/survey-user-repository'
import { UserRepository } from '../repositories/user-repository'
import { sendMailService } from '../services/send-mail-service'
import { AppError } from '../errors/AppError'

class SendMailController {
  async execute (req: Request, res: Response) {
    const { email, surveyId } = req.body

    const userRepository = getCustomRepository(UserRepository)
    const surveyRepository = getCustomRepository(SurveyRepository)
    const surveyUserRepository = getCustomRepository(SurveyUserRepository)

    const user = await userRepository.findOne({ email })
    if (user === undefined) throw new AppError('User does not exists')
    const { id: userId, name } = user

    const survey = await surveyRepository.findOne({ id: surveyId })
    if (survey === undefined) throw new AppError('Survey doest not exists')
    const { title, description } = survey

    const link = process.env.URL_MAIL
    const variables = { name, title, description, id: '', link }
    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'nps-mail.hbs')

    const surveyUserAlreadyExists = await surveyUserRepository.findOne({
      where: { userId, value: null },
      relations: ['users', 'surveys']
    })
    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id
      await sendMailService.execute(email, title, variables, npsPath)
      return res.json(surveyUserAlreadyExists)
    }

    const surveyUser = surveyUserRepository.create({ userId, surveyId })
    await surveyUserRepository.save(surveyUser)
    variables.id = surveyUser.id
    await sendMailService.execute(email, title, variables, npsPath)

    return res.json(surveyUser)
  }
}

export { SendMailController }
