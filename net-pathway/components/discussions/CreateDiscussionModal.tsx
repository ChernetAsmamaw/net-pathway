import { useState, useEffect } from "react";
import { X, Hash, Loader } from "lucide-react";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface CreateDiscussionModalProps {
  onClose: () => void;
}

export default function CreateDiscussionModal({
  onClose,
}: CreateDiscussionModalProps) {
  const router = useRouter();
  const { createDiscussion, isLoading, fetchPopularTags, popularTags } =
    useDiscussionStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch popular tags for suggestions when the modal opens
  useEffect(() => {
    fetchPopularTags();
  }, [fetchPopularTags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (formData.title.trim() === "") {
      setError("Please enter a discussion title");
      return;
    }

    if (formData.description.trim() === "") {
      setError("Please enter a discussion description");
      return;
    }

    try {
      const success = await createDiscussion(formData);

      if (success) {
        toast.success("Discussion created successfully!");
        router.push("/discussions");
        onClose();
      } else {
        setError("Failed to create discussion. Please try again.");
      }
    } catch (err) {
      console.error("Error creating discussion:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleTagAdd = () => {
    if (!tagInput.trim()) return;

    // Don't add duplicate tags
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
    }

    setTagInput("");
  };

  const handleTagRemove = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleTagEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleTagSuggestionClick = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };

  // Process tag input from comma-separated string
  const handleTagsFromCommaSeparated = (commaSeparated: string) => {
    const tagArray = commaSeparated
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    // Merge with existing tags, removing duplicates
    const uniqueTags = [...new Set([...formData.tags, ...tagArray])];

    setFormData({
      ...formData,
      tags: uniqueTags,
    });

    setTagInput("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Discussion
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discussion Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="What would you like to discuss?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[120px]"
              placeholder="Provide more context about the discussion..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagEnterPress}
                onBlur={() => {
                  if (tagInput.includes(",")) {
                    handleTagsFromCommaSeparated(tagInput);
                  }
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Add tags and press Enter"
              />
            </div>

            {/* Display selected tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="text-sky-700 hover:text-sky-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Show tag suggestions */}
            {popularTags.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 8).map((tagData) => (
                    <button
                      key={tagData.tag}
                      type="button"
                      onClick={() => handleTagSuggestionClick(tagData.tag)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        formData.tags.includes(tagData.tag)
                          ? "bg-sky-200 text-sky-800"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tagData.tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-2 text-sm text-gray-500">
              Add multiple tags separated by commas or press Enter after each
              tag
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Discussion"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
