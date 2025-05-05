import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex justify-center items-center space-x-2 overflow-hidden">
      <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <span className="text-lg font-semibold text-gray-600">Loading...</span>
    </div>
  );
};

export default Loading;
