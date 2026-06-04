import { prisma } from '../lib/prisma.js';

type DateRangeFilter = { from?: string; to?: string };

const buildDateFilter = (range: DateRangeFilter, field: 'createdAt' | 'scheduledDate' | 'serviceDate' | 'expiryDate') => {
  const where: any = {};
  if (range.from || range.to) {
    where[field] = {};
    if (range.from) {
      where[field].gte = new Date(range.from);
    }
    if (range.to) {
      where[field].lte = new Date(range.to);
    }
  }
  return where;
};

export const ReportingService = {
  async getSummary(range: DateRangeFilter) {
    const extinguisherWhere = buildDateFilter(range, 'createdAt');
    const inspectionWhere = buildDateFilter(range, 'createdAt');
    const maintenanceWhere = buildDateFilter(range, 'createdAt');

    const [extinguisherCount, inspectionCount, maintenanceCount] = await Promise.all([
      prisma.extinguisherSnapshot.count({ where: extinguisherWhere }),
      prisma.inspectionSnapshot.count({ where: inspectionWhere }),
      prisma.maintenanceSnapshot.count({ where: maintenanceWhere })
    ]);

    return {
      extinguishers: extinguisherCount,
      inspections: inspectionCount,
      maintenanceLogs: maintenanceCount
    };
  },

  async getExtinguisherStats(params: { from?: string; to?: string; status?: string; location?: string }) {
    const where: any = buildDateFilter(params, 'createdAt');

    if (params.status) {
      where.status = params.status;
    }

    if (params.location) {
      where.location = { contains: params.location, mode: 'insensitive' };
    }

    const total = await prisma.extinguisherSnapshot.count({ where });

    const byStatus = await prisma.extinguisherSnapshot.groupBy({
      by: ['status'],
      _count: { _all: true },
      where
    });

    const expiringSoonWhere: any = {};
    if (params.from || params.to) {
      expiringSoonWhere.expiryDate = {};
      if (params.from) expiringSoonWhere.expiryDate.gte = new Date(params.from);
      if (params.to) expiringSoonWhere.expiryDate.lte = new Date(params.to);
    } else {
      const now = new Date();
      const in30Days = new Date();
      in30Days.setDate(now.getDate() + 30);
      expiringSoonWhere.expiryDate = {
        gte: now,
        lte: in30Days
      };
    }

    const expiringSoon = await prisma.extinguisherSnapshot.count({
      where: expiringSoonWhere
    });

    return {
      total,
      byStatus: byStatus.map((row) => ({
        status: row.status,
        count: row._count._all
      })),
      expiringSoon
    };
  },

  async getInspectionStats(params: { from?: string; to?: string; status?: string; outcome?: string }) {
    const where: any = buildDateFilter(params, 'scheduledDate');

    if (params.status) {
      where.status = params.status;
    }

    if (params.outcome) {
      where.outcome = params.outcome;
    }

    const total = await prisma.inspectionSnapshot.count({ where });

    const byStatus = await prisma.inspectionSnapshot.groupBy({
      by: ['status'],
      _count: { _all: true },
      where
    });

    const byOutcome = await prisma.inspectionSnapshot.groupBy({
      by: ['outcome'],
      _count: { _all: true },
      where
    });

    return {
      total,
      byStatus: byStatus.map((row) => ({
        status: row.status,
        count: row._count._all
      })),
      byOutcome: byOutcome.map((row) => ({
        outcome: row.outcome,
        count: row._count._all
      }))
    };
  },

  async getMaintenanceStats(params: { from?: string; to?: string; status?: string; type?: string }) {
    const where: any = buildDateFilter(params, 'serviceDate');

    if (params.status) {
      where.status = params.status;
    }

    if (params.type) {
      where.maintenanceType = { contains: params.type, mode: 'insensitive' };
    }

    const total = await prisma.maintenanceSnapshot.count({ where });

    const byStatus = await prisma.maintenanceSnapshot.groupBy({
      by: ['status'],
      _count: { _all: true },
      where
    });

    const byType = await prisma.maintenanceSnapshot.groupBy({
      by: ['maintenanceType'],
      _count: { _all: true },
      where
    });

    return {
      total,
      byStatus: byStatus.map((row) => ({
        status: row.status,
        count: row._count._all
      })),
      byType: byType.map((row) => ({
        type: row.maintenanceType,
        count: row._count._all
      }))
    };
  }
};