import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">Loading questions...</h3>
          <p className="mt-1 text-sm text-gray-500">Generating your vocabulary battle. This might take a moment.</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
