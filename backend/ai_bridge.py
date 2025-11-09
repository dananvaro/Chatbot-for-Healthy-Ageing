from typing import Optional
from dotenv import load_dotenv
import os

from fastapi import FastAPI
from pydantic import BaseModel

from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import ListSortOrder


#Loads API keys and agent id
load_dotenv()

# Creates and api from the fastapi library
app = FastAPI()

# Endpoints and agents
azureEndpoint = os.getenv("azureEndpoint")
azureAgent = os.getenv("getAgent")

# Creates a AI Client
project = AIProjectClient(
    credential= DefaultAzureCredential(),
    endpoint=azureEndpoint
)

class ChatRequest(BaseModel):
    input: str
    threadID: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    threadID: str

## testing the azure api


"""


"""

app.post("/chat",response_model=ChatResponse)
def getChat(request : ChatRequest): 

    # Checks if thread exists if not creates a new one
    if request.threadID == None:
        
        thread =project.agents.threads.create()
        threadID = thread.id()
    else:
        threadID = request.threadID

    project.agents.threads