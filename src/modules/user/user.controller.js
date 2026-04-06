import { UserService } from "./user.service.js";
import { validateCreateUser, validateUpdateRole, validateUpdateUser } from "./user.dto.js";
export class UserController {
    userService;
    constructor() {
        this.userService = new UserService();
    }
    // Create user
    createUser = async (req, res) => {
        try {
            // Validate request data
            const validationErrors = validateCreateUser(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const user = await this.userService.createUser(req.body);
            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user
            });
        }
        catch (error) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create user",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get all users with pagination
    getAllUsers = async (req, res) => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                search: req.query.search,
                role: req.query.role
            };
            // Validate pagination params
            if (paginationDto.page && (isNaN(paginationDto.page) || paginationDto.page < 1)) {
                res.status(400).json({
                    success: false,
                    message: "Page must be a positive number"
                });
                return;
            }
            if (paginationDto.limit && (isNaN(paginationDto.limit) || paginationDto.limit < 1 || paginationDto.limit > 100)) {
                res.status(400).json({
                    success: false,
                    message: "Limit must be between 1 and 100"
                });
                return;
            }
            // Validate role
            if (paginationDto.role && !["admin", "editor", "manager"].includes(paginationDto.role)) {
                res.status(400).json({
                    success: false,
                    message: "Role must be either 'admin', 'editor', or 'manager'"
                });
                return;
            }
            const result = await this.userService.getAllUsers(paginationDto);
            res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
                data: result.users,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve users",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get user by ID
    getUserById = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: user
            });
        }
        catch (error) {
            const status = error.message === "Invalid user ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve user",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Search users
    searchUsers = async (req, res) => {
        try {
            const { q } = req.query;
            if (!q || typeof q !== 'string') {
                res.status(400).json({
                    success: false,
                    message: "Search query parameter 'q' is required"
                });
                return;
            }
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                role: req.query.role
            };
            const result = await this.userService.searchUsers(q, paginationDto);
            res.status(200).json({
                success: true,
                message: `Users matching "${q}" retrieved successfully`,
                data: result.users,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to search users",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Update user role only
    updateUserRole = async (req, res) => {
        try {
            const { id } = req.params;
            // Validate role data
            const validationErrors = validateUpdateRole(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const user = await this.userService.updateUserRole(id, req.body);
            res.status(200).json({
                success: true,
                message: `User role updated to ${req.body.role} successfully`,
                data: user
            });
        }
        catch (error) {
            const status = error.message === "Invalid user ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update user role",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Delete user
    deleteUser = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.userService.deleteUser(id);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        }
        catch (error) {
            const status = error.message === "Invalid user ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete user",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get user statistics
    getUserStatistics = async (req, res) => {
        try {
            const statistics = await this.userService.getUserStatistics();
            res.status(200).json({
                success: true,
                message: "Statistics retrieved successfully",
                data: statistics
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Update user (full update)
    updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            // Validate update data
            const validationErrors = validateUpdateUser(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const user = await this.userService.updateUser(id, req.body);
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user
            });
        }
        catch (error) {
            const status = error.message === "Invalid user ID format" ? 400 :
                error.message.includes("already exists") ? 409 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update user",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
}
//# sourceMappingURL=user.controller.js.map