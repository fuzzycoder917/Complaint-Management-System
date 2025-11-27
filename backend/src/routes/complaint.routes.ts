import {Router} from 'express';
import { createComplaint, getComplaint, getComplaints, deleteComplaint, updateComplaint } from '../controllers/complaint.controllers.js';

const router = Router();
router.post('/new', createComplaint);

router.get('/', getComplaints);
router.route('/:id').get(getComplaint).put(updateComplaint).delete(deleteComplaint);
export default router;