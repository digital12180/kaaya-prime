import type { Request, Response } from "express";
import { DashboardService } from "./dashboard.service.js";

export class DashboardController {

    static async getDashboard(req:Request,res:Response){

        try{

            const dashboard=await DashboardService.getDashboard();

            return res.status(200).json({
                success:true,
                message:"Dashboard fetched successfully",
                data:dashboard
            });

        }catch(error:any){

            return res.status(500).json({
                success:false,
                message:error.message
            });

        }

    }

}