import { Blog } from "../blog/blog.model.js";
import { Lead } from "../lead/lead.model.js";
import { User } from "../user/user.model.js";
import Property from "../opportunity/property.model.js";
import { Report } from "../report/report.model.js";
import { LandingPage } from "../landingPage/landingPage.model.js";

export class DashboardService {

    static async getDashboard() {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const [

            totalUsers,

            totalBlogs,
            publishedBlogs,
            draftBlogs,

            totalProperties,

            totalReports,
            publishedReports,

            totalLandingPages,
            publishedLandingPages,

            totalLeads,
            todayLeads,
            monthlyLeads,

            recentLeads

        ] = await Promise.all([

            User.countDocuments(),

            Blog.countDocuments(),
            Blog.countDocuments({ status: "PUBLISHED" }),
            Blog.countDocuments({ status: "DRAFT" }),

            Property.countDocuments(),

            Report.countDocuments(),
            Report.countDocuments({ status: "PUBLISHED" }),

            LandingPage.countDocuments(),
            LandingPage.countDocuments({ status: "PUBLISHED" }),

            Lead.countDocuments(),

            Lead.countDocuments({
                createdAt: {
                    $gte: today
                }
            }),

            Lead.countDocuments({
                createdAt: {
                    $gte: monthStart
                }
            }),

            Lead.find()
                .sort({ createdAt: -1 })
                .limit(5)

        ]);

        return {

            totalUsers,

            totalBlogs,
            publishedBlogs,
            draftBlogs,

            totalProperties,

            totalReports,
            publishedReports,

            totalLandingPages,
            publishedLandingPages,

            totalLeads,
            todayLeads,
            monthlyLeads,
            leads: recentLeads
        };

    }

}