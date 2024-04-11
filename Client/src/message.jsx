import "./css/message.css"
import {useState } from "react";
import {showContextMenu} from "./ContextMenu"

  // Usage: Add this event listener to the element where you want to show the context menu
document.addEventListener('click', ()=> {document.getElementsByClassName('context')[0].style.display="none" });
  

const Message = (props) => {

    const [context, setContext] = useState(false) 
    const date = new Date(props.time*1000);
    const time= (date.toLocaleTimeString("en-US"));

    return (
        <>
            <div className={`message-baloon ${localStorage.getItem("uid") == props.from_user? "right":"left"}`} 
             id={props.to_user+"-"+props.mid}
             
             onContextMenu={(e) => {
                props.setMid(props.mid);
                e.preventDefault(); // prevent the default behaviour when right clicked
                console.log("Right Click"+ e.clientX+ ":" + e.clientY);
                showContextMenu(e, props.mid);
                // props.delete(props.mid, 0)
                
              }}
        
             >
                <div className="text">
                    {props.type == "text" && <p dangerouslySetInnerHTML={{ __html: props.value.replace(/\n/g, "<br>") }} dir="auto">
                        {/* {props.value.replace(/\n/g, "<br>")} */}
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