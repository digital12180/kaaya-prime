// src/services/developer-score.service.ts
import { DeveloperScore } from "./developer.model.js";
import type { IDeveloperScore } from "./developer.model.js"
import mongoose from "mongoose";

export class DeveloperScoreService {

    create = async (data: Partial<IDeveloperScore>): Promise<IDeveloperScore> => {
        // Check for duplicate developer in same quarter
        const query: any = { developer: data.developer };
        if (data.quarter) query.quarter = data.quarter;
        else query.quarter = null;

        const existing = await DeveloperScore.findOne(query);

        if (existing) {
            throw new Error(`Developer score for "${data.developer}" ${data.quarter ? `in quarter ${data.quarter} ` : ''}already exists`);
        }

        // Auto-calculate dashOffset if not provided
        if (!data.dashOffset && data.score) {
            data.dashOffset = 100 - data.score;
        }

        const developerScore = new DeveloperScore(data);
        await developerScore.save();
        return developerScore;
    };

    // Bulk create from specific format
    bulkCreateFromFormat = async (
        scoreData: {
            type: string;
            label: string;
            data: Array<{ developer: string; score: number; dashOffset?: number }>;
        },
        quarter?: string
    ): Promise<IDeveloperScore[]> => {
        const results: IDeveloperScore[] = [];
        const errors: any[] = [];

        for (const item of scoreData.data) {
            try {
                const dashOffset = item.dashOffset !== undefined ? item.dashOffset : 100 - item.score;

                const developerScore = new DeveloperScore({
                    developer: item.developer,
                    score: item.score,
                    dashOffset: dashOffset,
                    type: scoreData.type,
                    label: scoreData.label,
                    quarter: quarter || null,
                });

                await developerScore.save();
                results.push(developerScore);
            } catch (error: any) {
                errors.push({
                    developer: item.developer,
                    error: error.message,
                });
            }
        }

        if (errors.length > 0) {
            throw new Error(`Bulk create completed with errors: ${JSON.stringify(errors)}`);
        }

        return results;
    };

    // Get all developer scores with filtering
    findAll = async (filters: {
        quarter?: string;
        developer?: string;
        minScore?: number;
        maxScore?: number;
        page?: number;
        limit?: number;
        sortBy?: 'score' | 'developer' | 'createdAt';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: IDeveloperScore[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> => {
        const {
            quarter,
            developer,
            minScore,
            maxScore,
            page = 1,
            limit = 50,
            sortBy = 'score',
            sortOrder = 'desc'
        } = filters;

        const query: any = {};

        if (quarter !== undefined) query.quarter = quarter;
        if (developer) query.developer = { $regex: developer, $options: "i" };
        if (minScore !== undefined) query.score = { $gte: minScore };
        if (maxScore !== undefined) query.score = { ...query.score, $lte: maxScore };

        const skip = (page - 1) * limit;
        const sort: any = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const [data, total] = await Promise.all([
            DeveloperScore.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            DeveloperScore.countDocuments(query),
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

    // Get by ID
    findById = async (id: string): Promise<IDeveloperScore | null> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }
        return await DeveloperScore.findById(id);
    };

    // Get by developer and quarter
    findByDeveloperAndQuarter = async (developer: string, quarter?: string): Promise<IDeveloperScore | null> => {
        const query: any = { developer: { $regex: new RegExp(`^${developer}$`, 'i') } };
        if (quarter !== undefined) query.quarter = quarter;
        else query.quarter = null;

        return await DeveloperScore.findOne(query);
    };

    // Update developer score
    update = async (id: string, data: Partial<IDeveloperScore>): Promise<IDeveloperScore | null> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        // Auto-calculate dashOffset if score is updated
        if (data.score !== undefined && data.dashOffset === undefined) {
            data.dashOffset = 100 - data.score;
        }

        // If updating developer and quarter, check for duplicates
        if (data.developer || data.quarter !== undefined) {
            const existingDoc = await DeveloperScore.findById(id);
            const newDeveloper = data.developer || existingDoc?.developer;
            const newQuarter = data.quarter !== undefined ? data.quarter : existingDoc?.quarter;

            const existing = await DeveloperScore.findOne({
                _id: { $ne: id }
            });

            if (existing) {
                throw new Error(`Developer score for "${newDeveloper}" ${newQuarter ? `in quarter ${newQuarter} ` : ''}already exists`);
            }
        }

        const developerScore = await DeveloperScore.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!developerScore) {
            throw new Error("Developer score record not found");
        }

        return developerScore;
    };

    // Delete developer score
    delete = async (id: string): Promise<void> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        const result = await DeveloperScore.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Developer score record not found");
        }
    };

    // Delete by developer and quarter
    deleteByDeveloperAndQuarter = async (developer: string, quarter?: string): Promise<void> => {
        const query: any = { developer: { $regex: new RegExp(`^${developer}$`, 'i') } };
        if (quarter !== undefined) query.quarter = quarter;
        else query.quarter = null;

        const result = await DeveloperScore.findOneAndDelete(query);
        if (!result) {
            throw new Error(`Developer score for "${developer}" ${quarter ? `in quarter ${quarter} ` : ''}not found`);
        }
    };

    // Get all unique quarters
    getQuarters = async (): Promise<string[]> => {
        const quarters = await DeveloperScore.distinct("quarter").sort({ quarter: -1 });
        return quarters.filter(q => q !== null);
    };

    // Get all unique developers
    getDevelopers = async (quarter?: string): Promise<string[]> => {
        const query: any = {};
        if (quarter) query.quarter = quarter;

        const developers = await DeveloperScore.distinct("developer", query).sort();
        return developers;
    };
}