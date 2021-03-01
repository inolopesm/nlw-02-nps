import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { User } from '../models/user'

export class UserController {
  async create (req: Request, res: Response): Promise<Response | void> {
    const { name, email } = req.body
    const usersRepository = getRepository(User)
    const userAlreadyExists = await usersRepository.findOne({ email })
    if (userAlreadyExists) return res.status(400).json({ error: 'User already exists!' })
    const user = usersRepository.create({ name, email })
    await usersRepository.save(user)
    return res.status(201).end()
  }
}
