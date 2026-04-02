import type{ Response } from "express";

export class ApiResponse {
  static success(
    res: Response,
    data: any = null,
    message: string = "Success",
    statusCode: number = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string = "Something went wrong",
    statusCode: number = 500
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  static created(
    res: Response,
    data: any,
    message: string = "Created successfully"
  ) {
    return this.success(res, data, message, 201);
  }

  static badRequest(
    res: Response,
    message: string = "Bad Request"
  ) {
    return this.error(res, message, 400);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized"
  ) {
    return this.error(res, message, 401);
  }

  static notFound(
    res: Response,
    message: string = "Not Found"
  ) {
    return this.error(res, message, 404);
  }
}