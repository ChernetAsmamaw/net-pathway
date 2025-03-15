import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface PathCardProps {
  path: {
    id: string;
    title: string;
    description: string;
    image: string;
    matchPercentage: number;
    lastViewed: string;
  };
}

const DashboardPathCard: React.FC<PathCardProps> = ({ path }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="relative h-32">
        <Image
          src={path.image}
          alt={path.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/70 to-sky-500/70"></div>
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-sky-600">
          {path.matchPercentage}% Match
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{path.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {path.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Viewed {path.lastViewed}
          </span>
          <Link
            href={`/paths/${path.id}`}
            className="flex items-center text-xs font-medium text-sky-600 hover:text-sky-800 transition-colors"
          >
            Explore
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPathCard;
