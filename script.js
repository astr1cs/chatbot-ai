const chatInput = document.querySelector(".chat-input textarea");
const sendBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
let userMessage;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : ` <span class="material-symbols-outlined"> smart_toy </span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};
let API_KEY = "AIzaSyDd1AV-fOsciZF5VxlgDCV6B33MRSQKJ48";

const generateResponse = (incomingChatLi) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  const messageElement = incomingChatLi.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
      } else {
        console.error("Error in API response:", data);
        messageElement.textContent = "API Error. Please try again.";
      }
    })
    .catch((error) => {
      console.log("ERROR", error);
      messageElement.textContent =
        "Oops! Something went wrong. Please try again";
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
  }, 600);
};

sendBtn.addEventListener("click", handleChat);