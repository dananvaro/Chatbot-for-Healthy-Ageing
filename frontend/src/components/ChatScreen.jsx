import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Image as ChakraImage,
  Spinner
} from '@chakra-ui/react';
import Logo from './Logo';
import SettingsSidebar from './SettingsSidebar';
import AccessibilitySidebar from './AccessibilitySidebar';
import sendIcon from '../assets/send-icon.png';
import appleIcon from '../assets/apple-icon.png';
import { sendChatMessage, checkBackendHealth } from '../services/chatService';

const ChatScreen = ({ userPreferences, onboardingData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hei! Jeg er NutriBot 👋\nHvordan kan jeg hjelpe deg i dag?'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [textSize, setTextSize] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [threadID, setThreadID] = useState(null); // Add this to track conversation thread
  const messagesEndRef = useRef(null);

  // Bot settings state
  const [botSettings, setBotSettings] = useState({
    simplerLanguage: false,
    shortAnswers: false,
    showSources: false,
    language: 'no'
  });

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendAvailable(isHealthy);
      if (!isHealthy) {
        console.warn('Backend is not available. Using mock responses.');
      }
    };
    checkHealth();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Build system prompt based on settings and onboarding data
  const buildSystemPrompt = () => {
    let prompt = "Du er NutriBot, en hjelpsom ernæringsassistent for eldre.";
    
    if (onboardingData) {
      // Allergies (step 2)
      if (onboardingData[2] && onboardingData[2].length > 0) {
        prompt += `\n\nBrukeren har følgende allergier eller kostpreferanser: ${onboardingData[2].join(', ')}.`;
        prompt += " Ta hensyn til dette i alle anbefalinger.";
      }
      
      // Health conditions (step 3)
      if (onboardingData[3] && onboardingData[3].length > 0) {
        prompt += `\n\nBrukeren har følgende helseutfordringer: ${onboardingData[3].join(', ')}.`;
        prompt += " Tilpass kostholdsrådene til disse tilstandene.";
      }
    }
    
    if (botSettings.simplerLanguage) {
      prompt += "\n\nBruk enkelt språk og korte setninger. Unngå fagtermer.";
    }
    
    if (botSettings.shortAnswers) {
      prompt += "\n\nHold svarene korte og konsise, maksimum 3-4 setninger.";
    }
    
    if (botSettings.showSources) {
      prompt += "\n\nInkluder alltid kilder til informasjonen.";
    }
    
    const languageInstructions = {
      no: "\n\nSvar på norsk.",
      en: "\n\nAnswer in English.",
      sv: "\n\nSvara på svenska.",
      da: "\n\nSvar på dansk."
    };
    
    prompt += languageInstructions[botSettings.language];
    
    return prompt;
  };

  // Convert messages to API format
  const formatMessagesForAPI = () => {
    const systemPrompt = buildSystemPrompt();
    
    // Start with system message
    const apiMessages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];
    
    // Add conversation history (skip the initial bot greeting)
    messages.slice(1).forEach(msg => {
      apiMessages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });
    
    return apiMessages;
  };

  // Mock response for when backend is not available
  const getMockResponse = (userMessage) => {
    const responses = {
      default: 'Beklager, Nutribot er ikke tilgjengelig for øyeblikket. Dette er en automatisk-respons. Ditt spørsmål var: "' + userMessage + '"',
      protein: 'Gode proteinkilder for eldre inkluderer:\n\n• Fisk (laks, makrell)\n• Egg\n• Kylling og kalkun\n• Bønner og linser\n• Gresk yoghurt\n• Cottage cheese\n• Nøtter og frø',
      vann: 'Som eldre er det viktig å drikke nok væske! Generelt anbefales:\n\n• 1,5-2 liter væske per dag\n• Mer hvis du er fysisk aktiv eller det er varmt\n• Vann, te og kaffe teller med'
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('protein')) return responses.protein;
    if (lowerMessage.includes('vann') || lowerMessage.includes('drikke')) return responses.vann;
    return responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      let botResponse;
      let newThreadID = threadID;

      if (backendAvailable) {
        const systemPrompt = buildSystemPrompt();

        const response = await sendChatMessage(
          userMessage.text,
          threadID,
          systemPrompt,
          botSettings,
          onboardingData
        );

        botResponse = response.response;
        newThreadID = response.threadID;

        // Store thread ID for conversation continuity
        if (!threadID) {
          setThreadID(newThreadID);
          console.log('New thread created:', newThreadID);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        botResponse = getMockResponse(userMessage.text);
      }

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponse
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Kunne ikke sende meldingen. Vennligst prøv igjen.');
      
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: 'Beklager, det oppstod en feil. Vennligst prøv igjen senere.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Map text size to font sizes
  const getFontSize = () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    return sizes[textSize - 1];
  };

  return (
    <Box minH="100vh" bg={isDarkMode ? 'gray.900' : 'gray.300'} p={0} position="relative">
      <Box
        maxW="1600px"
        w="60vw"
        h="90vh"
        bg={isDarkMode ? 'gray.800' : 'white'}
        borderRadius="xl"
        margin="5vh auto"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <HStack pl={16} pt={16} pb={8} justify="space-between">
          <Logo size="lg" />
          {!backendAvailable && (
            <Text fontSize="sm" color="orange.500" fontWeight="medium">
              ⚠️ Backend ikke tilkoblet
            </Text>
          )}
        </HStack>

        {/* Error Alert */}
        {error && (
          <Box mx={6} mb={4} p={3} bg="red.100" borderRadius="md">
            <Text color="red.800" fontSize="sm">{error}</Text>
          </Box>
        )}

        {/* Messages Area */}
        <VStack pl={16} pr={6} spacing={4} align="stretch" flex="1" overflowY="auto">
          {messages.map((message) => (
            <HStack
              key={message.id}
              alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
              align="flex-start"
              spacing={3}
              maxW="100%"
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

          {/* Loading indicator */}
          {isLoading && (
            <HStack alignSelf="flex-start" align="flex-start" spacing={3} maxW="85%">
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
              <Box
                bg={isDarkMode ? 'gray.700' : 'gray.200'}
                p={4}
                borderTopRightRadius="4xl"
                borderBottomLeftRadius="4xl"
                borderBottomRightRadius="4xl"
              >
                <HStack spacing={2}>
                  <Spinner size="sm" />
                  <Text fontSize={getFontSize()}>Skriver...</Text>
                </HStack>
              </Box>
            </HStack>
          )}

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
            disabled={isLoading}
          />
          <IconButton
            aria-label="Send message"
            onClick={handleSendMessage}
            bg="green.800"
            _hover={{ bg: 'green.600' }}
            borderRadius="xl"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading || !inputValue.trim()}
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
        settings={botSettings}
        onSettingsChange={setBotSettings}
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