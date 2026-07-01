import { Property } from './property.model.js';
import type { IProperty } from './property.model.js';
import type { ICreatePropertyDto, IUpdatePropertyDto, IQueryPropertyDto } from './property.dto.js';

export class PropertyService {
    // Generate a unique ID
    private generateId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 6);
        return `prop_${timestamp}_${random}`;
    }

    // Create a new property
    async createProperty(createPropertyDto: ICreatePropertyDto): Promise<IProperty> {
        const property = new Property({
            ...createPropertyDto,
            id: this.generateId(),
        });
        return await property.save();
    }

    // Get all properties with filters and pagination
    async getProperties(queryDto: IQueryPropertyDto): Promise<{
        properties: IProperty[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const {
            search,
            listingType,
            status,
            city,
            area,
            minPrice,
            maxPrice,
            bedrooms,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = queryDto;

        // Build filter object
        const filter: any = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } },
                { 'address.area': { $regex: search, $options: 'i' } },
            ];
        }

        if (listingType) {
            filter.listingType = listingType;
        }

        if (status) {
            filter.status = status;
        }

        if (city) {
            filter['address.city'] = { $regex: city, $options: 'i' };
        }

        if (area) {
            filter['address.area'] = { $regex: area, $options: 'i' };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = minPrice;
            if (maxPrice !== undefined) filter.price.$lte = maxPrice;
        }

        if (bedrooms !== undefined) {
            filter['specs'] = {
                $elemMatch: {
                    label: { $regex: 'bedroom', $options: 'i' },
                    value: { $regex: `^${bedrooms}`, $options: 'i' },
                },
            };
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute queries
        const [properties, total] = await Promise.all([
            Property.find(filter).sort(sort).skip(skip).limit(limit).exec(),
            Property.countDocuments(filter),
        ]);

        return {
            properties,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Get a single property by ID
    async getPropertyById(id: string): Promise<IProperty | null> {
        return await Property.findOne({ _id: id }).exec();
    }

    // Update a property
    async updateProperty(id: string, updatePropertyDto: IUpdatePropertyDto): Promise<IProperty | null> {
        return await Property.findOneAndUpdate(
            { _id: id },
            { $set: updatePropertyDto },
            { new: true, runValidators: true }
        ).exec();
    }

    // Delete a property
    async deleteProperty(id: string): Promise<IProperty | null> {
        return await Property.findOneAndDelete({ _id: id }).exec();
    }
}