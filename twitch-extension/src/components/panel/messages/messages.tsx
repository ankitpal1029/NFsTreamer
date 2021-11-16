import Message from "./message/message";
import "./messages.css";

interface IMessageFormat {
  user: string;
  text: string;
}

const Messages = ({
  messages,
  name,
}: //name,
{
  messages: IMessageFormat[];
  name: string;
}) => {
  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          <Message message={msg} name={name} />
        </div>
      ))}
    </div>
  );
};

export default Messages;
