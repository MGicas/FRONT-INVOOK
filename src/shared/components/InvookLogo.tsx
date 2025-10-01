interface InvookLogoProps {
  height?: number;
  width?: string | number;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const InvookLogo = ({ 
  height = 50, 
  width = 'auto', 
  alt = 'INVOOK Logo',
  className,
  style,
  ...props
}: InvookLogoProps) => {
  return (
    <img 
      src="/src/assets/INVOOK.png"
      alt={alt}
      className={className}
      style={{
        height: `${height}px`,
        width: width,
        objectFit: 'contain',
        display: 'block',
        ...style
      }}
      {...props}
    />
  );
};

export default InvookLogo;