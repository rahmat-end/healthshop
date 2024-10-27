import * as express from "express"
import AuthenticationMiddlewares from '../middlewares/Auth'
import UserControllers from "../controllers/UserControllers"
import MedicineControllers from "../controllers/MedicineControllers"

const router = express.Router()

router.post("/auth/register", UserControllers.register)
router.post("/auth/login", UserControllers.login)
router.get("/auth/check", UserControllers.check)

router.get("/medicines", MedicineControllers.medicines)
router.get("/medicinesDB", MedicineControllers.find)
router.post("/medicine", MedicineControllers.add)
router.put("/medicine/:id", MedicineControllers.update)
router.delete("/medicine/:id", MedicineControllers.delete)

export default router