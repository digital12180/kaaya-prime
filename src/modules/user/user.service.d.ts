import type { ICreateUserDto, IUpdateRoleDto, UserResponseDto, IPaginationDto, IUpdateUserDto } from "./user.dto.js";
export declare class UserService {
    private hashPassword;
    createUser(createDto: ICreateUserDto): Promise<UserResponseDto | any>;
    getAllUsers(paginationDto: IPaginationDto): Promise<{
        users: UserResponseDto[] | any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(id: string): Promise<UserResponseDto | any>;
    searchUsers(searchTerm: string, paginationDto: IPaginationDto): Promise<{
        users: UserResponseDto[] | any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateUserRole(id: string, roleDto: IUpdateRoleDto): Promise<UserResponseDto | any>;
    deleteUser(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    getUserStatistics(): Promise<any>;
    updateUser(id: string, updateDto: IUpdateUserDto): Promise<UserResponseDto | any>;
}
//# sourceMappingURL=user.service.d.ts.map