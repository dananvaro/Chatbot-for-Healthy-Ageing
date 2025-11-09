from dotenv import load_dotenv
import os
from fastapi import FastAPI

load_dotenv()

app = FastAPI()

azureEndpoint = os.getenv("azureEndpoint")

agent = os.getenv("getAgent")

