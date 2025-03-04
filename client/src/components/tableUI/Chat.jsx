export default function Chat() {
  return (
    <div className="w-1/2 h-full text-xs">
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full "
      />
      <div className="chat chat-start">
        <div className="chat-bubble">
          Are you playing poker again?
          <br />
          You know Im gonna win this one
        </div>
      </div>
      <div className="chat chat-end"></div>
    </div>
  );
}
