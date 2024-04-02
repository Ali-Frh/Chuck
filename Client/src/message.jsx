import "./css/message.css"

const Message = (props) => {
    const date = new Date(props.time*1000);
    const time= (date.toLocaleTimeString("en-US"));

    return (
        <>
            <div className={`message-baloon ${localStorage.getItem("uid") == props.from_user? "right":"left"}`}  id={props.to_user+"-"+props.mid}>
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