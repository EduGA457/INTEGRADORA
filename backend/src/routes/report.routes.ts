import express from 'express';
import {
    getAllReports, getReportsByUserId, getReportsNearLocation, updateReportStatus, getReportsByDateRange } from '../controllers/report.controller';

const router = express.Router();

router.get('/', getAllReports);
router.get('/user/:userId', getReportsByUserId);
router.get('/near', getReportsNearLocation);
router.get('/date', getReportsByDateRange);
router.patch('/:id', updateReportStatus);

export default router;