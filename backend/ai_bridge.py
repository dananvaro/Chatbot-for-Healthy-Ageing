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

# BaseModel checks for correct input
class ChatRequest(BaseModel):
    input: str
    threadID: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    threadID: str

## testing the azure api


"""


"""
# Api that only takes in values similar to chatresponse
@app.post("/chat",response_model=ChatResponse)
def getChat(request : ChatRequest): 

    # Checks if thread exists if not creates a new one
    if request.threadID == None:
        
        thread =project.agents.threads.create()
        threadID = thread.id
    else:
        threadID = request.threadID


    # Adds the message to a newly created thread or continued on existing thread
    project.agents.messages.create(
        thread_id = threadID,
        role="user",
        content = request.input
    )

    # Does a request and wait till it gets a response
    project.agents.runs.create_and_process(
        thread_id= threadID,
        agent_id= azureAgent
    )

    # A list of messages in the thread
    messages = list(project.agents.messages.list(
        thread_id=threadID,
        order=ListSortOrder.DESCENDING

    ))

    

    assistantOutput= "No message"

    assistantOutput = messages[0].content[0].text.value

    return ChatResponse(response=assistantOutput,threadID=threadID)