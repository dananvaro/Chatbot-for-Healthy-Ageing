import { 
  Box, 
  VStack,
  HStack,
  Text,
  Heading,
  Image as ChakraImage
} from '@chakra-ui/react';
import { useState } from 'react';
import { Type, Minus, Plus, Palette, Contrast, Eye, Lightbulb, RotateCcw } from 'lucide-react';
import { InformativeToggleSwitch } from './InformativeToggleSwitch';
import TextSizeIcon from '../assets/acc-text-size.png';
import GrayscaleIcon from '../assets/acc-grayscale.png';
import HighContrastIcon from "../assets/acc-contrast.png";
import NegativeContrastIcon from '../assets/acc-negative-contrast.png';
import LightBackgroundIcon from '../assets/acc-lightbulb.png';

const AccessibilitySidebar = ({ textSize, onTextSizeChange, isDarkMode, onDarkModeChange }) => {
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
    onTextSizeChange(3);
    onDarkModeChange(false);
  };

  // Get font size based on textSize value
  const getPreviewFontSize = () => {
    const sizes = ['sm', 'md', 'lg', 'xl', '2xl'];
    return sizes[textSize - 1];
  };

  // Apply filters based on settings
  const getPreviewFilter = () => {
    let filters = [];
    if (settings.showGrayscale) filters.push('grayscale(100%)');
    if (settings.negativeContrast) filters.push('invert(100%)');
    return filters.length > 0 ? filters.join(' ') : 'none';
  };

  // Get contrast styles
  const getContrastStyles = () => {
    if (settings.highContrast) {
      return {
        textColor: 'black',
        bgColor: 'white',
        borderColor: 'black',
        borderWidth: '2px'
      };
    }
    return {
      textColor: 'gray.800',
      bgColor: 'white',
      borderColor: 'transparent',
      borderWidth: '0'
    };
  };

  const contrastStyles = getContrastStyles();

  return (
    <Box 
      maxW="1200px" 
      flex="1" 
      display="flex" 
      bg="white" 
      borderRadius="xl" 
      boxShadow="sm" 
      overflow="hidden"
    >
      {/* Left Section - Accessibility Settings */}
      <Box
        flex="1"
        pt={8}
        pl={12}        
        overflowY="auto"
        display="flex"
        flexDirection="column"
      >
        <Heading size="4xl" color="gray.800" fontWeight="bold" mb={4}>
          Tilgjengelighet
        </Heading>

        <Heading fontSize="lg" color="gray.800" fontWeight="semibold" mb={2}>
          Utseende
        </Heading>

        <VStack align="stretch" border="1px solid" borderColor="gray.200" borderRadius="xl" boxShadow="sm" pt={4} pl={4} pr={4} pb={2} flex="1">
          {/* Text Size */}
          <Box borderBottom="1px solid" borderColor="gray.200" pb={4}>
            <HStack justify="space-between">
              <HStack spacing={3} align="flex-start">
                <ChakraImage src={TextSizeIcon} alt="Text Size" boxSize="16px" mt={2}/>
                <Box>
                  <Heading fontSize="md" fontWeight="semibold" color="gray.800">
                    Tekststørrelse
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Gjør teksten enklere å lese.
                  </Text>
                </Box>
              </HStack>
              <HStack spacing={2}>
                <Box
                  as="button"
                  w="28px"
                  h="28px"
                  bg="gray.800"
                  opacity={textSize <= 1 ? 0.3 : 1}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  onClick={decreaseTextSize}
                  disabled={textSize <= 1}
                  _hover={{ opacity: textSize > 1 ? 0.8 : 0.3 }}
                  transition="all 0.2s"
                >
                  <Minus size={20} color="white" strokeWidth={3} />
                </Box>
                <Box
                  as="button"
                  w="28px"
                  h="28px"
                  bg="gray.800"
                  opacity={textSize >= 5 ? 0.3 : 1}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  onClick={increaseTextSize}
                  disabled={textSize >= 5}
                  _hover={{ opacity: textSize < 5 ? 0.8 : 0.3 }}
                  transition="all 0.2s"
                >
                  <Plus size={20} color="white" strokeWidth={3} />
                </Box>
              </HStack>
            </HStack>
          </Box>

          {/* Grayscale Toggle */}
          <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={4}>
            <HStack spacing={3} align="flex-start">
              <ChakraImage src={GrayscaleIcon} alt="Grayscale" boxSize="16px" alignContent="flex-start" mt={2}/>
              <Box>
                <Heading  fontSize="md" fontWeight="semibold" color="gray.800">
                  Gråtoner
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Fjerner farger fra visningen.
                </Text>
              </Box>
            </HStack>
            <InformativeToggleSwitch
              isActive={settings.showGrayscale}
              onClick={(checked) => setSettings(prev => ({ ...prev, showGrayscale: checked }))}
              label={settings.showGrayscale ? 'PÅ' : 'AV'}
            />
          </HStack>

          {/* High Contrast Toggle */}
          <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={4}>
            <HStack spacing={3} align="flex-start">
              <ChakraImage src={HighContrastIcon} alt="High Contrast" boxSize="16px" mt={2}/>
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color="gray.800">
                  Høy kontrast
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Gjør tekst og knapper tydeligere
                </Text>
              </Box>
            </HStack>
            <InformativeToggleSwitch
              isActive={settings.highContrast}
              onClick={(checked) => setSettings(prev => ({ ...prev, highContrast: checked }))}
              label={settings.highContrast ? 'PÅ' : 'AV'}
            />
          </HStack>

          {/* Negative Contrast Toggle */}
          <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={4}>
            <HStack spacing={3} align="flex-start">
              <Box mt={2}>
                <Eye size={16} color="black" strokeWidth={3} />
              </Box>
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color="gray.800">
                  Negativ kontrast
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Bytter lys og mørke farger.
                </Text>
              </Box>
            </HStack>
            <InformativeToggleSwitch
              isActive={settings.negativeContrast}
              onClick={(checked) => setSettings(prev => ({ ...prev, negativeContrast: checked }))}
              label={settings.negativeContrast ? 'PÅ' : 'AV'}
            />
          </HStack>

          {/* Light Background Toggle */}
          <HStack justify="space-between" pb={2}>
            <HStack spacing={3} align="flex-start">
              <Box mt={2}>
                <Lightbulb size={16} color="black" strokeWidth={2} fill="black" />
              </Box>
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color="gray.800">
                  Lys bakgrunn
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Bruk en lysere visning.
                </Text>
              </Box>
            </HStack>
            <InformativeToggleSwitch
              isActive={!isDarkMode}
              onClick={(checked) => onDarkModeChange(!checked)}
              label={!isDarkMode ? 'PÅ' : 'AV'}
            />
          </HStack>
        </VStack>
        
        {/* Reset Settings */}
        <HStack spacing={3} cursor="pointer" justifyContent="center" onClick={resetSettings} mt={4}>
          <RotateCcw size={16} color="black" strokeWidth={2} />
          <Text fontSize="sm" fontWeight="bold" color="gray.800">
            Nullstill innstillinger
          </Text>
        </HStack>

        {/* Spacer */}
        <VStack display="flex" flex="1"></VStack>
      </Box>

      {/* Right Section - Preview */}
      <Box 
        flex="1" 
        pl={12}
        pt={24}
        pr={12}
        
        bg="white" 
        overflowY="auto"
        filter={getPreviewFilter()}
        display="flex"
        flexDirection="column"
      >
        <Heading 
          fontSize="lg" 
          color={isDarkMode ? 'white' : contrastStyles.textColor}
          fontWeight="semibold" 
          mb={2}
        >
          Forhåndsvisning
        </Heading>

        <VStack border="1px solid" borderColor="gray.200" borderRadius="xl" boxShadow="sm" spacing={0} flex="1">
          <Box 
            bg={contrastStyles.bgColor} 
            p={4} 
            borderTopRadius="xl"
            border={contrastStyles.borderWidth}
            borderColor={contrastStyles.borderColor}
            w="100%"
          >
            <Text 
              fontSize={getPreviewFontSize()} 
              fontWeight="semibold" 
              color={contrastStyles.textColor}
            >
              Dette er et eksempel på hvordan tekst og farger vises. Utseendet endres automatisk når du justerer innstillingene.
            </Text>
          </Box>

          <Box 
            bg={contrastStyles.bgColor} 
            p={4} 
            border={contrastStyles.borderWidth}
            borderColor={contrastStyles.borderColor}                        
            w="100%"
          >
            <Text 
              fontSize={getPreviewFontSize()} 
              color={contrastStyles.textColor}
            >
              Her kan du teste ulike visninger for å finne det som passer best for deg. Når du endrer tekststørrelse, kontrast eller bakgrunn, oppdateres alt i dette området slik at du kan se effekten med en gang.
            </Text>
          </Box>

          <Box 
            bg={contrastStyles.bgColor} 
            p={4} 
            borderBottomRadius="xl"
            border={contrastStyles.borderWidth}
            borderColor={contrastStyles.borderColor}            
            w="100%"
          >
            <Text 
              fontSize={getPreviewFontSize()}
              color={contrastStyles.textColor}
              mb={8}
            >
              Målet er å gjøre det enklere å lese og mer behagelig å bruke NutriBot, uansett behov.
            </Text>
          </Box>
        </VStack>  

        {/* Reset Settings */}
        <HStack spacing={3} cursor="pointer" justifyContent="center" onClick={resetSettings} mt={4} >
          <RotateCcw size={16} color="transparent" strokeWidth={2} />
          <Text fontSize="sm" fontWeight="bold" color="transparent" >
            Nullstill innstillinger
          </Text>
        </HStack>

        {/* Spacer */}
        <VStack display="flex" flex="1"></VStack>
      </Box>
    </Box>
  );
};

export default AccessibilitySidebar;