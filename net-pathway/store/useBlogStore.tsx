// store/useBlogStore.tsx
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Comment {
  _id?: string;
  content: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
}

export interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  image: string | null;
  author?: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  comments?: Comment[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  views?: number;
}

interface BlogState {
  blogs: BlogPost[];
  currentBlog: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
  };

  // CRUD operations
  fetchAllBlogs: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
  fetchPublishedBlogs: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
  fetchBlogById: (id: string) => Promise<BlogPost | null>;
  createBlog: (blogData: BlogPost) => Promise<BlogPost | null>;
  updateBlog: (id: string, blogData: BlogPost) => Promise<BlogPost | null>;
  deleteBlog: (id: string) => Promise<boolean>;

  // Comment operations
  addComment: (blogId: string, content: string) => Promise<Comment | null>;
  deleteComment: (blogId: string, commentId: string) => Promise<boolean>;

  // State setters
  setCurrentPage: (page: number) => void;
  clearCurrentBlog: () => void;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
  },

  setCurrentPage: (page) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        currentPage: page,
      },
    }));
  },

  clearCurrentBlog: () => {
    set({ currentBlog: null });
  },

  // Fetch all blogs (admin only)
  fetchAllBlogs: async (page = 1, limit = 10, search = "") => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(
        `${API_URL}/blogs/admin/all?page=${page}&limit=${limit}&search=${search}`,
        { withCredentials: true }
      );

      if (response.data.posts) {
        set({
          blogs: response.data.posts,
          pagination: {
            currentPage: page,
            totalPages: response.data.pagination.pages || 1,
            totalBlogs: response.data.pagination.total || 0,
          },
        });
      }
    } catch (error: any) {
      console.error("Error fetching all blogs:", error);
      set({
        error: error.response?.data?.message || "Failed to load blog posts",
      });
      toast.error("Failed to load blog posts");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch published blogs only
  fetchPublishedBlogs: async (page = 1, limit = 10, search = "") => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(
        `${API_URL}/blogs/published?page=${page}&limit=${limit}&search=${search}`,
        { withCredentials: true }
      );

      if (response.data.posts) {
        set({
          blogs: response.data.posts,
          pagination: {
            currentPage: page,
            totalPages: response.data.pagination.pages || 1,
            totalBlogs: response.data.pagination.total || 0,
          },
        });
      }
    } catch (error: any) {
      console.error("Error fetching published blogs:", error);
      set({
        error: error.response?.data?.message || "Failed to load blog posts",
      });
      toast.error("Failed to load blog posts");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a single blog post by ID
  fetchBlogById: async (id) => {
    try {
      set({ isLoading: true, error: null });

      console.log("Fetching blog with ID:", id);
      const response = await axios.get(`${API_URL}/blogs/${id}`, {
        withCredentials: true,
      });

      console.log("API Response:", response.data);

      if (response.data.post) {
        const blogData = response.data.post;
        console.log("Setting current blog:", blogData);
        set({ currentBlog: blogData });
        return blogData;
      } else {
        console.warn("No post data found in response");
        return null;
      }
    } catch (error: any) {
      console.error(`Error fetching blog with ID ${id}:`, error);
      set({
        error: error.response?.data?.message || `Failed to load blog post`,
      });
      toast.error("Failed to load blog post");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new blog post
  createBlog: async (blogData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(`${API_URL}/blogs`, blogData, {
        withCredentials: true,
      });

      if (response.data.post) {
        // Add the new blog to the list if we're viewing blogs
        const blogs = get().blogs;
        set({ blogs: [response.data.post, ...blogs] });
        toast.success("Blog post created successfully");
        return response.data.post;
      }
      return null;
    } catch (error: any) {
      console.error(`Error creating blog post:`, error);
      set({
        error: error.response?.data?.message || "Failed to create blog post",
      });
      toast.error(
        error.response?.data?.message || "Failed to create blog post"
      );
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update an existing blog post
  updateBlog: async (id, blogData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.put(`${API_URL}/blogs/${id}`, blogData, {
        withCredentials: true,
      });

      if (response.data.post) {
        // Update the blog in the list if it exists
        const blogs = get().blogs.map((blog) =>
          blog._id === id ? response.data.post : blog
        );

        set({
          blogs,
          currentBlog: response.data.post,
        });

        toast.success("Blog post updated successfully");
        return response.data.post;
      }
      return null;
    } catch (error: any) {
      console.error(`Error updating blog post:`, error);
      set({
        error: error.response?.data?.message || "Failed to update blog post",
      });
      toast.error(
        error.response?.data?.message || "Failed to update blog post"
      );
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a blog post
  deleteBlog: async (id) => {
    try {
      set({ isLoading: true, error: null });

      await axios.delete(`${API_URL}/blogs/${id}`, {
        withCredentials: true,
      });

      // Remove the deleted blog from the list
      const blogs = get().blogs.filter((blog) => blog._id !== id);
      set({ blogs });

      toast.success("Blog post deleted successfully");
      return true;
    } catch (error: any) {
      console.error(`Error deleting blog post:`, error);
      set({
        error: error.response?.data?.message || "Failed to delete blog post",
      });
      toast.error(
        error.response?.data?.message || "Failed to delete blog post"
      );
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a comment to a blog post
  addComment: async (blogId, content) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(
        `${API_URL}/blogs/${blogId}/comments`,
        { content },
        { withCredentials: true }
      );

      if (response.data.comment) {
        // Update the current blog with the new comment
        const currentBlog = get().currentBlog;
        if (currentBlog && currentBlog._id === blogId) {
          const updatedComments = [
            ...(currentBlog.comments || []),
            response.data.comment,
          ];
          set({
            currentBlog: { ...currentBlog, comments: updatedComments },
          });
        }

        toast.success("Comment added successfully");
        return response.data.comment;
      }

      return null;
    } catch (error: any) {
      console.error(`Error adding comment:`, error);
      set({ error: error.response?.data?.message || "Failed to add comment" });
      toast.error(error.response?.data?.message || "Failed to add comment");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a comment from a blog post
  deleteComment: async (blogId, commentId) => {
    try {
      set({ isLoading: true, error: null });

      await axios.delete(`${API_URL}/blogs/${blogId}/comments/${commentId}`, {
        withCredentials: true,
      });

      // Update the current blog by removing the deleted comment
      const currentBlog = get().currentBlog;
      if (currentBlog && currentBlog._id === blogId && currentBlog.comments) {
        const updatedComments = currentBlog.comments.filter(
          (comment) => comment._id !== commentId
        );

        set({
          currentBlog: { ...currentBlog, comments: updatedComments },
        });
      }

      toast.success("Comment deleted successfully");
      return true;
    } catch (error: any) {
      console.error(`Error deleting comment:`, error);
      set({
        error: error.response?.data?.message || "Failed to delete comment",
      });
      toast.error(error.response?.data?.message || "Failed to delete comment");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useBlogStore;
