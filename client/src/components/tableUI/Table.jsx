import PropTypes from "prop-types";

export default function Table({ pot }) {
  return (
    <main className="bg-green-600 w-full rounded-md flex flex-col justify-between  items-center">
            <section>$ {pot}</section>
      <section className="flex justify-evenly gap-2 mt-10 w-5/6 h-20 bg-yellow-300">
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
