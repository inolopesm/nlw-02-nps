import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs/promises'

class SendMailService {
  private client!: Transporter

  constructor () {
    nodemailer.createTestAccount().then(account => {
      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })
    })
  }

  async execute (to: string, subject: string, variables: object, path: string) {
    const templateFileContent = (await fs.readFile(path)).toString('utf-8')
    const mailTemplateParse = handlebars.compile(templateFileContent)
    const html = mailTemplateParse(variables)
    const from = 'NPS <naoresponder@nps.com.br>'
    const message = await this.client.sendMail({ to, subject, html, from })
    console.log('Message sent: %s', message.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}

const sendMailService = new SendMailService()

export { sendMailService }
