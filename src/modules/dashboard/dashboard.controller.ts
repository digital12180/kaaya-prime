import type { Request, Response } from "express";
import { dashboardService } from "./dashboard.service.js";


export class dashboardController {
    private dashboardService: dashboardService;
    constructor() {
        this.dashboardService = new dashboardService();
    }
    storeMetrics = async (req: Request, res: Response) => {
        try {
            const metricsData = req.body;
            const metrics = await this.dashboardService.storeMetrics(metricsData);
            res.status(201).json({
                success: true,
                data: metrics,
                message: "Metrics stored successfully"
            });
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(409).json({
                    success: false,
                    message: "Metrics for this quarter already exist"
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    getMarketIntelligence = async (req: Request, res: Response) => {
        try {
            const { quarter } = req.query;
            const intelligence = await this.dashboardService.getMarketIntelligence(quarter as string);
            res.status(200).json({
                success: true,
                data: intelligence
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    getWithAED = async (req: Request, res: Response) => {
        try {
            const { quarter } = req.query;
            const aedData = await this.dashboardService.getWithAED(quarter as string);
            res.status(200).json({
                success: true,
                data: aedData
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }  

    getMetricsByQuarter = async (req: Request, res: Response) => {
        try {
            const { quarter } = req.params;
            const metrics = await this.dashboardService.getMetricsByQuarter(quarter as string);
            res.status(200).json({
                success: true,
                data: metrics
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    // NEW: Update metrics by quarter (full update)
    updateMetrics = async (req: Request, res: Response) => {
        try {
            const { quarter } = req.params;
            const updateData = req.body;
            const metrics = await this.dashboardService.updateMetrics(quarter as string, updateData);
            res.status(200).json({
                success: true,
                data: metrics,
                message: "Metrics updated successfully"
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    // NEW: Patch metrics (partial update)
    patchMetrics = async (req: Request, res: Response) => {
        try {
            const { quarter } = req.params;
            const updateData = req.body;
            const metrics = await this.dashboardService.patchMetrics(quarter as string, updateData);
            res.status(200).json({
                success: true,
                data: metrics,
                message: "Metrics patched successfully"
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.includes('No valid fields')) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    // NEW: Delete metrics by quarter
    deleteMetrics = async (req: Request, res: Response) => {
        try {
            const { quarter } = req.params;
            await this.dashboardService.deleteMetrics(quarter as string );
            res.status(200).json({
                success: true,
                message: `Metrics for quarter ${quarter} deleted successfully`
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    // NEW: Get all metrics with pagination
    getAllMetrics = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
            
            const result = await this.dashboardService.getAllMetrics(page, limit, sortOrder);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    getTopPerformers = async (req: Request, res: Response) => {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            const performers = await this.dashboardService.getTopPerformers(limit);
            res.status(200).json({
                success: true,
                data: performers
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}


import { InsightService } from "./dashboard.service.js";

const service = new InsightService();

export class InsightController {
  private insightService: InsightService;

  constructor() {
    this.insightService = new InsightService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const insight = await this.insightService.create(req.body);
      res.status(201).json({
        success: true,
        data: insight,
        message: "Insight created successfully",
      });
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, entity, metric_key, period, page, limit } = req.query;

      const result = await this.insightService.findAll({
        type: type as string,
        entity: entity as string,
        metric_key: metric_key as string,
        period: period as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      } as any);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const insight = await this.insightService.findById(id as string);

      if (!insight) {
        res.status(404).json({
          success: false,
          message: "Insight not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: insight,
      });
    } catch (error: any) {
      if (error.message === "Invalid ID format") {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {

      const insight = await this.insightService.update(req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        data: insight,
        message: "Insight updated successfully",
      });
    } catch (error: any) {
      if (error.message === "Invalid ID format" || error.message === "Insight not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.insightService.delete(req.params.id as string);
      res.status(200).json({
        success: true,
        message: "Insight deleted successfully",
      });
    } catch (error: any) {
      if (error.message === "Invalid ID format" || error.message === "Insight not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };

  dashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { period } = req.query;
      const dashboardData = await this.insightService.getDashboard(period as string);

      res.status(200).json({
        success: true,
        data: dashboardData,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  getByEntity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { entity } = req.params;
      const { type } = req.query;
      const insights = await this.insightService.getByEntity(entity as string, type as string);

      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (error: any) {
      if (error.message.includes("No insights found")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };
}


