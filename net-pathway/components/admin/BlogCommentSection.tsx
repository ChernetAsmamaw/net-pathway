"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MessageCircle, Send, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  blogId: string;
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${blogId}/comments`, {
        withCredentials: true,
      });
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/blogs/${blogId}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments([...comments, response.data.comment]);
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`${API_URL}/blogs/${blogId}/comments/${commentId}`, {
        withCredentials: true,
      });
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-sky-700" />
        <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="self-end px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                  <span className="text-sky-700 font-medium">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {comment.author.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
              {(user?._id === comment.author._id || user?.role === "admin") && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}
