# Azure OpenAI API

## Log in
```bash
  pip install openai azure-ai-projects azure-identity "fastapi[standard]" python-dotenv uvicorn
```

## Setup and Installation

Clone the project

```bash
  git clone https://github.com/dananvaro/Chatbot-for-Healthy-Ageing.git
```

Go to the project directory

```bash
  cd backend
```
Install Python libraries

```bash
  pip install openai azure-ai-projects azure-identity "fastapi[standard]" python-dotenv uvicorn
```
Login into AI Foundry
```bash
  az login
```
Pick the correct subscription 

Start the server

```bash
  python -m uvicorn ai_bridge:app --reload
```


## Local test

Send this command to http://127.0.0.1:8000/chat
```json
{
  "input": "Hva heter jeg?",
  "threadID": null
}
```

