import { Request, Response } from 'express';
import { ExtinguisherService } from '../services/extinguisher.service.js';

export const ExtinguisherController = {
  async create(req: Request, res: Response) {
    try {
      const extinguisher = await ExtinguisherService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Fire extinguisher created successfully',
        data: extinguisher
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create extinguisher'
      });
    }
  },

  async list(req: Request, res: Response) {
    const items = await ExtinguisherService.findAll();
    return res.json({
      success: true,
      data: items
    });
  },

  async getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await ExtinguisherService.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Fire extinguisher not found'
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
      const updated = await ExtinguisherService.update(id, req.body);
      return res.json({
        success: true,
        message: 'Fire extinguisher updated successfully',
        data: updated
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update extinguisher'
      });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await ExtinguisherService.remove(id);
      return res.json({
        success: true,
        message: 'Fire extinguisher deleted successfully'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete extinguisher'
      });
    }
  }
};