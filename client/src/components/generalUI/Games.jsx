export default function Games() {
  return (
    <div className="overflow-x-auto bg-green-100 rounded-md pr-3">
      <table className="table">
        {/* head */}
        <thead>
          <tr className="text-center">
            <th></th>
            <th>Table</th>
            <th>Blinds</th>
            <th>Min/Max</th>
            <th>Players</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr className="hover">
            <th></th>
            <td>NAME</td>
            <td>STAKES</td>
            <td>MIN MAX BUYIN</td>
            <td>0/6</td>
            <button className="btn btn-sm btn-accent">Join</button>
          </tr>
          {/* row 2 */}
          <tr className="hover">
            <th></th>
            <td>NAME</td>
            <td>STAKES</td>
            <td>MIN MAX BUYIN</td>
            <td>0/6</td>
            <button className="btn btn-sm btn-accent">Join</button>
          </tr>
          {/* row 3 */}
          <tr className="hover">
            <th></th>
            <td>NAME</td>
            <td>STAKES</td>
            <td>MIN MAX BUYIN</td>
            <td>0/6</td>
            <button className="btn btn-sm btn-accent">Join</button>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
