import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex animate-pulse gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-3 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
