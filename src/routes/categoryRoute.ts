import express,{Router} from 'express'
import authMiddleware, {Role} from '../middleware/authMiddleware'
import categoryController from '../controllers/categoryController'
const router:Router = express.Router()

router.route("/")
.post(authMiddleware.isAuthenticated,authMiddleware.restricTo
    (Role.Admin),categoryController.addCategory)
    .get(categoryController.getCategories)

    router.route("/:id")
    .delete(authMiddleware.isAuthenticated,authMiddleware.restricTo(Role.Admin),
categoryController.deleteCategory)
.patch(authMiddleware.isAuthenticated,authMiddleware.restricTo(Role.Admin),
categoryController.updateCategory)


    export default router