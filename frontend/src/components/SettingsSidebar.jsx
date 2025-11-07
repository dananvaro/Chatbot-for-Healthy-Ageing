import { 
  Box, 
  VStack,
  HStack,
  Text,
  Heading,
  Image as ChakraImage
} from '@chakra-ui/react';
import { MessageCircleMore, FileText, BookOpen, Languages, RotateCcw, ChevronDown } from 'lucide-react';
import settingsIcon from '../assets/settings-icon.png';

const SettingsSidebar = ({ isOpen, onClose, onToggle, settings, onSettingsChange }) => {
  const toggleSetting = (key) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleLanguageChange = (e) => {
    onSettingsChange({
      ...settings,
      language: e.target.value
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

  const ToggleSwitch = ({ isActive, onClick }) => (
    <Box
      as="button"
      w="44px"
      h="24px"
      borderRadius="full"
      bg={isActive ? 'green.800' : 'gray.400'}
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

  const getLanguageLabel = () => {
    const labels = {
      no: 'Norsk',
      en: 'English',
      sv: 'Svenska',
      da: 'Dansk'
    };
    return labels[settings.language];
  };

  return (
    <>
      {/* Settings Button - Always Visible */}
      <Box
        position="fixed"
        left={isOpen ? '280px' : '0'}
        top={28}
        zIndex={1001}
        transition="left 0.3s"
      >
        <Box
          as="button"
          w="64px"
          h="64px"
          bg="green.800"
          borderRadius="xl"
          borderTopLeftRadius="0"
          borderBottomLeftRadius="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={onToggle}
          boxShadow="lg"
          _hover={{ bg: 'green.600' }}
          transition="all 0.3s"
          p={3}
        >
          <ChakraImage 
            src={settingsIcon} 
            alt="Settings"
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
          left={0}
          top={12}
          bottom={"40%"}
          w="280px"
          bg="white"
          boxShadow="2xl"
          zIndex={1000}
          overflowY="auto"
          borderTopRightRadius="3xl"
          borderBottomRightRadius="3xl"
        >
          {/* Title */}
          <Box px={6} pt={4} pb={4} borderBottom="1px solid" borderColor="gray.200">
            <Heading size="xl" color="gray.800" fontWeight="semibold" textAlign="center">
              Tilpass Nutribot
            </Heading>
          </Box>

          <VStack spacing={0} align="stretch" px={6} py={4}>
            {/* Simpler Language Toggle */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <MessageCircleMore size={20} color="black" />
                <Text fontSize="md" fontWeight="medium" color="gray.800">
                  Bruk enklere språk
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={settings.simplerLanguage}
                onClick={() => toggleSetting('simplerLanguage')}
              />
            </HStack>

            {/* Short Answers Toggle */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <FileText size={20} color="black" />
                <Text fontSize="md" fontWeight="medium" color="gray.800">
                  Korte svar
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={settings.shortAnswers}
                onClick={() => toggleSetting('shortAnswers')}
              />
            </HStack>

            {/* Show Sources Toggle */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <BookOpen size={20} color="black" />
                <Text fontSize="md" fontWeight="medium" color="gray.800">
                  Vis kilder
                </Text>
              </HStack>
              <ToggleSwitch
                isActive={settings.showSources}
                onClick={() => toggleSetting('showSources')}
              />
            </HStack>

            {/* Language Selection */}
            <HStack justify="space-between" py={3}>
              <HStack spacing={3}>
                <Languages size={20} color="black" />
                <Text fontSize="md" fontWeight="medium" color="gray.800">
                  Språk
                </Text>
              </HStack>
              <Box position="relative">
                <Box
                  as="select"
                  value={settings.language}
                  onChange={handleLanguageChange}
                  w="90px"
                  h="28px"
                  bg="gray.800"
                  color="white"
                  backgroundColor={"#1C5E47"}
                  borderRadius="full"
                  border="none"
                  px={4}
                  pr={8}
                  cursor="pointer"
                  appearance="none"
                  fontSize="md"
                  _focus={{ outline: 'none' }}
                >
                  <option value="no">Norsk</option>
                  <option value="en">English</option>
                  <option value="sv">Svenska</option>
                  <option value="da">Dansk</option>
                </Box>
                <Box
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  pointerEvents="none"
                >
                  <ChevronDown size={20} color="white" />
                </Box>
              </Box>
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

export default SettingsSidebar;