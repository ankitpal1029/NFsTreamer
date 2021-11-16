import React from "react";
import "./input.css";

const Input = ({
  message,
  setMessage,
  sendMessage,
}: {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (event: any) => void;
}) => {
  return (
    <form className="form">
      <input
        className="input text-black"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={(event) =>
          event.key === "Enter" ? sendMessage(event) : null
        }
      />
      <button className="sendButton" onClick={(event) => sendMessage(event)}>
        Send
      </button>
    </form>
  );
};

export default Input;
