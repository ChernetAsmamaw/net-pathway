import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Tag,
  Clock,
  Eye,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useBlogStore, BlogPost } from "@/store/useBlogStore";

interface BlogFormProps {
  blogId?: string; // If provided, we're editing an existing blog
  onCancel?: () => void;
}

export default function BlogForm({ blogId, onCancel }: BlogFormProps) {
  const router = useRouter();
  const {
    isLoading,
    fetchBlogById,
    createBlog,
    updateBlog,
    currentBlog,
    clearCurrentBlog,
  } = useBlogStore();
  const [isFetching, setIsFetching] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    content: "",
    summary: "",
    tags: [],
    status: "draft",
    image: null,
  });

  // Fetch blog data if editing an existing blog
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      setIsFetching(true);
      try {
        const blogData = await fetchBlogById(blogId);

        if (blogData) {
          setFormData({
            title: blogData.title || "",
            content: blogData.content || "",
            summary: blogData.summary || "",
            tags: blogData.tags || [],
            status: blogData.status || "draft",
            image: blogData.image || null,
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchBlog();

    // Clear current blog when component unmounts
    return () => {
      clearCurrentBlog();
    };
  }, [blogId, fetchBlogById, clearCurrentBlog]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle tag input
  const handleAddTag = (e?: React.KeyboardEvent) => {
    if (e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
    }

    if (!tagInput.trim()) return;

    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
    }

    setTagInput("");
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        image: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.summary.trim()
    ) {
      toast.error("Title, content, and summary are required");
      return;
    }

    try {
      let success = false;

      if (blogId) {
        // Update existing blog
        const updatedBlog = await updateBlog(blogId, formData);
        success = !!updatedBlog;
      } else {
        // Create new blog
        const newBlog = await createBlog(formData);
        success = !!newBlog;
      }

      if (success) {
        // Redirect back to admin dashboard
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => (onCancel ? onCancel() : router.back())}
          className="flex items-center gap-2 text-sky-700 hover:text-sky-800 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {blogId ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center px-3 py-1.5 rounded ${
              previewMode ? "bg-gray-200" : "bg-white border border-gray-300"
            }`}
          >
            <Eye className="w-4 h-4 mr-1" /> {previewMode ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="blog-preview">
          <h1 className="text-2xl font-bold mb-4">{formData.title}</h1>
          {formData.image && (
            <div className="mb-6">
              <img
                src={formData.image}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {formData.status}
            </span>
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-gray-500 mb-4">{formData.summary}</div>
          <div className="prose max-w-none">
            {formData.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Blog post title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="A brief summary of the post"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Blog post content"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Featured Image
              </label>
              <div className="flex items-center">
                <label className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex items-center">
              <div className="flex-grow mr-2">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-grow px-3 py-2 focus:outline-none"
                    placeholder="Enter tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="bg-gray-100 px-3 py-2 border-l border-gray-300 hover:bg-gray-200"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => (onCancel ? onCancel() : router.back())}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
