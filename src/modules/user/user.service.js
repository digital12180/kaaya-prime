// services/user.service.ts
import mongoose from "mongoose";
import { User } from "./user.model.js";
import * as bcrypt from "bcrypt";
export class UserService {
    // Hash password
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    // Create a new user
    async createUser(createDto) {
        try {
            // Check if username already exists
            const existingUsername = await User.findOne({
                username: { $regex: new RegExp(`^${createDto.username}$`, 'i') }
            });
            if (existingUsername) {
                throw new Error("Username already exists");
            }
            // Check if email already exists
            const existingEmail = await User.findOne({
                email: { $regex: new RegExp(`^${createDto.email}$`, 'i') }
            });
            if (existingEmail) {
                throw new Error("Email already exists");
            }
            // Hash password
            const hashedPassword = await this.hashPassword(createDto.password);
            const userData = {
                ...createDto,
                password: hashedPassword,
                role: createDto.role || "editor"
            };
            const user = new User(userData);
            await user.save();
            return user;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new Error("User with this username or email already exists");
            }
            throw error;
        }
    }
    // Get all users with pagination and search
    async getAllUsers(paginationDto) {
        const page = Math.max(1, paginationDto.page || 1);
        const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
        const skip = (page - 1) * limit;
        let query = {};
        // Search functionality (search in username or email)
        if (paginationDto.search && paginationDto.search.trim()) {
            query.$or = [
                { username: { $regex: paginationDto.search, $options: 'i' } },
                { email: { $regex: paginationDto.search, $options: 'i' } }
            ];
        }
        // Filter by role
        if (paginationDto.role) {
            query.role = paginationDto.role;
        }
        const [users, total] = await Promise.all([
            User.find(query)
                .select("-password") // Exclude password field
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            users: users,
            total,
            page,
            limit,
            totalPages
        };
    }
    // Get user by ID
    async getUserById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid user ID format");
        }
        const user = await User.findById(id).select("-password").lean();
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    // Search users by username or email
    async searchUsers(searchTerm, paginationDto) {
        if (!searchTerm || searchTerm.trim().length === 0) {
            throw new Error("Search term is required");
        }
        const page = Math.max(1, paginationDto.page || 1);
        const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
        const skip = (page - 1) * limit;
        const query = {
            $or: [
                { username: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        };
        // Add role filter if provided
        if (paginationDto.role) {
            Object.assign(query, { role: paginationDto.role });
        }
        const [users, total] = await Promise.all([
            User.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            users: users,
            total,
            page,
            limit,
            totalPages
        };
    }
    // Update user role only
    async updateUserRole(id, roleDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid user ID format");
        }
        const user = await User.findByIdAndUpdate(id, { role: roleDto.role, updatedAt: new Date() }, { new: true, runValidators: true }).select("-password").lean();
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    // Delete user
    async deleteUser(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid user ID format");
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error("User not found");
        }
        return {
            message: "User deleted successfully",
            deletedId: id
        };
    }
    // Get user statistics
    async getUserStatistics() {
        const [totalUsers, adminCount, editorCount, managerCount] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "editor" }),
            User.countDocuments({ role: "manager" })
        ]);
        return {
            totalUsers,
            adminCount,
            editorCount,
            managerCount
        };
    }
    // Update user (full update)
    async updateUser(id, updateDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid user ID format");
        }
        const existingUser = await User.findById(id);
        if (!existingUser) {
            throw new Error("User not found");
        }
        let updateData = { ...updateDto };
        // Check if username is being updated and if it already exists
        if (updateDto.username && updateDto.username !== existingUser.username) {
            const usernameExists = await User.findOne({
                _id: { $ne: id },
                username: { $regex: new RegExp(`^${updateDto.username}$`, 'i') }
            });
            if (usernameExists) {
                throw new Error("Username already exists");
            }
        }
        // Check if email is being updated and if it already exists
        if (updateDto.email && updateDto.email !== existingUser.email) {
            const emailExists = await User.findOne({
                _id: { $ne: id },
                email: { $regex: new RegExp(`^${updateDto.email}$`, 'i') }
            });
            if (emailExists) {
                throw new Error("Email already exists");
            }
        }
        // Hash password if it's being updated
        if (updateDto.password && updateDto.password.length > 0) {
            updateData.password = await this.hashPassword(updateDto.password);
        }
        else {
            delete updateData.password; // Don't update password if not provided
        }
        const user = await User.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true }).select("-password").lean();
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
//# sourceMappingURL=user.service.js.map