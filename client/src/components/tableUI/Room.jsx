import { useParams } from "react-router";
import Table from "./Table";

export default function Room() {
  let { roomId } = useParams();
  console.log("ROOM ID", roomId);
  return (
    <main className="w-full min-h-screen flex flex-col justify-center bg-slate-400 border ">
      <section className="flex flex-col justify-center  items-center gap-2 w-full h-[70vh] bg-blue-700">
        {/* top */}
        <div className="flex gap-10 h-1/3  w-1/2 items-center justify-center">
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
        </div>
        {/* mid */}
        <div className="flex gap-5 w-full h-1/3  justify-center  text-center px-4">
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
          <Table />
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
        </div>
        {/* btm */}
        <div className="flex gap-10 h-1/3 w-1/2 items-center justify-center">
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
        </div>
      </section>
    </main>
  );
}
