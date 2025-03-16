import React, { useState, useEffect } from "react";
import { FileText, Edit, Trash2, Plus, Eye, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  status: "draft" | "published" | "archived";
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  image?: string;
  views: number;
  publishedAt?: string;
  createdAt: string;
  tags: string[];
}

interface AdminBlogsListProps {
  searchQuery: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const AdminBlogsList: React.FC<AdminBlogsListProps> = ({ searchQuery }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch blogs with admin access (showing all blog posts including drafts)
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/blogs/admin/all?page=${currentPage}&search=${searchQuery}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.posts) {
        setBlogs(response.data.posts);
        setTotalPages(response.data.pagination.pages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchQuery]);

  // Handle blog deletion
  const handleDeleteBlog = async (blogId: string) => {
    try {
      await axios.delete(`${API_URL}/blogs/${blogId}`, {
        withCredentials: true,
      });

      // Remove the deleted blog from the state
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      toast.success("Blog post deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      toast.error("Failed to delete blog post");
    }
  };

  // Status badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-amber-100 text-amber-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {blogs.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No blog posts found</p>
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Post
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Author
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Published
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Views
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-gray-200 relative overflow-hidden flex-shrink-0">
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {blog.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {blog.summary}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 relative overflow-hidden">
                        {blog.author?.profilePicture ? (
                          <Image
                            src={blog.author.profilePicture}
                            alt={blog.author.username}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            {blog.author?.username.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">
                        {blog.author?.username || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        blog.status
                      )}`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {blog.publishedAt ? (
                      formatDate(blog.publishedAt)
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Clock className="w-3 h-3" />
                        Not published
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      {blog.views || 0}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${blog._id}`}
                        className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedBlog(blog);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/blogs/${blog._id}`}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                        title="View Post"
                        target="_blank"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page
                    ? "bg-sky-600 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Delete Blog Post</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedBlog.title}</span>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBlog(selectedBlog._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsList;
