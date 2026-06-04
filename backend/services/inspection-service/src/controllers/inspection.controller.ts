import { Request, Response } from 'express';
import { InspectionService } from '../services/inspection.service.js';

export const InspectionController = {
  async schedule(req: Request, res: Response) {
    try {
      const inspection = await InspectionService.schedule(req.body);
      return res.status(201).json({
        success: true,
        message: 'Inspection scheduled successfully',
        data: inspection
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to schedule inspection'
      });
    }
  },

  async list(req: Request, res: Response) {
    const items = await InspectionService.findAll();
    return res.json({
      success: true,
      data: items
    });
  },

  async getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await InspectionService.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found'
      });
    }

    return res.json({
      success: true,
      data: item
    });
  },

  async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updated = await InspectionService.update(id, req.body);
      return res.json({
        success: true,
        message: 'Inspection updated successfully',
        data: updated
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update inspection'
      });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await InspectionService.remove(id);
      return res.json({
        success: true,
        message: 'Inspection deleted successfully'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete inspection'
      });
    }
  }
};