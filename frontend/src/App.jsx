import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import OnboardingCard from './components/OnboardingCard'
import ChatScreen from './components/ChatScreen'
import './App.css'

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);

  const handleOnboardingComplete = (preferences) => {
    setUserPreferences(preferences);
    setShowOnboarding(false);
    console.log('User preferences:', preferences);
  };

  return (
    <>
      {showOnboarding ? (
        <Box 
          minH="100vh" 
          bg="gray.200" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          p={4}
        >
          <OnboardingCard onComplete={handleOnboardingComplete} />
        </Box>
      ) : (
        <ChatScreen userPreferences={userPreferences} />
      )}
    </>
  );
}