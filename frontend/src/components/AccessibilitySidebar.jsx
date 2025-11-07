import { 
  Box, 
  VStack,
  HStack,
  Text,
  Heading,
  Image as ChakraImage
} from '@chakra-ui/react';
import { useState } from 'react';
import { Plus, Minus, Barcode, Contrast, Eye, Lightbulb, RotateCcw } from 'lucide-react';
import accessibilityIcon from '../assets/accessibility-icon.png';

const AccessibilitySidebar = ({ isOpen, onClose, onToggle, textSize, onTextSizeChange, isDarkMode, onDarkModeChange }) => {
  const [settings, setSettings] = useState({
    showGrayscale: false,
    highContrast: false,
    negativeContrast: false
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const increaseTextSize = () => {
    if (textSize < 5) {
      onTextSizeChange(textSize + 1);
    }
  };

  const decreaseTextSize = () => {
    if (textSize > 1) {
      onTextSizeChange(textSize - 1);
    }
  };

  const resetSettings = () => {
    setSettings({
      showGrayscale: false,
      highContrast: false,
      negativeContrast: false
    });
    onTextSizeChange(3); // Reset to normal size
    onDarkModeChange(false); // Reset to light mode
  };

  const ToggleSwitch = ({ isActive, onClick }) => (
    <Box
      as="button"
      w="44px"
      h="24px"
      borderRadius="full"
      bg={isActive ? '#3B4CA0' : 'gray.400'}
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
          bottom={"30%"}
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
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <Text fontSize="lg">A</Text>
                <Text fontSize="md" fontWeight="medium" color="gray.800">
                  Tekststørrelse
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Box
                  as="button"
                  w="32px"
                  h="32px"
                  bg="gray.500"
                  opacity={textSize <= 1 ? 0.3 : 0.7}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  onClick={decreaseTextSize}
                  disabled={textSize <= 1}
                  _hover={{ opacity: textSize > 1 ? 1 : 0.3 }}
                  transition="all 0.2s"
                >
                  <Minus size={24} color="white" />
                </Box>
                <Box
                  as="button"
                  w="32px"
                  h="32px"
                  bg="#3B4CA0"
                  opacity={textSize >= 5 ? 0.7 : 1}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  onClick={increaseTextSize}
                  disabled={textSize >= 5}
                  _hover={{ opacity: textSize < 5 ? 1 : 0.3 }}
                  transition="all 0.2s"
                >
                  <Plus size={24} color="white" />
                </Box>
              </HStack>
            </HStack>

            {/* Grayscale Toggle */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <Barcode size={20} color="black" />
                <Text fontSize="md" fontWeight="medium" color="gray.800">
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
                <Text fontSize="md" fontWeight="medium" color="gray.800">
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
                <Text fontSize="md" fontWeight="medium" color="gray.800">
                  Negativ kontrast
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={settings.negativeContrast}
                onClick={() => toggleSetting('negativeContrast')}
              />
            </HStack>

            {/* Light Background Toggle - ON by default, OFF = dark mode */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <Lightbulb size={20} color="black" />
                <Text fontSize="md" fontWeight="medium" color="gray.800">
                  Lys bakgrunn
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={!isDarkMode}
                onClick={() => onDarkModeChange(!isDarkMode)}
              />
            </HStack>

            {/* Reset Settings */}
            <HStack spacing={3} py={3} cursor="pointer" onClick={resetSettings}>
              <RotateCcw size={20} color="black" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
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