"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import BlogForm from "@/components/admin/BlogForm";

export default function BlogPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const blogId = (params?.blogId as string) || null;
  const isEditMode = !!blogId;

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      // Check if user is admin
      if (user?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    };
    initAuth();
  }, [checkAuthStatus, isAuthenticated, router, user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <main
        className={`pt-16 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        <div className="p-6 md:p-8">
          <BlogForm blogId={isEditMode ? blogId : undefined} />
        </div>
      </main>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   Save,
//   Image as ImageIcon,
//   Tag,
//   Clock,
//   Eye,
// } from "lucide-react";

// interface BlogPost {
//   id?: string;
//   title: string;
//   content: string;
//   summary: string;
//   tags: string[];
//   status: "draft" | "published" | "archived";
//   image?: string | null;
// }

// interface BlogEditorProps {
//   postId?: string; // If editing existing post
//   defaultValues?: Partial<BlogPost>;
// }

// const BlogEditor: React.FC<BlogEditorProps> = ({
//   postId,
//   defaultValues = {},
// }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [formData, setFormData] = useState<BlogPost>({
//     title: "",
//     content: "",
//     summary: "",
//     tags: [],
//     status: "draft",
//     image: null,
//     ...defaultValues,
//   });
//   const [tagInput, setTagInput] = useState("");
//   const [previewMode, setPreviewMode] = useState(false);

//   // If editing, fetch post data
//   useEffect(() => {
//     const fetchPost = async () => {
//       if (!postId) return;

//       try {
//         setIsLoading(true);
//         const API_URL =
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//         const response = await axios.get(`${API_URL}/blogs/${postId}`, {
//           withCredentials: true,
//         });

//         setFormData({
//           id: response.data.post.id,
//           title: response.data.post.title,
//           content: response.data.post.content,
//           summary: response.data.post.summary,
//           tags: response.data.post.tags,
//           status: response.data.post.status,
//           image: response.data.post.image,
//         });
//       } catch (error) {
//         console.error("Failed to fetch post:", error);
//         toast.error("Failed to load post data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPost();
//   }, [postId]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddTag = () => {
//     if (!tagInput.trim()) return;
//     if (formData.tags.includes(tagInput.trim())) {
//       toast.error("Tag already exists");
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       tags: [...prev.tags, tagInput.trim()],
//     }));
//     setTagInput("");
//   };

//   const handleRemoveTag = (tag: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((t) => t !== tag),
//     }));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Check file size (max 2MB)
//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image size should be less than 2MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       setFormData((prev) => ({
//         ...prev,
//         image: reader.result as string,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveImage = () => {
//     setFormData((prev) => ({ ...prev, image: null }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !formData.title.trim() ||
//       !formData.content.trim() ||
//       !formData.summary.trim()
//     ) {
//       toast.error("Title, content, and summary are required");
//       return;
//     }

//     try {
//       setIsSaving(true);
//       const API_URL =
//         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//       if (postId) {
//         // Update existing post
//         await axios.put(`${API_URL}/blogs/${postId}`, formData, {
//           withCredentials: true,
//         });
//         toast.success("Blog post updated successfully");
//       } else {
//         // Create new post
//         await axios.post(`${API_URL}/blogs`, formData, {
//           withCredentials: true,
//         });
//         toast.success("Blog post created successfully");
//       }

//       // Redirect to admin blogs page
//       router.push("/admin?tab=blogs");
//     } catch (error) {
//       console.error("Failed to save blog post:", error);
//       toast.error("Failed to save blog post");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         Loading post data...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex items-center justify-between mb-6">
//         <button
//           onClick={() => router.push("/admin?tab=blogs")}
//           className="flex items-center text-gray-600 hover:text-gray-900"
//         >
//           <ArrowLeft className="w-4 h-4 mr-1" /> Back to Posts
//         </button>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setPreviewMode(!previewMode)}
//             className={`flex items-center px-3 py-1.5 rounded ${
//               previewMode ? "bg-gray-200" : "bg-white border border-gray-300"
//             }`}
//           >
//             <Eye className="w-4 h-4 mr-1" /> {previewMode ? "Edit" : "Preview"}
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isSaving}
//             className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded"
//           >
//             {isSaving ? (
//               <>Saving...</>
//             ) : (
//               <>
//                 <Save className="w-4 h-4 mr-1" /> Save
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {previewMode ? (
//         <div className="blog-preview">
//           <h1 className="text-2xl font-bold mb-4">{formData.title}</h1>
//           {formData.image && (
//             <div className="mb-6">
//               <img
//                 src={formData.image}
//                 alt={formData.title}
//                 className="w-full h-64 object-cover rounded-lg"
//               />
//             </div>
//           )}
//           <div className="flex items-center gap-2 mb-4">
//             <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
//               {formData.status}
//             </span>
//             {formData.tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//           <div className="text-gray-500 mb-4">{formData.summary}</div>
//           <div
//             className="prose max-w-none"
//             dangerouslySetInnerHTML={{ __html: formData.content }}
//           />
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Blog post title"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Summary</label>
//             <textarea
//               name="summary"
//               value={formData.summary}
//               onChange={handleChange}
//               rows={2}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="A brief summary of the post"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Content</label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               rows={10}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Blog post content (HTML supported)"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="draft">Draft</option>
//                 <option value="published">Published</option>
//                 <option value="archived">Archived</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Featured Image
//               </label>
//               <div className="flex items-center">
//                 <label className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
//                   <ImageIcon className="w-4 h-4 mr-2" />
//                   <span>Upload Image</span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </label>
//                 {formData.image && (
//                   <button
//                     type="button"
//                     onClick={handleRemoveImage}
//                     className="ml-2 text-red-600 hover:text-red-800"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//               {formData.image && (
//                 <div className="mt-2">
//                   <img
//                     src={formData.image}
//                     alt="Preview"
//                     className="h-20 object-cover rounded"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Tags</label>
//             <div className="flex items-center">
//               <div className="flex-grow mr-2">
//                 <div className="flex items-center border border-gray-300 rounded overflow-hidden">
//                   <input
//                     type="text"
//                     value={tagInput}
//                     onChange={(e) => setTagInput(e.target.value)}
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         handleAddTag();
//                       }
//                     }}
//                     className="flex-grow px-3 py-2 focus:outline-none"
//                     placeholder="Enter tag and press Enter"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddTag}
//                     className="bg-gray-100 px-3 py-2 border-l border-gray-300 hover:bg-gray-200"
//                   >
//                     <Tag className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//             {formData.tags.length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {formData.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveTag(tag)}
//                       className="ml-1 text-gray-500 hover:text-gray-700"
//                     >
//                       &times;
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default BlogEditor;
