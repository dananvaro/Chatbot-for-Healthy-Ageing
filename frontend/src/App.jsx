import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import OnboardingCard from './components/OnboardingCard'
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
    <Box 
      minH="100vh" 
      bg="gray.200" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      p={4}
    >
      {showOnboarding ? (
        <OnboardingCard onComplete={handleOnboardingComplete} />
      ) : (
        <Box 
          maxW="960px" 
          margin="40px auto"
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="md"
        >
          <h1>NutriBot.</h1>
          <p>Onboarding complete! Ready to add chat components.</p>
          {userPreferences && (
            <pre style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
              {JSON.stringify(userPreferences, null, 2)}
            </pre>
          )}
        </Box>
      )}
    </Box>
  );
}