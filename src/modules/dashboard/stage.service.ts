// src/services/stage.service.ts
import { Stage } from "./stage.model.js";
import type { IStage } from "./stage.model.js";
import mongoose from "mongoose";

export class StageService {

    // Create single stage
    create = async (data: Partial<IStage>): Promise<IStage> => {
        // Check if order is unique
        const existingOrder = await Stage.findOne({ order: data.order }as any);
        if (existingOrder) {
            throw new Error(`Stage with order ${data.order} already exists`);
        }

        // Check if tag is unique
        const existingTag = await Stage.findOne({ tag: data.tag } as any);
        if (existingTag) {
            throw new Error(`Stage with tag "${data.tag}" already exists`);
        }

        const stage = new Stage(data);
        await stage.save();
        return stage;
    };

    // Get all stages with filtering
    findAll = async (filters: {
        isActive?: boolean;
        category?: string;
        page?: number;
        limit?: number;
        sortBy?: 'order' | 'createdAt' | 'tag';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: IStage[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> => {
        const {
            isActive,
            category,
            page = 1,
            limit = 10,
            sortBy = 'order',
            sortOrder = 'asc'
        } = filters;

        const query: any = {};

        if (isActive !== undefined) query.isActive = isActive;
        if (category) query.category = category;

        const skip = (page - 1) * limit;
        const sort: any = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const [data, total] = await Promise.all([
            Stage.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Stage.countDocuments(query),
        ]);

        return {
            data: data as any,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    };

    // Get all active stages in order
    getActiveStages = async (): Promise<IStage[]> => {
        const stages = await Stage.find({ isActive: true })
            .sort({ order: 1 })
            .lean();
        return stages as any;
    };

    // Get stage by ID
    findById = async (id: string): Promise<IStage | null> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }
        return await Stage.findById(id);
    };

    // Get stage by order
    findByOrder = async (order: number): Promise<IStage | null> => {
        return await Stage.findOne({ order });
    };

    // Get stage by tag
    findByTag = async (tag: string): Promise<IStage | null> => {
        return await Stage.findOne({ tag });
    };

    // Update stage
    update = async (id: string, data: Partial<IStage>): Promise<IStage | null> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        // If updating order, check for uniqueness
        if (data.order !== undefined) {
            const existingStage = await Stage.findOne({
                order: data.order,
                _id: { $ne: id },
            });
            if (existingStage) {
                throw new Error(`Stage with order ${data.order} already exists`);
            }
        }

        // If updating tag, check for uniqueness
        if (data.tag) {
            const existingStage = await Stage.findOne({
                tag: data.tag,
                _id: { $ne: id },
            });
            if (existingStage) {
                throw new Error(`Stage with tag "${data.tag}" already exists`);
            }
        }

        const stage = await Stage.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!stage) {
            throw new Error("Stage not found");
        }

        return stage;
    };

    // Delete stage
    delete = async (id: string): Promise<void> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        const result = await Stage.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Stage not found");
        }
    };

    // Reorder stages
    reorderStages = async (
        stages: Array<{ id: string; order: number }>
    ): Promise<IStage[]> => {
        const results: IStage[] = [];

        for (const { id, order } of stages) {
            const stage = await Stage.findByIdAndUpdate(
                id,
                { order },
                { new: true, runValidators: true }
            );
            if (!stage) {
                throw new Error(`Stage with id ${id} not found`);
            }
            results.push(stage);
        }

        return results;
    };

    // Toggle stage active status
    toggleActive = async (id: string): Promise<IStage | null> => {
        const stage = await Stage.findById(id);
        if (!stage) {
            throw new Error("Stage not found");
        }

        stage.isActive = !stage.isActive;
        await stage.save();
        return stage;
    };

    // Get stage with metrics summary
    getStageWithMetrics = async (idOrOrder: string | number): Promise<any> => {
        let stage: IStage | null = null;

        if (typeof idOrOrder === 'string') {
            stage = await Stage.findById(idOrOrder);
        } else {
            stage = await Stage.findOne({ order: idOrOrder });
        }

        if (!stage) {
            throw new Error("Stage not found");
        }

        return {
            id: stage._id,
            tag: stage.tag,
            order: stage.order,
            title: stage.title,
            body: stage.body,
            metrics: stage.metrics || [],
            category: stage.category,
        };
    };
}