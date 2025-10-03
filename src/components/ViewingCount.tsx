import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const ViewingCount = () => {
  const [viewingCount, setViewingCount] = useState(0);

  useEffect(() => {
    // Initialize with random number between 8 and 25
    setViewingCount(Math.floor(Math.random() * (25 - 8 + 1)) + 8);

    const interval = setInterval(() => {
      // Update to new random number every 3-7 seconds
      setViewingCount(Math.floor(Math.random() * (25 - 8 + 1)) + 8);
    }, (Math.random() * 4000 + 3000)); // Random interval between 3-7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 text-sm bg-primary/10 text-primary px-4 py-2 rounded-full animate-pulse">
      <Eye className="h-4 w-4" />
      <span className="font-medium">{viewingCount} people are viewing this product right now</span>
    </div>
  );
};

export default ViewingCount;