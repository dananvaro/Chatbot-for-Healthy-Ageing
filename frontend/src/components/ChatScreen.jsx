import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Input,
  VStack,
  HStack,
  Text,
  Heading,
  IconButton,
  Image as ChakraImage,
  Spinner,
  Button
} from '@chakra-ui/react';
import { MessageCircle, ChevronRight, Send, MessageCircleMore } from 'lucide-react';
import Logo from './Logo';
import SettingsSidebar from './SettingsSidebar';
import AccessibilitySidebar from './AccessibilitySidebar';
import messageIcon from '../assets/message-icon-2.png';
import messageIconBlack from '../assets/message-icon-2-black.png';
import appleIcon from '../assets/apple-icon.png';
import settingsIcon from '../assets/settings-icon.png';
import accessibilityIcon from '../assets/accessibility-icon.png';
import accessibilityIcon2 from '../assets/accessibility-icon-2.png';
import accessibilityIconDarkBg from '../assets/accessibility-icon-dark-bg.png';
import settingsIcon2 from '../assets/settings-icon-2.png';
import preferencesIcon from '../assets/preferences-icon.png';
import sendIcon2 from '../assets/send-icon-2.png';
import { sendChatMessage, checkBackendHealth, updatePreferences } from '../services/chatService';

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
  const [activeView, setActiveView] = useState('chat'); // 'chat', 'settings', or 'accessibility'
  const [textSize, setTextSize] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [threadID, setThreadID] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState('current');
  const messagesEndRef = useRef(null);

  // Bot settings state
  const [botSettings, setBotSettings] = useState({
    simplerLanguage: false,
    shortAnswers: false,
    showSources: false,
    language: 'no'
  });

  // Mock previous conversations for the sidebar
  const previousConversations = [
    { id: 1, preview: 'Hvor mye protein ...' },
    { id: 2, preview: 'Hvordan kan jeg  ...' },
    { id: 3, preview: 'Hvilken type mat ...' },
    { id: 4, preview: 'Kan man bruke me ...' }
  ];

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
      if (onboardingData[2] && onboardingData[2].length > 0) {
        prompt += `\n\nBrukeren har følgende allergier eller kostpreferanser: ${onboardingData[2].join(', ')}.`;
        prompt += " Ta hensyn til dette i alle anbefalinger.";
      }
      
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

  const getFontSize = () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    return sizes[textSize - 1];
  };

  useEffect(() => {
    if (threadID && backendAvailable) {
      const syncPreferences = async () => {
        try {
          await updatePreferences(threadID, botSettings, onboardingData);
          console.log('Preferences synced to backend');
        } catch (error) {
          console.error('Failed to sync preferences:', error);
        }
      };

      syncPreferences();
    }
  }, [botSettings, threadID, backendAvailable, onboardingData]);

  return (
    <Box width="100vw" height="100vh" bg="gray.100" display="flex" justifyContent="center" p={12} gap={12}>
      {/* Left Sidebar */}
      <Box
        w="15%"
        minW="240px"
        bg="white"
        borderRadius="xl"
        display="flex"
        flexDirection="column"
        flexShrink={0}
        boxShadow="sm"
      >
        {/* Logo */}
        <Box p={6}>
          <Logo size="lg" />
        </Box>

        {/* Current Conversation dark grey */}
        <Box mb={6}>
          <Button
            w="100%"
            bg={activeView === 'chat' ? "gray.800" : "transparent"}
            color={activeView === 'chat' ? "white" : "gray.800"}
            _hover={{ bg: activeView === 'chat' ? 'gray.600' : 'gray.200' }}
            justifyContent="flex-start"
            fontWeight={activeView === 'chat' ? "bold" : "semibold"}
            fontSize="md"
            borderRadius={0}
            h="60px"
            position="relative"
            onClick={() => setActiveView('chat')}
          >
            <HStack ml={2}>
              <ChakraImage
                src={activeView === 'chat' ? messageIcon : messageIconBlack}
                alt="Samtale"
                boxSize="28px"
                filter={activeView === 'chat' ? 'brightness(0) invert(1)' : 'none'}
                transition="filter 0.2s"
              />
              <Text ml={6}>Samtale</Text>
            </HStack>
          </Button>
        </Box>

        {/* Previous Conversations */}
        <Box flex="1" overflowY="auto" px={4}>
          <Text fontSize="md" fontWeight="bold" color="gray.600" mb={2} px={2}>
            Tidligere samtaler
          </Text>
          <VStack spacing={1} align="stretch" ml={2} mr={2}>
            {previousConversations.map((conv) => (
              <Button
                key={conv.id}
                w="100%"                
                bg="gray.100"
                color="gray.700"
                _hover={{ bg: 'gray.300' }}
                justifyContent="space-between"
                fontWeight="normal"
                fontSize="sm"
                h="40px"
                borderRadius="md"
                px={3}
              >
                <Text fontWeight="medium" isTruncated>{conv.preview}</Text>
                <ChevronRight size={24} />
              </Button>
            ))}
          </VStack>
        </Box>

        {/* Bottom Menu Items */}
        <VStack spacing={0} borderColor="gray.200" mb={4}>
          <Button
            w="100%"
            bg={activeView === 'preferences' ? "gray.800" : "transparent"}
            color={activeView === 'preferences' ? "white" : "gray.800"}
            _hover={{ bg: activeView === 'preferences' ? 'gray.600' : 'gray.200' }}
            justifyContent="flex-start"
            fontWeight="semibold"
            fontSize="md"
            h="56px"
            borderRadius={0}
            onClick={() => setActiveView('preferences')}
          >
            <ChakraImage 
              src={preferencesIcon} 
              alt="Tilpass Nutribot" 
              boxSize="28px" 
              filter={activeView === 'preferences' ? 'brightness(0) invert(1)' : 'none'}
              transition="filter 0.2s"
            />
            <Text ml={2}>Tilpass Nutribot</Text>
          </Button>
          <Button
            w="100%"
            bg={activeView === 'settings' ? "gray.800" : "transparent"}
            color={activeView === 'settings' ? "white" : "gray.800"}
            _hover={{ bg: activeView === 'settings' ? 'gray.600' : 'gray.200' }}
            justifyContent="flex-start"
            fontWeight="semibold"
            fontSize="md"
            h="56px"
            borderRadius={0}
            onClick={() => setActiveView('settings')}
          >
            <ChakraImage 
              src={settingsIcon2} 
              alt="Innstillinger" 
              boxSize="28px" 
              filter={activeView === 'settings' ? 'brightness(0) invert(1)' : 'none'}
              transition="filter 0.2s"
            />
            <Text ml={2}>Innstillinger</Text>
          </Button>
          <Button
            w="100%"
            bg={activeView === 'accessibility' ? "gray.800" : "transparent"}
            color={activeView === 'accessibility' ? "white" : "gray.800"}
            _hover={{ bg: activeView === 'accessibility' ? 'gray.600' : 'gray.200' }}
            justifyContent="flex-start"            
            fontWeight="semibold"
            fontSize="md"
            h="56px"
            borderRadius={0}
            onClick={() => { setActiveView('accessibility'); setShowAccessibility(true); }}
          >
            <ChakraImage 
              src={activeView === 'accessibility' ? accessibilityIconDarkBg : accessibilityIcon2} 
              alt="Tilgjengelighet" 
              boxSize="28px" 
              filter={activeView === 'accessibility' ? 'brightness(0) invert(1)' : 'none'}
              transition="filter 0.2s"
            />
            <Text ml={2}>Tilgjengelighet</Text>
          </Button>
        </VStack>
      </Box>

      {/* Main Content Area - Conditional Rendering */}
      {activeView === 'chat' && (
        <Box maxW="1200px" px={8} flex="1" display="flex" flexDirection="column" bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
          {/* Chat Header */}
          <Box bg="white" borderColor="gray.200" px={8} pt={8}>
            <Heading size="4xl" color="gray.800" fontWeight="bold">
              Samtale
            </Heading>
          </Box>

          {/* Messages Area */}
          <VStack flex="1" overflowY="auto" px={8} py={6} spacing={4} align="stretch">
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
                    w="40px"
                    h="40px"
                    borderRadius="full"                  
                    bg="green.800"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    p={2}
                  >
                    <ChakraImage 
                      src={appleIcon} 
                      alt="NutriBot" 
                      w="100%"
                      h="100%"
                      objectFit="contain"
                      filter="brightness(0) invert(1)"
                    />
                  </Box>
                )}
                <Box
                  bg={message.type === 'user' ? 'green.800' : 'gray.200'}
                  color={message.type === 'user' ? 'white' : 'black'}
                  p={2}
                  borderRadius="xl"
                  borderBottomRightRadius={message.type === "user" ? "3xl" : "4xl"}
                  borderBottomLeftRadius={message.type === "user" ? "4xl" : "3xl"}
                  borderTopLeftRadius={message.type === 'user' ? '4xl' : '0'}
                  borderTopRightRadius={message.type === 'user' ? '0' : '4xl'}
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  <Text fontSize={getFontSize()} whiteSpace="pre-line" mr={4} ml={4}>
                    {message.text}
                  </Text>
                </Box>
              </HStack>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <HStack alignSelf="flex-start" align="flex-start" spacing={3} maxW="70%">
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg="green.800"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  p={2}
                >
                  <ChakraImage 
                    src={appleIcon} 
                    alt="NutriBot" 
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    filter="brightness(0) invert(1)"
                  />
                </Box>
                <Box bg="gray.200" p={4} borderRadius="2xl">
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
          <Box bg="white" borderColor="gray.200" px={8} py={6} ml={12} mr={4}>
            <HStack spacing={3}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Spør om hva som helst"
                bg="gray.800"
                color="white"
                size="lg"
                h="56px"
                borderRadius="xl"
                border="none"
                fontSize="md"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ boxShadow: 'none' }}
                disabled={isLoading}
              />
              <Button
                aria-label="Send message"
                onClick={handleSendMessage}
                bg="green.800"
                _hover={{ bg: 'green.600' }}
                isLoading={isLoading}
                disabled={isLoading || !inputValue.trim()}
                borderRadius="xl"
                h="56px"
              >
                <ChakraImage src={sendIcon2} alt="Send" h="12px" objectFit="contain" filter="brightness(0) invert(1)" />
                <Text fontSize={getFontSize()} fontWeight="bold" color="white">Send</Text>
              </Button>
            </HStack>
          </Box>
        </Box>
      )}

      {(activeView === 'settings' || activeView === 'preferences') && (
        <SettingsSidebar 
          settings={botSettings}
          onSettingsChange={setBotSettings}
        />
      )}

      {activeView === 'accessibility' && (
        <AccessibilitySidebar 
          textSize={textSize}
          onTextSizeChange={setTextSize}
          isDarkMode={isDarkMode}
          onDarkModeChange={setIsDarkMode}
        />
      )}
    </Box>
  );
};

export default ChatScreen;