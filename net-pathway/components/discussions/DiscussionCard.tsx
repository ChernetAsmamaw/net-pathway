import { MessageSquare, Users, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";

interface DiscussionCardProps {
  discussion: {
    id: number;
    title: string;
    description: string;
    creator: {
      name: string;
      avatar: string;
    };
    participants: number;
    messages: number;
    lastActive: string;
    tags: string[];
  };
  onClick: () => void;
}

export default function DiscussionCard({ discussion, onClick }: DiscussionCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={discussion.creator.avatar}
              alt={discussion.creator.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">
              {discussion.title}
            </h3>
            <p className="text-sm text-gray-500">
              Started by {discussion.creator.name}
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{discussion.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {discussion.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-sky-50 text-sky-700 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{discussion.participants}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{discussion.messages}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{discussion.lastActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
}