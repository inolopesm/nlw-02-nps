import path from 'path'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveyRepository } from '../repositories/survey-repository'
import { SurveyUserRepository } from '../repositories/survey-user-repository'
import { UserRepository } from '../repositories/user-repository'
import { sendMailService } from '../services/send-mail-service'

class SendMailController {
  async execute (req: Request, res: Response) {
    const { email, surveyId } = req.body

    const userRepository = getCustomRepository(UserRepository)
    const surveyRepository = getCustomRepository(SurveyRepository)
    const surveyUserRepository = getCustomRepository(SurveyUserRepository)

    const user = await userRepository.findOne({ email })
    if (user === undefined) return res.status(400).json({ error: 'User does not exists' })
    const { id: userId, name } = user

    const survey = await surveyRepository.findOne({ id: surveyId })
    if (survey === undefined) return res.status(400).json({ error: 'Survey doest not exists' })
    const { title, description } = survey

    const link = process.env.URL_MAIL
    const variables = { name, title, description, userId, link }
    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'nps-mail.hbs')

    const surveyUserAlreadyExists = surveyUserRepository.findOne({
      where: [{ userId }, { value: null }],
      relations: ['users', 'surveys']
    })
    if (surveyUserAlreadyExists) {
      await sendMailService.execute(email, title, variables, npsPath)
      return res.json(surveyUserAlreadyExists)
    }

    const surveyUser = surveyUserRepository.create({ userId, surveyId })
    await surveyUserRepository.save(surveyUser)
    await sendMailService.execute(email, title, variables, npsPath)

    return res.json(surveyUser)
  }
}

export { SendMailController }
