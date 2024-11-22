<h1 align="center"><b>Mini Project 4</b></h1>
<h4 align="center">Designing a Human-Centered AI Web Interface to Support People with Disabilities</h4>
> By Ryan Quinn

---

### Installation
- For dependencies for both frontend and server directory, run `npm i`
- For server specifically, run `npm install -g nodemon`
- Create a file called `api_key.txt` within the server root directory and paste your OpenAI API key in.

---

### Run Application
- For server, within the root directory of the server, run `nodemon index.js`
- For frontend, within the root directory of the frontend, run `npm run dev`

---

### Functionality

#### Key Features
1. **Text Highlighting and AI Commands**:
   - Highlight any text to access AI-powered commands, including:
     - **Simplify**: Breaks down complex text into simpler terms.
     - **Explain**: Provides explanations of highlighted text.
     - **Define**: Gives definitions for selected terms or phrases.
     - **Rewrite**: Replaces the highlighted text with a rewritten version.

2. **AI Request Parameters**:
   - Optional parameters such as harmful request context, vocabulary level, and style can be set for API requests to customize responses.

3. **Customization Options**:
   - **Themes**: WCAG-compliant themes allow users to adjust text and background colors.
   - **Font Styles**: Select from sans serif, monospaced, and other accessible fonts.
   - **Font Size**: Customize font sizes for readability.

4. **Local Storage**:
   - Themes, written text, and settings are saved in local storage for a seamless experience across sessions.

5. **Response Display**:
   - Responses from AI appear in a modal for commands like simplify, define, and explain.
   - Rewritten text directly replaces the selected content.

---

### How It Works
- **Frontend**:
  - The frontend contains a `backend-service.ts` file responsible for creating and sending requests to the backend.
  - Users interact with a simple and intuitive interface for highlighting text and customizing their environment.

- **Backend**:
  - The backend picks up the requests, processes them, and communicates with the OpenAI API.
  - Requests include optional parameters for harmful context, vocabulary level, and style to tailor the AI output.

- **Modal and Rewrite Features**:
  - Responses to simplify, define, and explain are shown in modals.
  - Rewrite responses replace the highlighted text directly.

---

### Bug Fixes and Iterations
Below is a list of completed iterations and resolved bugs:

#### Iterations:
1. **Added AI Popup Window with Options**:
   - ~~AI popup not aligning with highlighted text.~~
   - ~~AI popup misaligned when scrolling.~~
   - ~~Popup cut off when too far to the right; made it dynamic.~~

2. **Added Backend and Frontend Support for AI Commands**:
   - ~~Issue with sending style parameters in API requests.~~

3. **Added Modal for AI Responses**:
   - ~~Modal not displaying correctly (z-index issue).~~

4. **Added Theme Options and Preset Storage**:
   - ~~Certain colors not loading correctly.~~
   - ~~Ensured colors are WCAG-compliant.~~
   - ~~Added secondary and accent color options.~~

5. **Added Rewrite Support**:
   - ~~Text deselecting when selecting with a keyboard.~~
   - ~~Default tab functionality not working for popup options.~~

6. **Added Font and Theme Adjustments**:
   - Support for font size and style adjustments.

7. **Other Features**:
   - Added disclaimer for AI responses.
   - Text saved to local storage for persistence.

#### Active Bugs:
- AI-replaced text cannot currently be undone.

---

### Technologies Used
- **Frontend**: React
- **Backend**: Node.js, OpenAI API

---

### Notes
- Ensure your OpenAI API key is valid and stored in `api_key.txt`.
- An active internet connection is required for API interactions.

