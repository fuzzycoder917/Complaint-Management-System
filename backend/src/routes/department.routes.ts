import {Router} from 'express';
import { createDepartment, getDepartment, getDepartments, deleteDepartment, updateDepartment } from '../controllers/department.controllers.js';

const router = Router();
router.post('/new', createDepartment);

router.get('/', getDepartments);
router.route('/:id').get(getDepartment).put(updateDepartment).delete(deleteDepartment);
export default router;