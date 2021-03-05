import { Router } from 'express'
import { SendMailController } from './controllers/send-mail-controller'
import { SurveyController } from './controllers/survey-controller'
import { UserController } from './controllers/user-controller'

const router = Router()

const userController = new UserController()
const surveyController = new SurveyController()
const sendMailController = new SendMailController()

router.post('/users', userController.create)
router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)
router.post('/sendMail', sendMailController.execute)

export { router }
