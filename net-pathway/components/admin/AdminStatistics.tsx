import React, { useState, useEffect } from "react";
import { Users, FileText, Briefcase, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Statistics {
  users: {
    total: number;
    verified: number;
    growth: number;
    byRole: { name: string; value: number }[];
    recentActivity: { date: string; count: number }[];
  };
  blogs: {
    total: number;
    published: number;
    byStatus: { name: string; value: number }[];
  };
  mentors: {
    total: number;
    active: number;
    byExpertise: { name: string; value: number }[];
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const AdminStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics>({
    users: {
      total: 0,
      verified: 0,
      growth: 0,
      byRole: [],
      recentActivity: [],
    },
    blogs: {
      total: 0,
      published: 0,
      byStatus: [],
    },
    mentors: {
      total: 0,
      active: 0,
      byExpertise: [],
    },
  });

  // Define stat cards data
  const statCards = [
    {
      title: "Total Users",
      value: statistics.users.total,
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
      change: statistics.users.growth,
    },
    {
      title: "Total Blogs",
      value: statistics.blogs.total,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-green-500",
      change: (statistics.blogs.published / statistics.blogs.total) * 100 || 0,
    },
    {
      title: "Active Mentors",
      value: statistics.mentors.active,
      icon: <Briefcase className="w-6 h-6" />,
      color: "bg-amber-500",
      change: (statistics.mentors.active / statistics.mentors.total) * 100 || 0,
    },
  ];

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Try to fetch from the endpoint
      try {
        const response = await axios.get(`${API_URL}/admin/statistics`, {
          withCredentials: true,
        });

        if (response.data) {
          setStatistics(response.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log("API endpoint not ready yet, using mock data");
      }

      // Fallback to mock data if API fails
      // This is temporary until the backend endpoint is working
      setTimeout(() => {
        setStatistics({
          users: {
            total: 12,
            verified: 98,
            growth: 12.5,
            byRole: [
              { name: "Admins", value: 3 },
              { name: "Mentors", value: 15 },
              { name: "Users", value: 106 },
            ],
            recentActivity: [
              { date: "2025-03-10", count: 12 },
              { date: "2025-03-11", count: 9 },
              { date: "2025-03-12", count: 15 },
              { date: "2025-03-13", count: 11 },
              { date: "2025-03-14", count: 18 },
              { date: "2025-03-15", count: 14 },
              { date: "2025-03-16", count: 21 },
            ],
          },
          blogs: {
            total: 1,
            published: 2,
            byStatus: [
              { name: "Published", value: 32 },
              { name: "Draft", value: 8 },
              { name: "Archived", value: 5 },
            ],
          },
          mentors: {
            total: 1,
            active: 1,
            byExpertise: [
              { name: "Software Development", value: 8 },
              { name: "Data Science", value: 6 },
              { name: "UX Design", value: 5 },
              { name: "Project Management", value: 4 },
              { name: "Digital Marketing", value: 3 },
            ],
          },
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      toast.error("Failed to load statistics");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
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
                <span>{Math.abs(card.change).toFixed(1)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-sm text-gray-500">{card.title}</p>
          </div>
        ))}
      </div>

      {/* User Activity Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          User Activity
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statistics.users.recentActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
