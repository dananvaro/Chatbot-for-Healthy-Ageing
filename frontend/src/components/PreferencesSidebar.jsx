import { useState } from 'react';
import { 
  Box, 
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  Grid,
  Button
} from '@chakra-ui/react';
import { RotateCcw } from 'lucide-react';
import { healthOptions } from "../data/onboardingSteps";
import { allergyOptions } from "../data/onboardingSteps";
import { foodPreferenceOptions } from "../data/onboardingSteps";

const PreferencesSidebar = ({ preferences, onPreferencesChange, onNavigateToChat }) => {

  const [selectedOptions, setSelectedOptions] = useState({
    healthConditions: preferences?.healthConditions || [],
    allergies: preferences?.allergies || [],
    foodPreferences: preferences?.foodPreferences || []
  });

  const [otherText, setOtherText] = useState({
    healthConditions: '',
    allergies: '',
    foodPreferences: ''
  });

  const toggleOption = (category, label) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: prev[category].includes(label)
        ? prev[category].filter(opt => opt !== label)
        : [...prev[category], label]
    }));
  };

  const isSelected = (category, label) => {
    return selectedOptions[category]?.includes(label) || false;
  };

  const handleOtherTextChange = (category, text) => {
    setOtherText(prev => ({
      ...prev,
      [category]: text
    }));
  };

  const handleSave = () => {
    // Combine selections with other text
    const combinedPreferences = {
      healthConditions: [
        ...selectedOptions.healthConditions,
        ...(otherText.healthConditions.trim() ? [otherText.healthConditions.trim()] : [])
      ],
      allergies: [
        ...selectedOptions.allergies,
        ...(otherText.allergies.trim() ? [otherText.allergies.trim()] : [])
      ],
      foodPreferences: [
        ...selectedOptions.foodPreferences,
        ...(otherText.foodPreferences.trim() ? [otherText.foodPreferences.trim()] : [])
      ]
    };

    console.log('Saving preferences:', combinedPreferences);
    onPreferencesChange?.(combinedPreferences);
    
    // Navigate back to chat after saving
    onNavigateToChat?.();
  };

  const handleReset = () => {
    setSelectedOptions({
      healthConditions: [],
      allergies: [],
      foodPreferences: []
    });
    setOtherText({
      healthConditions: '',
      allergies: '',
      foodPreferences: ''
    });
    onPreferencesChange?.({
      healthConditions: [],
      allergies: [],
      foodPreferences: []
    });
  };

  return (
    <Box 
      maxW="1200px" 
      flex="1" 
      display="flex" 
      flexDirection="column"
      bg="white" 
      borderRadius="xl" 
      boxShadow="sm" 
      overflow="hidden"
    >
      {/* Header */}
      <Box pt={8} px={12}>
        <Heading size="4xl" color="gray.800" fontWeight="bold">
          Tilpass Nutribot
        </Heading>
      </Box>

      {/* Scrollable Content */}
      <Box flex="1" overflowY="auto" px={12} py={6}>
        <VStack align="stretch" spacing={8}>
          {/* Health Conditions Section */}
          <Box>
            <Heading fontSize="xl" color="gray.800" fontWeight="bold" mb={2}>
              Helsetilstander
            </Heading>
            <Text fontSize="md" fontWeight="medium" color="gray.600" mb={4}>
              Har du noen helseutfordringer jeg bør vite om?
            </Text>

            <Grid templateColumns="repeat(8, 1fr)" gap={3}>
              {healthOptions.map((option) => (
                <Button
                  key={option.label}
                  onClick={() => toggleOption('healthConditions', option.label)}
                  bg={isSelected('healthConditions', option.label) ? 'green.800' : 'gray.100'}
                  border="1px solid"
                  borderColor="gray.800"
                  borderRadius="2xl"
                  _hover={{ bg: isSelected('healthConditions', option.label) ? 'green.700' : 'gray.200' }}
                  h="120px"
                  w="full"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  p={4}
                >
                  <Text fontSize="4xl" lineHeight="1">{option.emoji}</Text>
                  <Text 
                    fontSize="md" 
                    color={isSelected('healthConditions', option.label) ? 'white' : 'black'} 
                    fontWeight="semibold" 
                    textAlign="center"
                  >
                    {option.label}
                  </Text>
                </Button>
              ))}
            </Grid>

            <Box mt={4}>
              <Text fontWeight="bold" mb={2} fontSize="md">Andre helsetilstander</Text>
              <Input
                placeholder="Skriv inn andre helsetilstander her ..."
                value={otherText.healthConditions}
                onChange={(e) => handleOtherTextChange('healthConditions', e.target.value)}
                bg="white"
                borderColor='gray.800'
                borderRadius="xl"
                py={6}
                fontSize="md"
                _focus={{ borderColor: 'cyan.400', boxShadow: '0 0 0 2px var(--chakra-colors-cyan-400)' }}
              />
            </Box>
          </Box>

          {/* Allergies/Intolerances Section */}
          <Box mt={8} mb={8}>
            <Heading fontSize="xl" color="gray.800" fontWeight="bold" mb={2}>
              Allergier / intoleranser
            </Heading>
            <Text fontSize="md" fontWeight="medium" color="gray.600" mb={4}>
              Har du noen allergier, intoleranser eller matvarer du ønsker å unngå?
            </Text>

            <Grid templateColumns="repeat(8, 1fr)" gap={3}>
              {allergyOptions.map((option) => (
                <Button
                  key={option.label}
                  onClick={() => toggleOption('allergies', option.label)}
                  bg={isSelected('allergies', option.label) ? '#832527F1' : 'gray.100'}
                  border="1px solid"
                  borderColor="gray.800"
                  borderRadius="2xl"
                  _hover={{ bg: isSelected('allergies', option.label) ? 'red.700' : 'gray.200' }}
                  h="120px"
                  w="full"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  p={4}
                >
                  <Text fontSize="4xl" lineHeight="1">{option.emoji}</Text>
                  <Text 
                    fontSize="md" 
                    color={isSelected('allergies', option.label) ? 'white' : 'black'} 
                    fontWeight="semibold" 
                    textAlign="center"
                  >
                    {option.label}
                  </Text>
                </Button>
              ))}
            </Grid>

            <Box mt={4}>
              <Text fontWeight="bold" mb={2} fontSize="md">Andre allergier / intoleranser</Text>
              <Input
                placeholder="Skriv inn andre matvarer her ..."
                value={otherText.allergies}
                onChange={(e) => handleOtherTextChange('allergies', e.target.value)}
                bg="white"
                borderColor="gray.800"
                borderWidth={1}
                borderRadius="xl"
                py={6}
                fontSize="md"
                _focus={{ borderColor: 'cyan.400', boxShadow: '0 0 0 2px var(--chakra-colors-cyan-400)' }}
              />
            </Box>
          </Box>

          {/* Food Preferences Section */}
          <Box pb={4}>
            <Heading fontSize="xl" color="gray.800" fontWeight="bold" mb={2}>
              Kosthold
            </Heading>
            <Text fontSize="md" fontWeight="medium" color="gray.600" mb={4}>
              Har du noen matvarepreferanser jeg bør vite om?
            </Text>

            <Grid templateColumns="repeat(8, 1fr)" gap={3}>
              {foodPreferenceOptions.map((option) => (
                <Button
                  key={option.label}
                  onClick={() => toggleOption('foodPreferences', option.label)}
                  bg={isSelected('foodPreferences', option.label) ? 'green.800' : 'gray.100'}
                  border="1px solid"
                  borderColor="gray.800"
                  borderRadius="2xl"
                  _hover={{ bg: isSelected('foodPreferences', option.label) ? 'green.700' : 'gray.200' }}
                  h="120px"
                  w="full"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  p={4}
                >
                  <Text fontSize="4xl" lineHeight="1">{option.emoji}</Text>
                  <Text 
                    fontSize="md" 
                    color={isSelected('foodPreferences', option.label) ? 'white' : 'black'} 
                    fontWeight="semibold" 
                    textAlign="center"
                  >
                    {option.label}
                  </Text>
                </Button>
              ))}
            </Grid>

            <Box mt={4}>
              <Text fontWeight="bold" mb={2} fontSize="md">Andre matvarepreferanser</Text>
              <Input
                placeholder="Skriv inn andre preferanser her ..."
                value={otherText.foodPreferences}
                onChange={(e) => handleOtherTextChange('foodPreferences', e.target.value)}
                bg="white"
                borderColor="gray.800"
                borderWidth={1}
                borderRadius="xl"
                py={6}
                fontSize="md"
                _focus={{ borderColor: 'cyan.400', boxShadow: '0 0 0 2px var(--chakra-colors-cyan-400)' }}
              />
            </Box>
          </Box>
        </VStack>
      </Box>

      {/* Fixed Bottom Actions */}
      <Box px={12} py={6} borderTop="1px solid" borderColor="gray.200">
        <HStack justify="space-between">
          <Button
            onClick={handleReset}
            bg="white"
            color="gray.800"
            border="1px solid"
            borderColor="gray.800"
            borderRadius="xl"
            _hover={{ bg: 'gray.100' }}
            fontSize="md"
            fontWeight="bold"
            px={6}
            py={6}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <RotateCcw size={16} />
            Nullstill preferanser
          </Button>

          <Button
            onClick={handleSave}
            bg="green.800"
            color="white"
            _hover={{ bg: 'green.700' }}
            borderRadius="xl"
            fontSize="md"
            fontWeight="bold"
            px={12}
            py={6}
            mr={4}
          >
            Lagre endringer
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default PreferencesSidebar;