from typing import Optional
from dotenv import load_dotenv
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Add this import
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

# Api that only takes in values similar to chatresponse
@app.post("/chat", response_model=ChatResponse)
def getChat(request: ChatRequest): 

    # Checks if thread exists if not creates a new one
    if request.threadID == None:
        thread = project.agents.threads.create()
        threadID = thread.id
    else:
        threadID = request.threadID


    # If system prompt is provided, you might want to add it as context
    # This depends on how Azure AI Foundry handles system messages
    
    # Adds the message to thread
    project.agents.messages.create(
        thread_id=threadID,
        role="user",
        content = request.input
    )

    # Does a request and wait till it gets a response
    project.agents.runs.create_and_process(
        thread_id=threadID,
        agent_id=azureAgent
    )

    # A list of messages in the thread
    messages = list(project.agents.messages.list(
        thread_id=threadID,
        order=ListSortOrder.DESCENDING
    ))

    assistantOutput = "No message"
    if messages and len(messages) > 0:
        assistantOutput = messages[0].content[0].text.value

    return ChatResponse(response=assistantOutput, threadID=threadID)

# Add health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}