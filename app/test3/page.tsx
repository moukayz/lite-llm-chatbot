interface ShimmerTextProps {
  text: string;
  className?: string;
}

const ShimmerText: React.FC<ShimmerTextProps> = ({ text, className }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent bg-clip-text text-transparent animate-shimmer-reverse bg-no-repeat bg-[length:200%_100%]">
        {text}
        {/* hello world */}
      </span>
      <span className="text-gray-900">
        {text}
      </span>
    </div>
  );
};

const App: React.FC = () => {
  const demoText = "Shimmer";
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 space-y-12">
      
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Step 1: Base Text</h2>
        <p className="text-sm text-gray-600 mb-2">This is the underlying solid text. The shimmer appears to pass over this.</p>
        <span className="text-4xl font-bold text-gray-900">{demoText}</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Step 2: The Gradient (Visualized on a Block) - Reversed</h2>
        <p className="text-sm text-gray-600 mb-2">This is the moving gradient, now sweeping left-to-right. It&apos;s wide (200% of the text width). Here, it&apos;s shown on a block for clarity.</p>
        <div className="w-48 h-16 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-reverse bg-no-repeat bg-[length:200%_100%] border border-gray-300"></div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Step 3: Gradient Clipped to Text (Static) - Reversed Start</h2>
        <p className="text-sm text-gray-600 mb-2">Gradient clipped to text. Animation paused at the starting position for a left-to-right sweep (<code>bg-[position:200%_0]</code>).</p>
        <span className="text-4xl font-bold bg-gradient-to-r from-transparent via-white to-transparent bg-clip-text text-transparent bg-no-repeat bg-[length:200%_100%] bg-[position:200%_0]">
          {demoText}
        </span>
        <span className="block text-xs text-gray-500 mt-1">(The actual gradient is there, but might be on its transparent part initially)</span>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Step 4: The Two Layers (Conceptual) - Reversed</h2>
        <p className="text-sm text-gray-600 mb-2">Imagine the reversed animated gradient text layered on top of the base text.</p>
        <div className="relative inline-block">
           {/* Base text */}
          <span className="text-4xl font-bold text-gray-900 opacity-50">{demoText} (Base - slightly faded)</span>
           {/* Shimmer layer - updated to animate-shimmer-reverse and corrected text content */}
          <span className="absolute top-1 left-1 text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-100 to-blue-400 bg-clip-text text-transparent bg-no-repeat bg-[length:200%_100%] animate-shimmer-reverse">
            {demoText} (Reversed Shimmer Layer)
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Final Result: Shimmering Text - Reversed</h2>
        <p className="text-sm text-gray-600 mb-2">All elements combined, with the shimmer now sweeping left-to-right.</p>
        <ShimmerText text={demoText} className="text-4xl font-bold" />
      </div>

    </div>
  );
};

export default App; 