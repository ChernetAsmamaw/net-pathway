import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  FileText,
  Briefcase,
  UserCheck,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface StatCard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface AdminStatisticsProps {}

const AdminStatistics: React.FC<AdminStatisticsProps> = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    mentors: 0,
    verifiedUsers: 0,
    newUsersWeekly: [],
    usersByRole: [],
    postsByStatus: [],
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await axios.get(`${API_URL}/admin/statistics`, {
        withCredentials: true,
      });

      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      toast.error("Failed to load statistics");

      // Set mock data for demonstration
      setStats({
        users: 126,
        posts: 48,
        mentors: 15,
        verifiedUsers: 87,
        newUsersWeekly: [
          { date: "2023-06-01", count: 3 },
          { date: "2023-06-08", count: 7 },
          { date: "2023-06-15", count: 5 },
          { date: "2023-06-22", count: 8 },
          { date: "2023-06-29", count: 12 },
          { date: "2023-07-06", count: 10 },
          { date: "2023-07-13", count: 15 },
        ],
        usersByRole: [
          { name: "User", value: 108 },
          { name: "Mentor", value: 15 },
          { name: "Admin", value: 3 },
        ],
        postsByStatus: [
          { name: "Published", value: 32 },
          { name: "Draft", value: 12 },
          { name: "Archived", value: 4 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Total Users",
      value: stats.users,
      change: 12.5, // Mock percentage change
      icon: <Users className="w-6 h-6" />,
      color: "bg-sky-500",
    },
    {
      title: "Blog Posts",
      value: stats.posts,
      change: 8.3,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Mentors",
      value: stats.mentors,
      change: 5.2,
      icon: <Briefcase className="w-6 h-6" />,
      color: "bg-amber-500",
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers,
      change: 15.7,
      icon: <UserCheck className="w-6 h-6" />,
      color: "bg-emerald-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-sky-700" />
        Dashboard Overview
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.color} text-white`}>
                {card.icon}
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  card.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.change >= 0 ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                <span>{Math.abs(card.change)}%</span>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              {card.value}
            </h3>
            <p className="text-sm text-gray-500">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            User Growth
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.newUsersWeekly}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [`${value} users`, "New Signups"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="New Users"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Composition Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            User Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.usersByRole}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
                <Legend />
                <Bar dataKey="value" name="Users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Blog Posts Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Blog Post Status
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.postsByStatus}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip formatter={(value) => [`${value} posts`, "Count"]} />
              <Legend />
              <Bar dataKey="value" name="Posts" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
