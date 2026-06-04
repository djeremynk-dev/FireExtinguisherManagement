import { Request, Response } from 'express';
import { MaintenanceService } from '../services/maintainance.service.js';

export const MaintenanceController = {
  async create(req: Request, res: Response) {
    try {
      const log = await MaintenanceService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Maintenance log created successfully',
        data: log
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create maintenance log'
      });
    }
  },

  async list(req: Request, res: Response) {
    const items = await MaintenanceService.findAll();
    return res.json({
      success: true,
      data: items
    });
  },

  async getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await MaintenanceService.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance log not found'
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
      const updated = await MaintenanceService.update(id, req.body);
      return res.json({
        success: true,
        message: 'Maintenance log updated successfully',
        data: updated
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update maintenance log'
      });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await MaintenanceService.remove(id);
      return res.json({
        success: true,
        message: 'Maintenance log deleted successfully'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete maintenance log'
      });
    }
  }
};