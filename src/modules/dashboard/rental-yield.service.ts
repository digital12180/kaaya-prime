// src/services/rental-yield.service.ts
import { RentalYield } from "./rental-yield.model.js";
import type { IRentalYield } from "./rental-yield.model.js";
import mongoose from "mongoose";

export class RentalYieldService {

    // Create single rental yield record
    create = async (data: Partial<IRentalYield>): Promise<IRentalYield> => {
        // Check for duplicate area in same quarter
        const existing = await RentalYield.findOne({
            area: data.area as string,
            quarter: data.quarter as string,
        });

        if (existing) {
            throw new Error(`Rental yield data for area "${data.area}" in quarter "${data.quarter}" already exists`);
        }

        const rentalYield = new RentalYield(data);
        await rentalYield.save();
        return rentalYield;
    };

    // Bulk create from the specific format
    bulkCreateFromFormat = async (
        yieldData: {
            type: string;
            label: string;
            data: Array<{ area: string; value: string; width: number }>;
        },
        quarter: string
    ): Promise<IRentalYield[]> => {
        const results: IRentalYield[] = [];
        const errors: any[] = [];

        for (const item of yieldData.data) {
            try {
                // Convert value from "7.4%" to 7.4
                const numericValue = parseFloat(item.value.replace("%", ""));

                const rentalYield = new RentalYield({
                    area: item.area,
                    value: numericValue,
                    width: item.width,
                    quarter: quarter,
                    label: yieldData.label,
                });

                await rentalYield.save();
                results.push(rentalYield);
            } catch (error: any) {
                errors.push({
                    area: item.area,
                    error: error.message,
                });
            }
        }

        if (errors.length > 0) {
            throw new Error(`Bulk create completed with errors: ${JSON.stringify(errors)}`);
        }

        return results;
    };

    // Get all rental yields with filtering
    findAll = async (filters: {
        quarter?: string;
        area?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: IRentalYield[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> => {
        const { quarter, area, page = 1, limit = 50 } = filters;
        const query: any = {};

        if (quarter) query.quarter = quarter;
        if (area) query.area = { $regex: area, $options: "i" };

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            RentalYield.find(query)
                .sort({ value: -1 }) // Sort by yield value descending
                .skip(skip)
                .limit(limit)
                .lean(),
            RentalYield.countDocuments(query),
        ]);

        // Transform data to match frontend format if needed
        const transformedData = data.map(item => ({
            ...item,
            value_display: `${item.value}%`,
        }));

        return {
            data: transformedData as any,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    };

    // Get by ID
    findById = async (id: string): Promise<IRentalYield | null> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }
        return await RentalYield.findById(id);
    };

    // Get by area and quarter
    findByAreaAndQuarter = async (area: string, quarter: string): Promise<IRentalYield | null> => {
        return await RentalYield.findOne({ area, quarter });
    };

    // Update rental yield
    update = async (id: string, data: Partial<IRentalYield>): Promise<IRentalYield | null> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        // If updating area and quarter, check for duplicates
        if (data.area && data.quarter) {
            const existing = await RentalYield.findOne({
                area: data.area,
                quarter: data.quarter,
                _id: { $ne: id },
            });
            if (existing) {
                throw new Error(`Rental yield for area "${data.area}" in quarter "${data.quarter}" already exists`);
            }
        }

        const rentalYield = await RentalYield.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!rentalYield) {
            throw new Error("Rental yield record not found");
        }

        return rentalYield;
    };

    // Delete rental yield
    delete = async (id: string): Promise<void> => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        const result = await RentalYield.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Rental yield record not found");
        }
    };

    // Delete by area and quarter
    deleteByAreaAndQuarter = async (area: string, quarter: string): Promise<void> => {
        const result = await RentalYield.findOneAndDelete({ area, quarter });
        if (!result) {
            throw new Error(`Rental yield for area "${area}" in quarter "${quarter}" not found`);
        }
    };

    // Get all unique quarters
    getQuarters = async (): Promise<string[]> => {
        const quarters = await RentalYield.distinct("quarter").sort({ quarter: -1 });
        return quarters;
    };
}