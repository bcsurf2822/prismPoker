import { useParams } from "react-router"


export default function Room() {
  let {roomId} = useParams()
  console.log("ROOM ID", roomId)
  return (
    <div>
 
      <h1>     This is a room {roomId}</h1>
    </div>
  )
}
