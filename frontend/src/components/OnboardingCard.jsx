import { useState } from 'react';
import { 
  Box, 
  Button, 
  Text, 
  Heading, 
  Input, 
  Grid,
  VStack,
  HStack,
  Image as ChakraImage
} from '@chakra-ui/react';
import { Play } from 'lucide-react';
import personImage from '../assets/person.png';
import sendIcon from '../assets/send-icon.png'; // Add your image filename
import messageIcon from '../assets/message-icon.png'; // Add your image filename
import Logo from './Logo';


// Onboarding data structure
const onboardingSteps = [
  {
    id: 0,
    type: 'welcome',
    title: 'Velkommen til Nutribot! 👋',
    subtitle: 'Din personlige ernæringsassistent 🥗',
    description: 'Jeg vil gjerne bli kjent med deg, slik at jeg kan gi deg råd som passer for deg.'
  },
  {
    id: 1,
    type: 'chat-intro',
    title: 'Det er enkelt å snakke med meg!',
    content: [
      { icon: 'send', text: 'Skriv inn et spørsmål om kosthold, ernæring eller matvaner.' },
      { icon: 'message', text: 'NutriBot gir deg svar med det du lurer på!' }
    ]
  },
  {
    id: 2,
    type: 'selection',
    title: 'Allergier',
    subtitle: 'Har du noen allergier eller matvarer du vil unngå?',
    options: [
      { emoji: '🌾', label: 'Glutenfri' },
      { emoji: '🥛', label: 'Laktosefri' },
      { emoji: '🥜', label: 'Nøtter' },
      { emoji: '🦞', label: 'Skalldyr' },
      { emoji: '🌱', label: 'Vegetar' },
      { emoji: '🥬', label: 'Vegansk' },
      { emoji: '🕌', label: 'Halal' },
      { emoji: '✡️', label: 'Kosher' }
    ],
    hasOther: true
  },
 {
    id: 3,
    type: 'selection',
    title: 'Helsetilstander',
    subtitle: 'Har du noen helseutfordringer jeg bør vite om?',
    options: [
      { emoji: '🧬', label: 'Diabetes' },
      { emoji: '❤️', label: 'Kolestrol' },
      { emoji: '🩸', label: 'Blodtrykk' },
      { emoji: '⚖️', label: 'Overvekt' },
      { emoji: '🥱', label: 'Lav energi' },
      { emoji: '🍽️', label: 'Fordøyelse' },
      { emoji: '🦴', label: 'Osteoporose' },
      { emoji: '💊', label: 'Medisiner' }
    ],
    hasOther: true
  },
  {
    id: 4,
    type: 'final-welcome',
    title: 'Det var alt!',
    subtitle: 'Flott! Nå vet jeg litt mer om deg, slik at jeg kan gi deg personlige og trygge kostholdsråd.',
    buttons: [
      { text: '✍️ Gå tilbake', variant: 'outline' },
      { text: 'Start samtale 💬', variant: 'solid' }
    ]
  },
];

const OnboardingCard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherText, setOtherText] = useState('');

  const step = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete onboarding
      onComplete?.(selectedOptions);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleOption = (label) => {
    setSelectedOptions(prev => ({
      ...prev,
      [step.id]: prev[step.id]?.includes(label)
        ? prev[step.id].filter(opt => opt !== label)
        : [...(prev[step.id] || []), label]
    }));
  };

  const isSelected = (label) => {
    return selectedOptions[step.id]?.includes(label) || false;
  };

  return (
    <Box
      maxW="680px"
      w="full"
      minH="600px"
      h="600px"
      bg="white"
      borderRadius="xl"
      boxShadow="2xl"
      p={8}
      position="relative"
      display="flex"
      flexDirection="column"
    >
      {/* Logo - fixed on all steps except first */}
      {currentStep !== 0 && <Logo size="lg" position="fixed" />}

      {/* Close button */}
      <Button
        position="absolute"
        top={4}
        right={4}
        size="sm"
        bg="gray.800"
        color="white"
        _hover={{ bg: 'gray.600' }}
        borderRadius="md"
        fontSize="large"
        fontWeight="semibold"
      >
        Lukk vindu ✕
      </Button>

      {/* Scrollable content area */}
      <Box flex="1" overflow="auto" mb={16}>
        {/* Content based on step type */}
        {step.type === 'welcome' && (
          <VStack spacing={6} align="stretch" h="full" justify="center">
            <Box textAlign="center" ml={36} mr={36}>
              <Logo size="lg" />
              <Heading size="5xl" mb={4} fontWeight={"bold"}>{step.title}</Heading>
              <Text fontSize="lg" color="black" fontWeight={"bold"}>{step.subtitle}</Text>
              <Text fontSize="lg" color="black" mt={4} fontWeight={"medium"}>{step.description}</Text>
            </Box>
          </VStack>
        )}

        {step.type === 'selection' && (
          <VStack align="stretch" spacing={4} mt={2} ml={16} mr={16}>
            <Box textAlign="center">
              <Heading size="5xl" color="gray.800" fontWeight="bold" mt={2}>{step.title}</Heading>
              <Text fontSize="lg" fontWeight="medium" color="gray.800">{step.subtitle}</Text>
            </Box>

            <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={4}>
              {step.options.map((option) => (
                <Button
                  key={option.label}
                  onClick={() => toggleOption(option.label)}
                  bg={isSelected(option.label) ? 'green.200' : 'gray.200'}
                  border="2px solid"
                  borderColor={isSelected(option.label) ? 'green.700' : 'transparent'}
                  borderRadius={24}
                  _hover={{ bg: isSelected(option.label) ? 'green.300' : 'gray.300' }}
                  h="120px"
                  w="full"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  p={4}
                >
                  <Text fontSize="5xl" lineHeight="1">{option.emoji}</Text>
                  <Text fontSize="lg" color="gray.800" fontWeight="medium" textAlign="center">
                    {option.label}
                  </Text>
                </Button>
              ))}
            </Grid>

            {step.hasOther && (
              <Box >
                <Text fontWeight="bold" mb={2}>Annet</Text>
                <Input
                  placeholder="Skriv inn andre preferanser her ..."
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  bg="gray.200"
                  borderColor="gray.400"
                  borderRadius={12}
                  pt={6}
                  pb={6}                  
                  fontSize="lg"
                  _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                />
              </Box>
            )}
          </VStack>
        )}

        {step.type === 'chat-intro' && (
          <VStack align="stretch" ml={12} mr={12} >
            <Heading color="gray.800" size="5xl" textAlign="center" fontWeight="bold" mt={12}>{step.title}</Heading>

            <HStack align="center" spacing={6}>
              <Box flex="1">
                <Box
                  w="100%"
                  h="100%"
                  bg="gray.100"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <ChakraImage src={personImage} alt="Person illustration" />
                </Box>
              </Box>
              
              <VStack flex="1" spacing={8} align="stretch">
                {step.content.map((item, idx) => (
                  <HStack key={idx} align="flex-start" spacing={3}>
                    <ChakraImage 
                      src={item.icon === 'send' ? sendIcon : messageIcon} 
                      alt={item.icon} 
                      boxSize="20px"
                      mt={4}
                    />
                    <Text fontSize="xl" mt={2}>{item.text}</Text>
                  </HStack>
                ))}
              </VStack>
            </HStack>
          </VStack>
        )}

        {step.type === 'final-welcome' && (
          <VStack spacing={8} align="center" textAlign="center" h="full" justify="center">
            <Box ml={24} mr={24}>
              <Heading size="5xl" color="gray.800" fontWeight="bold" mb={2}>
                {step.title}
              </Heading>
              <Text fontSize="xl" color="gray.800" fontWeight="medium" mb={8}>
                {step.subtitle}
              </Text>
              
              <HStack spacing={4} justify="center" mt={8}>
                <Button
                  bg="gray.800"
                  color="white"
                  _hover={{ bg: 'gray.700' }}
                  onClick={handlePrevious}
                  fontSize="lg"
                  fontWeight="bold"
                  pt={6}
                  pb={6}
                  px={6}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text as="span">✏️</Text>
                  Gå tilbake
                </Button>
                
                <Button
                  bg="green.800"
                  color="white"
                  _hover={{ bg: 'green.600' }}
                  onClick={handleNext}
                  fontSize="lg"
                  fontWeight="bold"
                  pt={6}
                  pb={6}
                  px={6}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  Start samtale
                  <Text as="span">💬</Text>
                </Button>
              </HStack>
            </Box>
          </VStack>
        )}
      </Box>

      {/* Fixed bottom navigation */}
      <Box
        position="absolute"
        bottom={4}
        left={4}
        right={4}
      >
        <HStack justify="space-between" align="center">
          {/* Left button or empty space */}
          <Box flex="1">
            {currentStep > 0 && currentStep < onboardingSteps.length - 1 ? (
              <Button
                bg="gray.800"
                color="white"
                _hover={{ bg: 'gray.700' }}
                onClick={handlePrevious}
                fontSize="lg"
                fontWeight="bold"
                pt={6}
                pb={6}
                minW="160px"
                position="relative"
                justifyContent="center"
              >
                <Box 
                  as="span" 
                  position="absolute" 
                  left={4}
                  display="inline-flex" 
                  alignItems="center"
                >
                  <Play size={16} fill="white" strokeWidth={0} style={{ transform: 'rotate(180deg)' }} />
                </Box>
                Forrige
              </Button>
            ) : (
              <Box minW="120px" /> 
            )}
          </Box>
          
          {/* Progress dots in center */}
          <HStack spacing={2}>
            {onboardingSteps.map((_, idx) => (
              <Box
                key={idx}
                w={3}
                h={3}
                borderRadius="full"
                bg={idx === currentStep ? 'green.700' : 'gray.300'}
              />
            ))}
          </HStack>
          
          {/* Right button */}
          <Box flex="1" display="flex" justifyContent="flex-end">
            {currentStep < onboardingSteps.length - 1 ? (
              <Button
                bg="green.800"
                color="white"
                _hover={{ bg: 'green.600' }}
                onClick={handleNext}
                pt={6}
                pb={6}
                borderRadius="md"
                fontSize="lg"
                fontWeight="bold"
                minW="160px"
                position="relative"
                justifyContent={currentStep === 0 ? 'flex-start' : 'center'}
                pl={currentStep === 0 ? 4 : undefined}
              >
                {currentStep === 0 ? 'Kom i gang' : 'Neste'}
                <Box 
                  as="span" 
                  position="absolute" 
                  right={4}
                  display="inline-flex" 
                  alignItems="center"
                >
                  <Play size={16} fill="white" strokeWidth={0} />
                </Box>
              </Button>
            ) : (
              <Box minW="120px" />
            )}
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default OnboardingCard;