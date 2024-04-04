import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./css/apphome.css"; 
import chuck from "./assets/chuck.png";
import amoo from "./assets/amoo.jpg";
import dude from "./assets/dude.jpg" 
import Message from "./message.jsx"
import { useRef, useState, useEffect } from "react";
// import io from "socket.io-client"


import { socket } from './socket.js';

// divRef.current.scrollTop = divRef.current.scrollHeight;


const AppHome = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);
    const [Chats, setChats] = useState([]);
    const [currentRecipient, setCurrentRecipient] = useState("loading");
    const [lastOnline, setLastOnline] = useState("....");
    const [avatar, setAvatar] = useState(dude);
    const [chat_id, setChat_id] = useState(0); 

    const [Messages, setMessages] = useState(); 
    const [Talks, setTalks] = useState("");
    // const MessagesArea = 

    
    useEffect(() => {


        function onConnect() {
          setIsConnected(true);
          socket.emit("get_chats","");
        }
    
        function onDisconnect() {
          setIsConnected(false);
        }

        function onGetChats(value) {
            // setChats(value);
            const parsedChats = JSON.parse(value);
            setChats(parsedChats);

            console.log(value);
        }

        function openChatBlyat(data) {
            data = JSON.parse(data);
            setInChat(true);
            setCurrentRecipient(data["name"]);
            setLastOnline(data["last_online"])
            setChat_id(data["chat_id"]);
            // setAvatar(data["avatar"])
            console.log(data);
            

        }
    
        function loadMessages (data) {
            data = JSON.parse(data)
            console.log(data )
            // const vale = {5: "suka"}
            // const val = {chat_id:data["messages"]}
            const id = "chat_" + data["chat_id"];
            // const chts = data["messages"];

            const e = {}
            e[id] = data["messages"];
            // const s = {"test":"suka"}


            setMessages(prev=> ({ ...prev,  ...e}));

            // window.mess = Messages;
            // setMessages(prev => [...prev, val]);
            // Messages[5] = data["messages"];
            // console.log(Messages);
            // console.log(e);
        } 

        function onFooEvent(value) {
          setFooEvents(previous => [...previous, value]);
        }
        socket.on("get_chats", onGetChats ); 
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on("incomingMsg", (data)=> {
            console.log(data);
        })

        socket.on("getMessages", loadMessages); 
        socket.on("openChat", openChatBlyat);
        // socket.on('foo', onFooEvent);
    
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
        //   socket.off('foo', onFooEvent);
        };
    }, []);
    // setMessages("Salam");


    
    const textBox = useRef();
    
    const sendMessage =  (e) => {
        // alert("ha"); 
        console.log (textBox.current.value);
        const data = {
            "chat_id": chat_id,
            "type": "text",
            "value": textBox.current.value
        }
        
        socket.emit("sendMessage", JSON.stringify(data));

        textBox.current.value = "";
    }
    
    const getMessages =  (chat_id, offset) => {
        // alert("ha");
        //   console.log (textBox.current.value);
        console.log(chat_id+"=>"+offset)
        const data = {
            "chat_id": chat_id,
            "offset": offset,
            // "value": textBox.current.value
        }
        
        socket.emit("getMessages", JSON.stringify(data));

        // textBox.current.value =  "";
    }

    const openChat = (e) => {
        console.log ("calld",e.target.id )
        socket.emit("openChat", e.target.id);
        getMessages(e.target.id, "none");
        
    }

    const ChatItem = ({ chat }) => (
        
        <div className={`chat-item ${chat_id == chat["chat_id"] ? "active": "" }`} onClick={ openChat} id={chat["chat_id"]}>
            <img src={chat["avatar"] == "null"?  dude: chat["avatar" ]} alt="" />
            <div className="right">
                <span className="title">{chat["name"]}</span>
                <span></span>
            </div>
        </div>
    );
    
    const ChatList = ({ chats }) => (
        <div>
            {Object.keys(chats).map(chatId => (
                
                
                <ChatItem
                    key={chatId}
                    chat={chats[chatId ]}
                    />
                
                
            ))}
            {/* { (chats) } */}
        </div>
    );
    
    const MessagesList = () => (
        <div>
            Meow {chat_id}
            

            
        </div>
    );
    
    const [inChat, setInChat] = useState( true ) 
    return (
        

    //   <div className="">
        <>
        
        
        <PanelGroup className="chatroom" autoSaveId="example" direction="horizontal">
            <Panel defaultSize={25} maxSize={50} minSize={8}>
                    <button onClick={()=> {
                                // setTalks("Salam");
                                // setMessages({"1":["howdy","suka"]})
                                console.log(Messages);

                            // Messages.current.appendChild(<Message mid={2} from_user={1} to_user={1}
                                // type={"text"} value={"sukw"} time={0} />);
                        }}>test</button>
             
                <span className={`indic ${isConnected ? "green" : "red"}` }>.</span>
                <button className="add-friend">+ </button>
                <div className="bar">
                    <div className="west">
                        {/* <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"></path>
                        </svg> */}
                        <img src={chuck} alt="" />
                    </div>
                    <span>Chats</span>
                </div> 
                <div className="chats-list">
                    <div className="list-box">
                        {/* <div className="chat-item">
                            <img src={amoo} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={reza} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div> */}
                        <ChatList chats={Chats} />
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                    </div>

                </div>
            </Panel>
            <PanelResizeHandle />
            
            <Panel className="yeaah">
                {inChat  && 
                <>
                    <div className="top-bar">
                        <img src={avatar} />     
                        <div className="namebox">
                            <span className="recipient">{chat_id == localStorage.getItem("uid") ? " Saved Message " : currentRecipient}</span>
                            <span className="suka">{chat_id == localStorage.getItem("uid") ? "Online": lastOnline} </span>
                        </div>
                    </div> 
                    <div className="chat-stage">
                        <button onClick={()=> {
                                setTalks("Salam");
                                console.log(Talks);

                            // Messages.current.appendChild(<Message mid={2} from_user={1} to_user={1}
                                // type={"text"} value={"sukw"} time={0} />);
                        }}>test</button>
                        <div className="messages" >
                            
                            {/* <MessagesList /> */}
                            {/* <Message mid={1} from_user={1} to_user={1} type={"text"} value={"Hey Koni!"} time={1712077050} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={1} from_user={1} to_user={1} type={"text"} value={"Hey Koni!"} time={1712077050} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Last Salam Dada !"} time={1712077051} />
                        
                         */}
                        </div>

                        <div className="sendarea">
                            <div className="senddocs">
                            </div>
                            <div className="textbox">
                                <button>+</button>
                                <textarea name="" id="" cols="30" rows="1" ref ={textBox}></textarea>
                                <button onClick={(e) => {sendMessage(e)} }>
                                
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg>


                                </button>
                            </div>
                            
                        </div>
                    </div>
                </>
                }
                
            </Panel>
        </PanelGroup>
    </>
    )
  }

export default AppHome;