import express,{Router} from 'express'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import productController from '../controllers/productController'
import { multer,storage} from '../middleware/multerMiddleware'

const upload = multer({storage : storage})
const router:Router = express.Router()



router.route("/").post(authMiddleware.isAuthenticated,authMiddleware.restricTo(Role.Admin),
upload.single('image'),productController.addProduct)
.get(productController.getAllProducts)

router.route("/:id").get(productController.getSingleProduct)
.delete(authMiddleware.isAuthenticated,authMiddleware.restricTo(Role.Admin),productController.deleteProduct)

export default router