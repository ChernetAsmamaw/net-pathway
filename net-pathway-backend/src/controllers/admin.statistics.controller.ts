// net-pathway-backend/src/controllers/admin.statistics.controller.ts
import { Request, Response } from "express";
import User from "../models/User";
import BlogPost from "../models/BlogPost";
import Mentor from "../models/Mentor";

export const adminStatisticsController = {
  // Get admin dashboard statistics
  async getStatistics(req: Request, res: Response) {
    try {
      // Verify the user is an admin
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // User statistics
      const totalUsers = await User.countDocuments();
      const verifiedUsers = await User.countDocuments({
        isEmailVerified: true,
      });

      // Calculate user growth (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const newUsers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      });
      const userGrowth = totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0;

      // User role distribution
      const admins = await User.countDocuments({ role: "admin" });
      const mentorRoles = await User.countDocuments({ role: "mentor" });
      const regularUsers = await User.countDocuments({ role: "user" });

      // Blog statistics
      const totalBlogs = await BlogPost.countDocuments();
      const publishedBlogs = await BlogPost.countDocuments({
        status: "published",
      });

      // Generate recent user activity data
      const recentActivity = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const count = await User.countDocuments({
          lastLogin: { $gte: startOfDay, $lte: endOfDay },
        });

        recentActivity.push({
          date: date.toISOString().split("T")[0],
          count: count,
        });
      }

      // Mentor expertise distribution
      const mentors = await Mentor.find();
      const expertiseMap = new Map();

      mentors.forEach((mentor) => {
        mentor.expertise.forEach((skill) => {
          expertiseMap.set(skill, (expertiseMap.get(skill) || 0) + 1);
        });
      });

      // Convert map to array and sort by count descending
      const byExpertise = Array.from(expertiseMap, ([name, value]) => ({
        name,
        value,
      }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Take top 10

      // Return all statistics
      res.status(200).json({
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          growth: userGrowth,
          byRole: [
            { name: "Admins", value: admins },
            { name: "Mentors", value: mentorRoles },
            { name: "Users", value: regularUsers },
          ],
          recentActivity,
        },
        blogs: {
          total: totalBlogs,
          published: publishedBlogs,
          byStatus: [
            { name: "Published", value: publishedBlogs },
            {
              name: "Draft",
              value: await BlogPost.countDocuments({ status: "draft" }),
            },
            {
              name: "Archived",
              value: await BlogPost.countDocuments({ status: "archived" }),
            },
          ],
        },
        mentors: {
          total: await Mentor.countDocuments(),
          active: await Mentor.countDocuments({ isActive: true }),
          byExpertise,
        },
      });
    } catch (error: any) {
      console.error("Admin statistics error:", error);
      res.status(500).json({
        message: error.message || "Error retrieving admin statistics",
      });
    }
  },
};
