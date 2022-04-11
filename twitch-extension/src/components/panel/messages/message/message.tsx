import "./message.css";

const Message = ({
  message,
  name,
}: {
  message: { user: string; text: string; type: string };
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
        {/*{text.split("//")[0] === "ipfs:" ? (*/}
        {message.type === "emote" ? (
          <div className="bg-black border rounded-xl overflow-hidden ">
            <img
              src={`https://ipfs.infura.io/ipfs/${text.split("//")[1]}`}
              alt="couldn't load ..."
              className="rounded"
            />
          </div>
        ) : (
          <p className="messageText colorDark">{text}</p>
        )}
      </div>
    </div>
  ) : (
    <div className="messageContainer justify-start">
      <div className="messageBox backgroundLight">
        {/*{text.split("//")[0] === "ipfs:" ? (*/}
        {message.type === "emote" ? (
          <div className="bg-black border rounded-xl overflow-hidden ">
            <img
              src={`https://ipfs.infura.io/ipfs/${text.split("//")[1]}`}
              alt="couldn't load ..."
              className="rounded"
            />
          </div>
        ) : (
          <p className="messageText colorDark">{text}</p>
        )}
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  );
};

export default Message;
