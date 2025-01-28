import { useParams } from "react-router";
import Table from "./Table";
import Seat from "./Seat";

export default function Room() {
  let { roomId } = useParams();
  console.log("ROOM ID", roomId);
  return (
    <main className="w-full min-h-screen flex flex-col justify-center bg-slate-200  ">
      <section className="flex flex-col justify-center  items-center gap-2 w-full h-[70vh] bg-blue-700">
        {/* top */}
        <div className="flex gap-10 h-1/3  w-1/2 items-center justify-center">
          <Seat />
          <Seat />
        </div>
        {/* mid */}
        <div className="flex gap-5 w-full h-1/3  justify-center  text-center px-4">
          <Seat />
          <Table />
          <Seat />
        </div>
        {/* btm */}
        <div className="flex gap-10 h-1/3 w-1/2 items-center justify-center">
          <Seat />
          <Seat />
        </div>
      </section>
      <section>
        <div className="flex justify-between">
          <p className="bg-green-200 w-1/2">BetBox</p>
          <p className="bg-green-500 w-1/2">chatbox</p>
        </div>
      </section>
    </main>
  );
}
