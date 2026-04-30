import { Metrics } from "./dashboard.model.js";
import type { IMetrics } from "./dashboard.model.js";
import mongoose from "mongoose";


export class dashboardService {
    storeMetrics = async (data: Partial<IMetrics>): Promise<IMetrics> => {
        const metrics = new Metrics(data);
        await metrics.save();
        return metrics;
    }

    getMarketIntelligence = async (quarter?: string): Promise<Partial<IMetrics>[]> => {
        const query = quarter ? { quarter } : {};

        const metrics = await Metrics.find(query)
            .select({
                average_premium_yield: 1,
                developer_coverage: 1,
                investor_nationalities: 1,
                transaction_growth: 1,
                capital_appreciation: 1,
                quarter: 1,
                _id: 0
            })
            .sort({ quarter: -1 });

        return metrics;
    }

    getWithAED = async (quarter?: string): Promise<Partial<IMetrics>[]> => {
        const query = quarter ? { quarter } : {};

        const metrics = await Metrics.find(query)
            .select({
                investor_nationalities: 1,
                transaction_growth: 1,
                average_premium_yield: 1,
                volume_aed: 1,
                quarter: 1,
                _id: 0
            })
            .sort({ quarter: -1 });

        return metrics;
    }
}

import { Insight } from "./insight.model.js";
import type { IInsight } from "./insight.model.js";


export class InsightService {
    async create(data: Partial<IInsight>): Promise<IInsight> {
        // Check for duplicates
        if (!data.type || !data.metric_key || !data.value || !data.unit) {
            throw new Error("Missing required fields");
        }

        // 🔥 Build query safely
        const query: any = {
            type: data.type,
            metric_key: data.metric_key,
        };

        if (data.entity) query.entity = data.entity;
        if (data.period) query.period = data.period;

        const existing = await Insight.findOne(query);

        if (existing) {
            throw new Error(
                `Insight already exists for ${data.type}${data.entity ? `/${data.entity}` : ""}/${data.metric_key}/${data.period}`
            );
        }

        const insight = new Insight(data);
        await insight.save();
        return insight;
    }

    async findAll(filters: {
        type?: string;
        entity?: string;
        metric_key?: string;
        period?: string;
        page?: number;
        limit?: number;
    }) {
        const { type, entity, metric_key, period, page = 1, limit = 50 } = filters;
        const query: any = {};

        if (type) query.type = type;
        if (entity) query.entity = entity;
        if (metric_key) query.metric_key = metric_key.toLowerCase();
        if (period) query.period = period;

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Insight.find(query)
                .sort({ period: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Insight.countDocuments(query),
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string): Promise<IInsight | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }
        return await Insight.findById(id);
    }

    async update(id: string, data: Partial<IInsight>): Promise<IInsight | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        const insight = await Insight.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!insight) {
            throw new Error("Insight not found");
        }

        return insight;
    }

    async delete(id: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        const result = await Insight.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Insight not found");
        }
    }

    async getDashboard(period?: string) {
        const matchStage: any = {};
        if (period) matchStage.period = period;

        // Get latest period if not specified
        let targetPeriod = period;
        if (!targetPeriod) {
            const latestPeriod = await Insight.findOne().sort({ period: -1 }).select("period");
            if (latestPeriod) targetPeriod = latestPeriod.period;
        }

        if (targetPeriod) matchStage.period = targetPeriod;

        const insights = await Insight.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        type: "$type",
                        entity: "$entity",
                        metric_key: "$metric_key",
                    },
                    metric_label: { $first: "$metric_label" },
                    value: { $first: "$value" },
                    unit: { $first: "$unit" },
                },
            },
            {
                $group: {
                    _id: "$_id.type",
                    items: {
                        $push: {
                            entity: "$_id.entity",
                            metric_key: "$_id.metric_key",
                            metric_label: "$metric_label",
                            value: "$value",
                            unit: "$unit",
                        },
                    },
                },
            },
            {
                $project: {
                    type: "$_id",
                    metrics: "$items",
                    _id: 0,
                },
            },
        ]);

        const formatted: any = {
            period: targetPeriod,
            market: {},
            location: [],
            developer: [],
        };

        insights.forEach((item) => {
            if (item.type === "market") {
                item.metrics.forEach((metric: any) => {
                    formatted.market[metric.metric_key] = {
                        value: metric.value,
                        label: metric.metric_label,
                        unit: metric.unit,
                    };
                });
            } else if (item.type === "location") {
                formatted.location.push(...item.metrics);
            } else if (item.type === "developer") {
                formatted.developer.push(...item.metrics);
            }
        });

        return formatted;
    }

    async getByEntity(entity: string, type?: string) {
        const query: any = { entity: entity };
        if (type) query.type = type;

        const insights = await Insight.find(query)
            .sort({ period: -1, metric_key: 1 })
            .lean();

        if (insights.length === 0) {
            throw new Error(`No insights found for entity: ${entity}`);
        }

        return insights;
    }
}