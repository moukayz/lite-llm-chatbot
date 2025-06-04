interface ShimmerTextProps {
  text: string;
  className?: string;
}

const ShimmerText: React.FC<ShimmerTextProps> = ({ text, className }) => {
  return (
    <div className={`relative inline-block `}>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent bg-clip-text text-transparent animate-shimmer-reverse bg-no-repeat bg-[length:200%_100%]">
        {text}
      </span>
      <span className={`text-gray-900 ${className}`}>{text}</span>
    </div>
  );
};

export default ShimmerText;