import { Box, Heading } from '@chakra-ui/react';

const Logo = ({ size = 'md', position = 'static' }) => {
  const sizes = {
    sm: 'lg',
    md: '2xl',
    lg: '4xl'
  };

  const isFixed = position === 'fixed';

  return (
    <Box 
      display="flex" 
      justifyContent={isFixed ? 'flex-start' : 'center'}
      position={isFixed ? 'absolute' : 'static'}
      top={isFixed ? 4 : undefined}
      left={isFixed ? 8 : undefined}
      zIndex={isFixed ? 10 : undefined}
    >
      <Heading
        size={sizes[size]}
        color="green.800"                
        fontWeight="bold"
      >
        Nutri
      </Heading>
      <Heading
        size={sizes[size]}
        color="gray.800"                
        fontWeight="medium"
      >
        Bot.
      </Heading>
    </Box>
  );
};

export default Logo;