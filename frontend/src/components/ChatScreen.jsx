import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Image as ChakraImage
} from '@chakra-ui/react';
import Logo from './Logo';
import SettingsSidebar from './SettingsSidebar';
import AccessibilitySidebar from './AccessibilitySidebar';
import sendIcon from '../assets/send-icon.png';
import appleIcon from '../assets/apple-icon.png';

const ChatScreen = ({ userPreferences }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hei! Jeg er NutriBot 👋\nHvordan kan jeg hjelpe deg i dag?'
    },
    {
      id: 2,
      type: 'user',
      text: 'Hva er de beste kildene til protein for eldre?'
    },
    {
      id: 3,
      type: 'bot',
      text: 'Gode proteinkilder for eldre inkluderer:\n\n• Fisk (laks, makrell)\n• Egg\n• Kylling og kalkun\n• Bønner og linser\n• Gresk yoghurt\n• Cottage cheese\n• Nøtter og frø\n\nDet anbefales å få minst 1-1,2 gram protein per kilo kroppsvekt daglig for å opprettholde muskelmasse.'
    },
    {
      id: 4,
      type: 'user',
      text: 'Hvor mye vann bør jeg drikke daglig?'
    },
    {
      id: 5,
      type: 'bot',
      text: 'Som eldre er det viktig å drikke nok væske! Generelt anbefales:\n\n• 1,5-2 liter væske per dag\n• Mer hvis du er fysisk aktiv eller det er varmt\n• Vann, te og kaffe teller med\n• Frukt og grønnsaker gir også væske\n\nHusk at tørstefølelsen kan være redusert med alderen, så drikk jevnlig gjennom dagen selv om du ikke føler deg tørst.'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [textSize, setTextSize] = useState(3); // 1-5 scale, 3 is normal
  const [isDarkMode, setIsDarkMode] = useState(false); // Light mode by default
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputValue
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Map text size to font sizes
  const getFontSize = () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    return sizes[textSize - 1];
  };

  return (
    <Box minH="100vh" bg={isDarkMode ? 'gray.900' : 'gray.300'} p={4} position="relative">
      <Box
        maxW="900px"
        w="full"
        h="90vh"
        bg={isDarkMode ? 'gray.800' : 'white'}
        borderRadius="xl"
        margin="0 auto"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <HStack pl={16} pt={16} pb={8} justify="space-between">
          <Logo size="lg" />
        </HStack>

        {/* Messages Area */}
        <VStack pl={16} pr={6} spacing={4} align="stretch" flex="1" overflowY="auto">
          {messages.map((message) => (
            <HStack
              key={message.id}
              alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
              align="flex-start"
              spacing={3}
              maxW="70%"
            >
              {message.type === 'bot' && (
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="green.800"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  overflow="hidden"
                  p={2}
                >
                  <ChakraImage 
                    src={appleIcon} 
                    alt="NutriBot" 
                    w="80%"
                    h="80%"
                    objectFit="contain"
                    filter="brightness(0) invert(1)"
                  />
                </Box>
              )}
              <Box
                bg={message.type === 'user' ? 'green.800' : (isDarkMode ? 'gray.700' : 'gray.200')}
                color={message.type === 'user' ? 'white' : (isDarkMode ? 'white' : 'black')}
                p={4}
                borderTopLeftRadius={message.type === 'user' ? '4xl' : 'sm'}
                borderTopRightRadius={message.type === 'user' ? 'sm' : '4xl'}
                borderBottomLeftRadius="4xl"
                borderBottomRightRadius="4xl"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
              >
                <Text fontSize={getFontSize()} whiteSpace="pre-line">{message.text}</Text>
              </Box>
            </HStack>
          ))}
          <div ref={messagesEndRef} />
        </VStack>

        {/* Input Area */}
        <HStack p={6} borderTop="1px solid" borderColor={isDarkMode ? 'gray.700' : 'gray.200'} spacing={3}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Spør om hva som helst"
            bg={isDarkMode ? 'gray.700' : 'gray.800'}
            color="white"
            size="lg"
            borderRadius="xl"
            border="none"
            _placeholder={{ color: 'gray.400' }}
            _focus={{ boxShadow: 'none' }}
          />
          <IconButton
            aria-label="Send message"
            onClick={handleSendMessage}
            bg="green.800"
            _hover={{ bg: 'green.600' }}
            borderRadius="xl"
            size="lg"
          >
            <ChakraImage 
              src={sendIcon} 
              alt="Send" 
              boxSize="20px"
              filter="brightness(0) invert(1)"
            />
          </IconButton>
        </HStack>
      </Box>

      {/* Overlays */}
      {(showSettings || showAccessibility) && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={998}
          onClick={() => {
            setShowSettings(false);
            setShowAccessibility(false);
          }}
        />
      )}
      
      {/* Sidebars */}
      <SettingsSidebar 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        onToggle={() => setShowSettings(!showSettings)}
      />
      
      <AccessibilitySidebar 
        isOpen={showAccessibility} 
        onClose={() => setShowAccessibility(false)}
        onToggle={() => setShowAccessibility(!showAccessibility)}
        textSize={textSize}
        onTextSizeChange={setTextSize}
        isDarkMode={isDarkMode}
        onDarkModeChange={setIsDarkMode}
      />
    </Box>
  );
};

export default ChatScreen;