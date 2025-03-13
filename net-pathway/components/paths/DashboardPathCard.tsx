import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardPathCardProps {
  path: {
    id: string;
    title: string;
    description: string;
    image: string;
    matchPercentage: number;
    lastViewed: string;
  };
}

export default function DashboardPathCard({ path }: DashboardPathCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/paths/${path.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="relative h-32 w-full">
        <Image
          src={path.image}
          alt={path.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        <div className="absolute top-2 right-2">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-sky-700">
            {path.matchPercentage}% Match
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 group-hover:text-sky-700 transition-colors mb-1">
          {path.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {path.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            Last viewed: {path.lastViewed}
          </div>
          <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}