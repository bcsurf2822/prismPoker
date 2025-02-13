import PropTypes from "prop-types";

export default function Table({ pot }) {
  return (
    <main className="bg-green-600 border-2 border-black w-full rounded-full flex flex-col justify-evenly  items-center ">
      <section>
        <p className="text-white"><span className="font-bold">Pot:</span>  ${pot}</p>
      </section>
      <section className="flex justify-evenly gap-2 mt-10 w-3/4 h-28 ">
        <div className="bg-white w-1/12 rounded-md border-2 border-black"></div>
        <div className="bg-white w-1/12 rounded-md border-2 border-black"></div>

        <div className="bg-white w-1/12 rounded-md border-2 border-black"></div>

        <div className="bg-white w-1/12 rounded-md border-2 border-black"></div>

        <div className="bg-white w-1/12 rounded-md border-2 border-black"></div>
      </section>
    </main>
  );
}

Table.propTypes = {
  pot: PropTypes.number,
};
