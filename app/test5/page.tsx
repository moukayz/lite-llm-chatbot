import React from 'react';

const OverlappingPage = () => {
  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Overlapping Sibling Elements with Negative Margin</h1>
        <div className="relative">
          <div className="relative h-20 bg-blue-500 text-white p-4 overflow-auto  rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">First Element</h2>
            <p>This is the first sibling element.</p>
            <p>This is the first sibling element.</p>
            <p>This is the first sibling element.</p>
            <p>This is the first sibling element.</p>
            <p>This is the first sibling element.</p>
            <p>This is the first sibling element.</p>
            <p>This is the first sibling element.</p>
          </div>
          <div className="relative bg-red-500 text-white p-8 rounded-full shadow-lg -mt-8 ml-8 z-10">
            <h2 className="text-xl font-semibold">Second Element</h2>
            <p>This is the second sibling element, overlapping the first one using a negative top margin.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlappingPage; 