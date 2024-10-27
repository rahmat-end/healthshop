import { Request, Response } from "express"
import MedicineServices from "../services/MedicineServices"

export default new class MedicineControllers {
  medicines(req: Request, res: Response) {
    MedicineServices.medicines(req, res)
  }
  find(req: Request, res: Response) {
    MedicineServices.find(req, res)
  }
  add(req: Request, res: Response) {
    MedicineServices.add(req, res)
  }
  update(req: Request, res: Response) {
    MedicineServices.update(req, res)
  }
  delete(req: Request, res: Response) {
    MedicineServices.delete(req, res)
  }
}