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

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await axios.get(`${API_URL}/admin/statistics`, {
        withCredentials: true,
      });
      setStatistics(response.data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: statistics.users.total,
      change: statistics.users.growth,
      icon: <Users className="w-6 h-6" />,
      color: "bg-sky-500",
    },
    {
      title: "Blog Posts",
      value: statistics.blogs.total,
      change: (statistics.blogs.published / statistics.blogs.total) * 100,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Active Mentors",
      value: statistics.mentors.active,
      change: (statistics.mentors.active / statistics.mentors.total) * 100,
      icon: <Briefcase className="w-6 h-6" />,
      color: "bg-amber-500",
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

      {/* Mentor Expertise Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Mentor Expertise
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statistics.mentors.byExpertise}
              layout="vertical"
              margin={{ left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
