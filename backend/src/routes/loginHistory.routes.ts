import e, {Router} from 'express';
import { getLoginHistory, getLoginHistoryByUserId } from '../controllers/loginHistory.controller';


const router = Router();
router.get('/', getLoginHistory);
router.get('/user/:userId', getLoginHistoryByUserId);

export default router;