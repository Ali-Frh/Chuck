import "./css/message.css"
import {useState } from "react";

const Message = (props) => {

    const [context, setContext] = useState(false) 
    const date = new Date(props.time*1000);
    const time= (date.toLocaleTimeString("en-US"));

    return (
        <>
            <div className={`message-baloon ${localStorage.getItem("uid") == props.from_user? "right":"left"}`} 
             id={props.to_user+"-"+props.mid}
             
             onContextMenu={(e) => {
                e.preventDefault(); // prevent the default behaviour when right clicked
                console.log("Right Click");
              }}
        
             >
                <div className="text">
                    {props.type == "text" && <p dir="auto">
                        {props.value}
                    </p>}
                    {/* {window.test}  */}
                    {/* mid, from_user, to_user, type, value, time  */}
                    <span className="time" >{time }</span>
                </div>
            </div>
        </>
    )
}

export default Message; 