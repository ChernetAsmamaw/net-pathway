import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Users, Clock, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";

interface DiscussionCardProps {
  discussion: {
    _id: string;
    title: string;
    description: string;
    creator: {
      _id: string;
      username: string;
      profilePicture?: string;
    };
    participants: Array<{
      _id: string;
      username: string;
      profilePicture?: string;
    }>;
    messages?: any[];
    tags: string[];
    lastActivity: string;
    createdAt: string;
  };
  onClick: () => void;
}

export default function DiscussionCard({
  discussion,
  onClick,
}: DiscussionCardProps) {
  // Format the last active time as a relative time (e.g., "2 hours ago")
  const formatLastActive = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  const messagesCount = discussion.messages?.length || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            {discussion.creator.profilePicture ? (
              <Image
                src={discussion.creator.profilePicture}
                alt={discussion.creator.username}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-sky-100 to-purple-100 flex items-center justify-center text-sky-600 font-semibold">
                {discussion.creator.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">
              {discussion.title}
            </h3>
            <p className="text-sm text-gray-500">
              Started by {discussion.creator.username}
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {discussion.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {discussion.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-sky-50 text-sky-700 rounded-full text-sm flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{discussion.participants.length}</span>
            </div>
            {/* <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{messagesCount}</span>
            </div> */}
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formatLastActive(discussion.lastActivity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
