"use client"

import { Box, Switch, Text } from "@chakra-ui/react"

export const InformativeToggleSwitch = ({ isActive, onClick, label }) => {
  return (
    <Switch.Root 
      checked={isActive}
      onCheckedChange={(details) => onClick(details.checked)}
      colorPalette={isActive ? "green" : "gray"}
      size="lg"
    >
      <Switch.HiddenInput />
      <Switch.Control
        bg={isActive ? 'green.800' : 'gray.800'}
        borderRadius="full"
        w="56px"
        h="28px"
        position="relative"
        cursor="pointer"
        transition="all 0.3s"
        _hover={{ opacity: 0.8 }}
        display="flex"
        alignItems="center"
        
      >
        <Switch.Thumb
          bg="white"
          borderRadius="full"
          w="28px"
          h="28px"
          ml={isActive ? "4px" : "0px"}
          transition="all 0.3s"
        />
        <Box
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          left={isActive ? "8px" : "auto"}
          right={isActive ? "auto" : "8px"}
          pointerEvents="none"
          zIndex={1}
          transition="all 0.3s"
        >
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="white"
            userSelect="none"
          >
            {label}
          </Text>
        </Box>
      </Switch.Control>
    </Switch.Root>
  );
};