import {Router} from 'express';
import { createIssue, getIssue, getIssues, deleteIssue, updateIssue } from '../controllers/issue.controllers.js';

const router = Router();
router.post('/new', createIssue);

router.get('/', getIssues);
router.route('/:id').get(getIssue).put(updateIssue).delete(deleteIssue);
export default router;