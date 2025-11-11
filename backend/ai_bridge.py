from typing import Optional, Dict
from dotenv import load_dotenv
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import ListSortOrder


#Loads API keys and agent id
load_dotenv()

# Creates and api from the fastapi library
app = FastAPI()

# Add CORS middleware - Add this section
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Vite dev server ports
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Endpoints and agents
azureEndpoint = os.getenv("azureEndpoint")
azureAgent = os.getenv("getAgent")

# Creates a AI Client
project = AIProjectClient(
    credential= DefaultAzureCredential(),
    endpoint=azureEndpoint
)

# In-memory storage for user preferences (use database in production)
user_preferences_store: Dict[str, dict] = {}

# BaseModel checks for correct input
class ChatRequest(BaseModel):
    input: str
    threadID: Optional[str] = None
    systemPrompt: Optional[str] = None  
    settings: Optional[dict] = None  
    onboardingData: Optional[dict] = None  

class ChatResponse(BaseModel):
    response: str
    threadID: str

class PreferencesRequest(BaseModel):
    threadID: str
    settings: dict
    onboardingData: Optional[dict] = None

class PreferencesResponse(BaseModel):
    success: bool
    message: str

def build_system_prompt(settings: dict, onboarding_data: dict = None) -> str:
    """Build system prompt from user preferences"""
    prompt = "Du er NutriBot, en hjelpsom ernæringsassistent for eldre."
    
    # Add onboarding data
    if onboarding_data:
        if onboarding_data.get('2') and len(onboarding_data['2']) > 0:
            allergies = ', '.join(onboarding_data['2'])
            prompt += f"\n\nBrukeren har følgende allergier eller kostpreferanser: {allergies}."
            prompt += " Ta hensyn til dette i alle anbefalinger."
        
        if onboarding_data.get('3') and len(onboarding_data['3']) > 0:
            conditions = ', '.join(onboarding_data['3'])
            prompt += f"\n\nBrukeren har følgende helseutfordringer: {conditions}."
            prompt += " Tilpass kostholdsrådene til disse tilstandene."
    
    # Add settings
    if settings.get('simplerLanguage'):
        prompt += "\n\nBruk enkelt språk og korte setninger. Unngå fagtermer."
    
    if settings.get('shortAnswers'):
        prompt += "\n\nHold svarene korte og konsise, maksimum 3-4 setninger."
    
    if settings.get('showSources'):
        prompt += "\n\nInkluder alltid kilder til informasjonen."
    
    # Language
    language_instructions = {
        'no': "\n\nSvar på norsk.",
        'en': "\n\nAnswer in English.",
        'sv': "\n\nSvara på svenska.",
        'da': "\n\nSvar på dansk."
    }
    prompt += language_instructions.get(settings.get('language', 'no'), "\n\nSvar på norsk.")
    
    return prompt

# Api that only takes in values similar to chatresponse
@app.post("/chat", response_model=ChatResponse)
def getChat(request: ChatRequest): 
    # Create or get thread
    if request.threadID is None:
        thread = project.agents.threads.create()
        threadID = thread.id
        
        # Store initial preferences if provided
        if request.settings or request.onboardingData:
            user_preferences_store[threadID] = {
                'settings': request.settings or {},
                'onboardingData': request.onboardingData or {}
            }
    else:
        threadID = request.threadID
        
        # Update preferences if provided
        if request.settings or request.onboardingData:
            if threadID not in user_preferences_store:
                user_preferences_store[threadID] = {}
            
            if request.settings:
                user_preferences_store[threadID]['settings'] = request.settings
            if request.onboardingData:
                user_preferences_store[threadID]['onboardingData'] = request.onboardingData

    # Get stored preferences or use request preferences
    stored_prefs = user_preferences_store.get(threadID, {})
    settings = request.settings or stored_prefs.get('settings', {})
    onboarding_data = request.onboardingData or stored_prefs.get('onboardingData', {})
    
    # Build system prompt from preferences
    system_prompt = build_system_prompt(settings, onboarding_data)
    
    print(f"Thread ID: {threadID}")
    print(f"System Prompt: {system_prompt}")

    # WORKAROUND: Add system context as part of the user message
    # This ensures the agent considers the preferences
    user_message_with_context = request.input
    
    # Only add context for the first message in a thread
    messages_in_thread = list(project.agents.messages.list(
        thread_id=threadID,
        order=ListSortOrder.DESCENDING
    ))
    
    if len(messages_in_thread) == 0:
        # First message - include full context
        user_message_with_context = f"""VIKTIG KONTEKST (dette gjelder for hele samtalen):
{system_prompt}

Brukerens spørsmål: {request.input}"""
    
    # Add user message with context
    project.agents.messages.create(
        thread_id=threadID,
        role="user",
        content=user_message_with_context
    )

    # Process and get response
    project.agents.runs.create_and_process(
        thread_id=threadID,
        agent_id=azureAgent
    )

    # Get the latest messages
    messages = list(project.agents.messages.list(
        thread_id=threadID,
        order=ListSortOrder.DESCENDING
    ))

    assistantOutput = "No message"
    if messages and len(messages) > 0:
        assistantOutput = messages[0].content[0].text.value

    return ChatResponse(response=assistantOutput, threadID=threadID)

@app.post("/preferences", response_model=PreferencesResponse)
def update_preferences(request: PreferencesRequest):
    """Update user preferences for a thread"""
    user_preferences_store[request.threadID] = {
        'settings': request.settings,
        'onboardingData': request.onboardingData or {}
    }
    
    return PreferencesResponse(
        success=True,
        message="Preferences updated successfully"
    )

@app.get("/preferences/{threadID}")
def get_preferences(threadID: str):
    """Get stored preferences for a thread"""
    return user_preferences_store.get(threadID, {
        'settings': {
            'simplerLanguage': False,
            'shortAnswers': False,
            'showSources': False,
            'language': 'no'
        },
        'onboardingData': {}
    })

# Add health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}