import { Request, Response } from "express"
import UserServices from "../services/UserServices"

export default new class UserControllers {
  register(req: Request, res: Response) {
    UserServices.register(req, res)
  }
  login(req: Request, res: Response) {
    UserServices.login(req, res)
  }
  check(req: Request, res: Response) {
    UserServices.check(req, res)
  }
}