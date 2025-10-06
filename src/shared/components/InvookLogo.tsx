import { Box } from '@mui/material';
import invookLogo from '../../assets/INVOOK.png';

interface InvookLogoProps {
  height?: number;
  width?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const InvookLogo = ({ 
  height = 60, 
  width, 
  onClick,
  style 
}: InvookLogoProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        width: width || 'auto',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      <img
        src={invookLogo}
        alt="Invook Logo"
        style={{
          height: `${height}px`,
          width: width ? `${width}px` : 'auto',
          objectFit: 'contain',
          maxWidth: '100%',
        }}
      />
    </Box>
  );
};

export default InvookLogo;