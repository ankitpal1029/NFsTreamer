import "./message.css";

const Message = ({
  message,
  name,
}: {
  message: { user: string; text: string };
  name: string;
}) => {
  //const [isSentByCurrentUser, setIsSentByCurrentUser] = useState(false);
  let isSentByCurrentUser = false;
  let { user, text } = message;
  if (user === name) {
    //setIsSentByCurrentUser(true);
    isSentByCurrentUser = true;
  }
  return isSentByCurrentUser ? (
    <div className="messageContainer justify-end">
      <p className="sentText pr-10">{name}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{text}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justify-start">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{text}</p>
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  );
};

export default Message;
