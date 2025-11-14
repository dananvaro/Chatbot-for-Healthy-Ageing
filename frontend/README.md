## Prerequisites 📋

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** - Package manager (comes with Node.js)

## Installation & Setup 🚀

### 1. Clone the Repository

```bash
git clone https://github.com/dananvaro/Chatbot-for-Healthy-Ageing.git
cd Chatbot-for-Healthy-Ageing/frontend
```


### 2. Install Dependencies

Using npm:
```bash
npm install
```


### 3. Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000


### 4. Start the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (default Vite port).


### 5. Verify Backend Connection

Make sure the backend server is running at `http://localhost:8000`. The frontend will automatically check backend health on startup.

If the backend is not available, the app will use mock responses for testing purposes.
