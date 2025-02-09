import {Router} from 'express'
const router:Router = express.Router()


router.route("/register")
.post(AbortController.registerUser)


export default router 