const Logo = ({ className = "h-8 w-8" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagon shape for medical/health feel */}
      <path
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
        className="fill-primary/10 stroke-primary"
        strokeWidth="3"
      />
      
      {/* Stylized "N" with medical cross integration */}
      <path
        d="M30 35 L30 65 L45 65 L45 48 L55 65 L70 65 L70 35 L55 35 L55 52 L45 35 Z"
        className="fill-primary"
      />
      
      {/* Accent dot for uniqueness */}
      <circle 
        cx="50" 
        cy="25" 
        r="4" 
        className="fill-primary-glow animate-pulse"
      />
    </svg>
  );
};

export default Logo;
