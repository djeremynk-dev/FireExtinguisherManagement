import { Request, Response } from 'express';
import { ReportingService } from '../services/reporting.services.js';

export const ReportingController = {
  async summary(req: Request, res: Response) {
    try {
      const { from, to } = req.query as { from?: string; to?: string };
      const data = await ReportingService.getSummary({ from, to });
      return res.json({
        success: true,
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch summary'
      });
    }
  },

  async extinguisherStats(req: Request, res: Response) {
    try {
      const { from, to, status, location } = req.query as {
        from?: string;
        to?: string;
        status?: string;
        location?: string;
      };
      const data = await ReportingService.getExtinguisherStats({ from, to, status, location });
      return res.json({
        success: true,
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch extinguisher stats'
      });
    }
  },

  async inspectionStats(req: Request, res: Response) {
    try {
      const { from, to, status, outcome } = req.query as {
        from?: string;
        to?: string;
        status?: string;
        outcome?: string;
      };
      const data = await ReportingService.getInspectionStats({ from, to, status, outcome });
      return res.json({
        success: true,
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch inspection stats'
      });
    }
  },

  async maintenanceStats(req: Request, res: Response) {
    try {
      const { from, to, status, type } = req.query as {
        from?: string;
        to?: string;
        status?: string;
        type?: string;
      };
      const data = await ReportingService.getMaintenanceStats({ from, to, status, type });
      return res.json({
        success: true,
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch maintenance stats'
      });
    }
  }
};