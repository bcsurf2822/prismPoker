import { useParams } from "react-router";

export default function Room() {
  let { roomId } = useParams();
  console.log("ROOM ID", roomId);
  return (
    <main className="w-full min-h-screen flex flex-col justify-center bg-slate-400 border ">
      <section className="flex flex-col justify-center  items-center gap-2 w-full h-[70vh] bg-blue-700">
        {/* top */}
        <div className="flex gap-4 h-1/3  w-1/2 items-center justify-center">
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
        </div>
        {/* mid */}
        <div className="flex gap-2 w-1/2 h-1/3  justify-center  text-center">
        <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
          <div className="bg-green-500 w-5/6 rounded-md ">Table</div>
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
        </div>
        {/* btm */}
        <div className="flex gap-4 h-1/3 w-1/2 items-center justify-center">
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
          <p className="bg-white rounded-full w-1/4 h-5/6 text-center">s</p>
        </div>
      </section>
    </main>
  );
}
