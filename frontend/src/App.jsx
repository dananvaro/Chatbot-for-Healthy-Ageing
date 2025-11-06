import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import OnboardingCard from './components/OnboardingCard';
import ChatScreen from './components/ChatScreen';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingData, setOnboardingData] = useState(null);

  const handleOnboardingComplete = (data) => {
    setOnboardingData(data);
    setShowOnboarding(false);
  };

  return (
    <Box 
      minH="100vh" 
      bg="gray.300" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      p={4}
    >
      {showOnboarding ? (
        <OnboardingCard onComplete={handleOnboardingComplete} />
      ) : (
        <ChatScreen onboardingData={onboardingData} />
      )}
    </Box>
  );
}

export default App;