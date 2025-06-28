import {Router} from 'express'
import {getAllUser, getTimeToken, getUserByUsername, login, saveUser, updateToken, updateUser, deleteUser} from "../controllers/auth.controller"


const router = Router();

router.post('/login-user', login);
router.get('/getTime/:userId', getTimeToken);
router.patch('/update/:userId', updateToken);
router.get('/users', getAllUser);
router.post('/user', saveUser);
router.get('/username/:userName', getUserByUsername);
router.patch('/updateUser/:userId', updateUser);
router.patch('/deleteUser/:userId', deleteUser);



export default router;