import {Router} from 'express'
import AuthController from '../controllers/userController'
import { error } from 'console'
import errorHandler from '../services/catchAsyncError'
const router:Router = Router()


router.route("/register")
.post(errorHandler(AuthController.registerUser))

router.route("/login").post(errorHandler(AuthController.loginUser))

export default router 