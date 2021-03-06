import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/user-repository'
import * as yup from 'yup'
import { AppError } from '../errors/AppError'

export class UserController {
  async create (req: Request, res: Response): Promise<Response | void> {
    const schema = yup.object().shape({ name: yup.string().required(), email: yup.string().email().required() })
    const isValid = await schema.isValid(req.body)
    if (!isValid) throw new AppError('Validation Failed!')
    const { name, email } = req.body
    const usersRepository = getCustomRepository(UserRepository)
    const userAlreadyExists = await usersRepository.findOne({ email })
    if (userAlreadyExists) throw new AppError('User already exists!')
    const user = usersRepository.create({ name, email })
    await usersRepository.save(user)
    return res.status(201).json(user)
  }
}
