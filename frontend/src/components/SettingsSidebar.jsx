import React from 'react';
import { 
  Box, 
  VStack,
  HStack,
  Text,
  Heading,
  Image as ChakraImage
} from '@chakra-ui/react';
import { MessageCircleMore, FileText, BookOpen, Languages, RotateCcw } from 'lucide-react';
import { InformativeToggleSwitch } from './InformativeToggleSwitch';

const SettingsSidebar = ({ settings, onSettingsChange }) => {
  const [isActive, setIsActive] = React.useState(false);

  const toggleSetting = (key) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleLanguageChange = (lang) => {
    onSettingsChange({
      ...settings,
      language: lang
    });
  };

  const resetSettings = () => {
    onSettingsChange({
      simplerLanguage: false,
      shortAnswers: false,
      showSources: false,
      language: 'no'
    });
  };

  // Get preview text based on settings
  const getPreviewText = () => {
    if (settings.simplerLanguage && settings.shortAnswers) {
      return "Jeg er NutriBot. Jeg hjelper deg med mat og helse. Du kan spørre meg når som helst!";
    } else if (settings.simplerLanguage) {
      return "Hei! Jeg er NutriBot 🍎\n\nJeg forklarer med enkle ord slik at det er lett å forstå. Du kan spørre meg om kosthold, trening og helse, så får du tydelige råd og informasjon.";
    } else if (settings.shortAnswers) {
      return "Jeg er NutriBot, din personlige ernæringsassistent. Still meg spørsmål om kosthold og helse for å få korte, konkrete svar.";
    }
    return "Hei! Jeg er NutriBot 🍎\n\nJeg forklarer med enkle ord og svarer kort slik at det er lett å forstå.\n\nDu kan spørre meg om kosthold, trening og helse, så får du tydelige råd og informasjon.";
  };

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
      {/* Left Section - Settings */}
      <Box
        flex="1"
        pt={8}
        pl={12}        
        overflowY="auto"
        display="flex"
        flexDirection="column"
      >
        <Heading size="4xl" color="gray.800" fontWeight="bold" mb={4}>
          Innstillinger
        </Heading>

        <Heading fontSize="lg" color="gray.800" fontWeight="semibold" mb={2}>
          Tilpass Nutribot
        </Heading>

        <VStack align="stretch" border="1px solid" borderColor="gray.200" borderRadius="xl" boxShadow="sm" pt={4} pl={4} pr={4} pb={2} flex="1">
          {/* Simpler Language Toggle */}
          <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={4}>
            <HStack spacing={3} align="flex-start">
              <Box mt={2}>
                <MessageCircleMore size={16} color="black" strokeWidth={2} />
              </Box>
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color="gray.800">
                  Bruk enklere språk
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Forklar med enklere ord for lettere lesing.
                </Text>
              </Box>
            </HStack>
            <InformativeToggleSwitch
              isActive={settings.simplerLanguage}
              onClick={(checked) => onSettingsChange({ ...settings, simplerLanguage: checked })}
              label={settings.simplerLanguage ? 'PÅ' : 'AV'}
            />
          </HStack>

          {/* Short Answers Toggle */}
          <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={4}>
            <HStack spacing={3} align="flex-start">
              <Box mt={2}>
                <FileText size={16} color="black" strokeWidth={2} />
              </Box>
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color="gray.800">
                  Korte svar
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Gjør svaret kortere og mer konkret.
                </Text>
              </Box>
            </HStack>
            <InformativeToggleSwitch
              isActive={settings.shortAnswers}
              onClick={(checked) => onSettingsChange({ ...settings, shortAnswers: checked })}
              label={settings.shortAnswers ? 'PÅ' : 'AV'}
            />
          </HStack>

          {/* Show Sources Toggle */}
          <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={4}>
            <HStack spacing={3} align="flex-start">
              <Box mt={2}>
                <BookOpen size={16} color="black" strokeWidth={2} />
              </Box>
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color="gray.800">
                  Vis kilder til svar
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Vis kilder for informasjon og anbefalinger
                </Text>
              </Box>
            </HStack>
            <InformativeToggleSwitch
              isActive={settings.showSources}
              onClick={(checked) => onSettingsChange({ ...settings, showSources: checked })}
              label={settings.showSources ? 'PÅ' : 'AV'}
            />
          </HStack>

          {/* Language Selection */}
          <HStack justify="space-between" pb={2}>
            <HStack spacing={3} align="flex-start">
              <Box mt={2}>
                <Languages size={16} color="black" strokeWidth={2} />
              </Box>
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color="gray.800">
                  Velg språk
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Velg mellom norsk og engelsk
                </Text>
              </Box>
            </HStack>
            <HStack spacing={2}>
              <Box
                as="button"
                px={2}                
                color={settings.language === 'no' ? 'gray.800' : 'gray.500'}
                fontWeight={settings.language === 'no' ? "bold" : "normal"}
                fontSize="md"
                onClick={() => handleLanguageChange('no')}
                cursor="pointer"
                borderRight="1px solid"
                borderColor="gray.300"
              >
                Norsk
              </Box>
              <Box
                as="button"
                
                color={settings.language === 'en' ? 'gray.800' : 'gray.500'}
                fontWeight={settings.language === 'en' ? "bold" : "normal"}
                fontSize="md"
                onClick={() => handleLanguageChange('en')}
                cursor="pointer"
              >
                English
              </Box>
            </HStack>
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
        display="flex"
        flexDirection="column"
      >
        <Heading 
          fontSize="lg" 
          color="gray.800"
          fontWeight="semibold" 
          mb={2}
        >
          Forhåndsvisning
        </Heading>

        <VStack border="1px solid" borderColor="gray.200" borderRadius="xl" boxShadow="sm" spacing={0} flex="1">
          <Box 
            bg="white" 
            p={4} 
            borderTopRadius="xl"
            w="100%"
          >
            <Text fontSize="lg" whiteSpace="pre-line">
              {getPreviewText()}
            </Text>
          </Box>

          {settings.showSources && (
            <Box 
              bg="white" 
              p={4}
              w="100%"
              borderTop="1px solid"
              borderTopColor="gray.200"
            >
              <Text fontSize="sm" color="gray.600" fontStyle="italic">
                Kilde: Helsedirektoratet (2023)
              </Text>
            </Box>
          )}

          {settings.language !== 'no' && (
            <Box 
              bg="blue.50" 
              p={4} 
              borderBottomRadius="xl"
              w="100%"
              borderTop="1px solid"
              borderTopColor="gray.200"
            >
              <Text fontSize="sm" color="blue.800" fontWeight="semibold">
                Språk endret til: {settings.language === 'en' ? 'English' : 'Norsk'}
              </Text>
            </Box>
          )}
        </VStack>

        {/* Reset Settings - Transparent (for spacing) */}
        <HStack spacing={3} cursor="pointer" justifyContent="center" >
          <RotateCcw size={16} color="transparent" strokeWidth={2} />
          <Text fontSize="sm" fontWeight="bold" color="transparent">
            Nullstill innstillinger
          </Text>
        </HStack>

        {/* Spacer */}
        <VStack display="flex" flex="1"></VStack>
      </Box>
    </Box>
  );
};

export default SettingsSidebar;