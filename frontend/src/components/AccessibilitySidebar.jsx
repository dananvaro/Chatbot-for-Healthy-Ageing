import { 
  Box, 
  VStack,
  HStack,
  Text,
  Heading,
  Image as ChakraImage
} from '@chakra-ui/react';
import { useState } from 'react';
import { AArrowUp, Barcode, Contrast, Eye, Lightbulb, RotateCcw } from 'lucide-react';
import accessibilityIcon from '../assets/accessibility-icon.png';

const AccessibilitySidebar = ({ isOpen, onClose, onToggle }) => {
  const [settings, setSettings] = useState({
    textSize: 'normal',
    showGrayscale: false,
    highContrast: false,
    negativeContrast: false,
    lightBackground: false
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setTextSize = (size) => {
    setSettings(prev => ({
      ...prev,
      textSize: size
    }));
  };

  const resetSettings = () => {
    setSettings({
      textSize: 'normal',
      showGrayscale: false,
      highContrast: false,
      negativeContrast: false,
      lightBackground: false
    });
  };

  const ToggleSwitch = ({ isActive, onClick }) => (
    <Box
      as="button"
      w="44px"
      h="24px"
      borderRadius="full"
      bg={isActive ? 'blue.800' : 'gray.400'}
      position="relative"
      onClick={onClick}
      transition="background 0.2s"
      cursor="pointer"
      border="none"
    >
      <Box
        position="absolute"
        top="2px"
        left={isActive ? '22px' : '2px'}
        w="20px"
        h="20px"
        borderRadius="full"
        bg="white"
        transition="left 0.2s"
      />
    </Box>
  );

  return (
    <>
      {/* Accessibility Button - Always Visible */}
      <Box
        position="fixed"
        right={isOpen ? '280px' : '0'}
        top={28}
        zIndex={1001}
        transition="right 0.3s"
      >
        <Box
          as="button"
          w="64px"
          h="64px"
          bg="#3B4CA0"
          borderRadius="xl"
          borderTopRightRadius="0"
          borderBottomRightRadius="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={onToggle}
          boxShadow="lg"
          _hover={{ bg: '#5b72e2ff' }}
          transition="all 0.3s"
          p={3}
        >
          <ChakraImage 
            src={accessibilityIcon} 
            alt="Accessibility"
            w="100%"
            h="100%"
            objectFit="contain"
          />
        </Box>
      </Box>

      {/* Sidebar */}
      {isOpen && (
        <Box
          position="fixed"
          right={0}
          top={12}
          bottom={350}
          w="280px"
          bg="white"
          boxShadow="2xl"
          zIndex={1000}
          overflowY="auto"
          borderTopLeftRadius="3xl"
          borderBottomLeftRadius="3xl"
        >
          {/* Title */}
          <Box px={6} pt={4} pb={4} borderBottom="1px solid" borderColor="gray.200">
            <Heading size="xl" color="gray.800" fontWeight="semibold" textAlign="center">
              Tilgjengelighetsverktøy
            </Heading>
          </Box>

          <VStack spacing={0} align="stretch" px={6} py={4}>
            {/* Text Size */}
            <Box py={3}>
              <HStack spacing={3} mb={3}>
                <AArrowUp size={20} color="black" />
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  Tekststørrelse
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Box
                  as="button"
                  flex="1"
                  py={2}
                  bg={settings.textSize === 'small' ? 'blue.300' : 'gray.100'}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => setTextSize('small')}
                  border="2px solid"
                  borderColor={settings.textSize === 'small' ? 'blue.800' : 'transparent'}
                  _hover={{ bg: settings.textSize === 'small' ? 'blue.400' : 'gray.200' }}
                >
                  <Text fontSize="xs" fontWeight="medium" color="gray.800">A-</Text>
                </Box>
                <Box
                  as="button"
                  flex="1"
                  py={2}
                  bg={settings.textSize === 'normal' ? 'blue.300' : 'gray.100'}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => setTextSize('normal')}
                  border="2px solid"
                  borderColor={settings.textSize === 'normal' ? 'blue.800' : 'transparent'}
                  _hover={{ bg: settings.textSize === 'normal' ? 'blue.400' : 'gray.200' }}
                >
                  <Text fontSize="sm" fontWeight="medium" color="gray.800">A</Text>
                </Box>
                <Box
                  as="button"
                  flex="1"
                  py={2}
                  bg={settings.textSize === 'large' ? 'blue.300' : 'gray.100'}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => setTextSize('large')}
                  border="2px solid"
                  borderColor={settings.textSize === 'large' ? 'blue.800' : 'transparent'}
                  _hover={{ bg: settings.textSize === 'large' ? 'blue.400' : 'gray.200' }}
                >
                  <Text fontSize="md" fontWeight="medium" color="gray.800">A+</Text>
                </Box>
              </HStack>
            </Box>

            {/* Grayscale Toggle */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <Barcode size={20} color="black" />
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  Gråtoner
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={settings.showGrayscale}
                onClick={() => toggleSetting('showGrayscale')}
              />
            </HStack>

            {/* High Contrast Toggle */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <Contrast size={20} color="black" />
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  Høy kontrast
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={settings.highContrast}
                onClick={() => toggleSetting('highContrast')}
              />
            </HStack>

            {/* Negative Contrast Toggle */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <Eye size={20} color="black" />
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  Negativ kontrast
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={settings.negativeContrast}
                onClick={() => toggleSetting('negativeContrast')}
              />
            </HStack>

            {/* Light Background Toggle */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <Lightbulb size={20} color="black" />
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  Lys bakgrunn
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={settings.lightBackground}
                onClick={() => toggleSetting('lightBackground')}
              />
            </HStack>

            {/* Reset Settings */}
            <HStack spacing={3} py={3} cursor="pointer" onClick={resetSettings}>
              <RotateCcw size={20} color="black" />
              <Text fontSize="sm" fontWeight="medium" color="gray.800">
                Nullstill innstillinger
              </Text>
            </HStack>
          </VStack>
        </Box>
      )}
    </>
  );
};

export default AccessibilitySidebar;