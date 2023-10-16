import { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  async function getMessages() {
    try {
      const response = await fetch("http://localhost:8000/completions", {
        method: "POST",
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setMessage(data.choices[0].message) && setValue("");
    } catch (error) {
      console.error(error);
    }
  }

  function createNewChat() {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  function handleClick(uniqueTitle) {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }

  useEffect(() => {
    if (!currentTitle && value && message) setCurrentTitle(value);
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Severyn</p>
        </nav>
      </section>
      <section className="main">
        {(!currentTitle && <h1>SeverynGPT</h1>) || <h1>{currentTitle}</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              {...{ value }}
              onChange={(e) => void setValue(e.target.value)}
            />
            <div id="submit" onClick={getMessages}>
              {"\u27a2"}
            </div>
          </div>
          <p className="info">
            Aliquip culpa velit culpa nisi ipsum dolor elit eiusmod non culpa.
            Minim consequat nostrud duis est exercitation exercitation amet.
            Occaecat nulla aliquip ea mollit nulla in reprehenderit.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
