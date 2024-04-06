import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./css/apphome.css"; 
import chuck from "./assets/chuck.png";
import amoo from "./assets/amoo.jpg";
import dude from "./assets/dude.jpg" 
import Message from "./message.jsx"
import { useRef, useState, useEffect } from "react";
// import io from "socket.io-client"

import AddFriend from "./AddFriend.jsx"
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
    const messagesEndRef = useRef(null);
    const [currentMessages, setCurrentMessages] = useState([])
    const [atButt, setAtButt] = useState(false);

    const [addFriendShow, setAddFriendShow] = useState(false)
    const [width, setWidth] = useState(window. innerWidth)
    const [haveBadge, setHaveBadge] = useState([]); 
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
                // const element = messagesEndRef.current;
                document.getElementsByClassName("messages")[0] .scrollBy(0, 9999999);
                // console.log("cyka") 
              }
            
        };

        useEffect(() => {
            const handleResize = () => {
              setWidth(window.innerWidth);
            };
        
            window.addEventListener('resize', handleResize);
        
            return () => {
              window.removeEventListener('resize', handleResize);
            };
          }, []);
          

      useEffect(() => {
        if (atButt) {
            scrollToBottom();
        }
      }, [currentMessages]); // Scroll to bottom whenever currentMessages change
    
      const closeChat = () => {
        setCurrentMessages([]);
        setChat_id(0);
        setInChat(false); 
      } 

      const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const atBottom = scrollHeight - scrollTop === clientHeight;
        if (atBottom) {
            setAtButt(true);
            console.log("at butt")
          // User is at the bottom
          // Disable autoscroll
          // Optionally, you could add a state to control autoscrolling
        } else {
            setAtButt(!true);
            console.log("is not")
          // User is not at the bottom
          // Enable autoscroll
          // scrollToBottom();
        }
      };


    const [Messages, setMessages] = useState({}); 
    // const [Talks, setTalks] = useState("");
    // const MessagesArea = 

    
    useEffect(() => {


        function onConnect() {
          setIsConnected(true);
          socket.emit("get_chats","");
        }
    
        function onDisconnect() {
          setIsConnected(false);
        }

        
    
        

        function onFooEvent(value) {
          setFooEvents(previous => [...previous, value]);
        }
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on("getMessages", loadMessages); 
        // socket.on('foo', onFooEvent);
    
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
        //   socket.off('foo', onFooEvent);
        };
    }, []);
    socket.on("openChat", openChatBlyat);
    socket.on("get_chats", onGetChats ); 

    // setMessages("Salam");
    const haha = (data) => {
        // (data)=> {
            console.log(data);
            const d = JSON.parse(data); 
            if (d["chat_id"] == chat_id ){
                console.log("neww")

                const de = [[+chat_id, d["type"], d["value"], d["send_at"], null , null]];
                setCurrentMessages(prev => {
                // Filter out elements from d that are already present in prev
                 const filteredD = de.filter(newMessage => !prev.some(existingMessage => existingMessage[3] === newMessage[3]));
              
                // Update state by combining prev and filteredD
                // return [...prev, ...filteredD];
                return [...filteredD, ...prev]
              });
              
                // setCurrentMessages(prev=> ([...prev, ...[]]))
            } else {
                if (d["chat_id"] != localStorage.getItem("uid")) {

                    setHaveBadge(prev=> ([...prev, d["chat_id"]]))
                }
                // console.log(chat_id+"_"+d["chat_id"])
                // document.getElementById("2").click
            }
        // }
    }


    socket.on("incomingMsg", haha)
    
    
    

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
        // console.log(data);
        // console.log("called")
        setCurrentMessages([]);
        setHaveBadge(prevState => prevState.filter(id => id !== +data["chat_id"]));
        scrollToBottom()

    }

    function loadMessages (data) {
        data = JSON.parse(data)
        console.log("called")
        // const vale = {5: "suka"}
        // const val = {chat_id:data["messages"]}
        const id = "chat_" + data["chat_id"];
        // const chts = data["messages"];

        const e = {}
        e[id] = data["messages"];
        // const s = {"test":"suka"}

        const d = data["messages"];
        
        if (currentMessages == d) {
            console.log("condom"); 
        } else {

            setMessages(prev=> ({ ...prev,  ...e}));
            setCurrentMessages(prev => {
                // Filter out elements from d that are already present in prev
                const filteredD = d.filter(newMessage => !prev.some(existingMessage => existingMessage[3] === newMessage[3]));
              
                // Update state by combining prev and filteredD
                return [...prev, ...filteredD];
              });
              
            // setCurrentMessages(prev => ([...prev, ...d]));
        }
        // window.mess = Messages;
        // setMessages(prev => [...prev, val]);
        // Messages[5] = data["messages"];
        // console.log(Messages);
        // console.log(e);
    } 
    
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

        const d = [[+localStorage.getItem("uid"), "text", textBox.current.value, Date.now(), null, null]]; 
        textBox.current.value = "";
        setCurrentMessages(prev => {
            // Filter out elements from d that are already present in prev
             const filteredD = d.filter(newMessage => !prev.some(existingMessage => existingMessage[3] === newMessage[3]));
          
            // Update state by combining prev and filteredD
            // return [...prev, ...filteredD];
            return [...filteredD, ...prev]
          });
    }
    
    const getMessages =  (chat_id, offset) => {
        // alert("ha");
        //   console.log (textBox.current.value);
        

        // textBox.current.value =  "";
    }

    const openChat = (e, chat) => {
        console.log("ch"+chat); 
        console.log ("calld",chat )
        socket.emit("openChat", chat);
        // getMessages(e.target.id, "none");
        // console.log(chat_id+"=>"+offset)
        const data = {
            "chat_id": chat,
            "offset": "none",
            // "value": textBox.current.value
        }
        
        socket.emit("getMessages", JSON.stringify(data));
        
    }

    const ChatItem = ({ chat }) => (
        
        <div className={`chat-item ${chat_id == chat["chat_id"] ? "active": "" }`} onClick={(e)=> openChat(e,chat["chat_id"])} id={chat["chat_id"]}>
            <img src={chat["avatar"] == "null"?  dude: chat["avatar" ]} alt="" />
            <div className="right">
                <span className="title">{chat["name"]}</span>
                <span></span>
                {haveBadge.includes(chat["chat_id"]) && <span className="badge">
                    .
                </span>}
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
        <>
            {/* Meow {chat_id} */}
            
            {console.log( currentMessages)}
            {currentMessages && currentMessages.slice().reverse() .map((message, index) => (
                // <div key={index}>{message[2]}</div>
                <Message mid={0} from_user={message[0]} to_user={chat_id} type={message[1]} value ={message[2]} 
                time =       {message[3]} />
                
            ))}
                {/* <Message mid={1} from_user={1} to_user={1} type={"text"} value={"Hey Koni!!!!!!!!!!!!!!!!!!!"} time={1712077050} /> */}


                    
            

            
        </>
    );
    
    const [inChat, setInChat] = useState( !true ) 
    return (
        

    //   <div className="">
        <>
        
        {addFriendShow && <AddFriend close={()=> setAddFriendShow(!true)} />}

        <PanelGroup className="chatroom" autoSaveId="example" direction="horizontal">
            {((width > 600) || (!inChat)) && 
            <Panel defaultSize={25} maxSize={50} minSize={8}>
                    {/* <button onClick={()=> {
                                // setTalks("Salam");
                                // setMessages({"1":["howdy","suka"]})
                                console.log(Messages);

                            // Messages.current.appendChild(<Message mid={2} from_user={1} to_user={1}
                                // type={"text"} value={"sukw"} time={0} />);
                        }}>test</button> */}
             
                <span className={`indic ${isConnected ? "green" : "red"}` }>.</span>
                <button className="add-friend" onClick={() => {setAddFriendShow(true)}} >+ </button>
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
            }
            <PanelResizeHandle />
            {/* export function ChevronLeftIcon(props) {
  return (
    <svg dataSlot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
} */}


            {((width > 600) || (inChat) ) &&
            <Panel className="yeaah">
                {inChat  && 
                <>
                    <div className="top-bar">
                        <svg dataSlot="icon" onClick={closeChat} className="chev-left" fill="none" style={{color: "chocolate", width: "35px", paddingRight: "10px"}} strokeWidth={3} stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>

                        <img src={avatar} />     
                        <div className="namebox">
                            <span className="recipient">{chat_id == localStorage.getItem("uid") ? " Saved Message " : currentRecipient}</span>
                            <span className="suka">{chat_id == localStorage.getItem("uid") ? "Online": lastOnline} </span>
                        </div>
                    </div> 
                    <div className="chat-stage">
                        <button style={{position: "absolute", top:0, right:0}} onClick={()=> {
                            // setCurrentMessages(prev=> ([...prev, ...prev])
                            console.log(chat_id)
                            
                            // document.getElementById("2").style=
                            
                            // Messages.current.appendChild(<Message mid={2} from_user={1} to_user={1}
                                // type={"text"} value={"sukw"} time={0} />);
                        }}>test</button>
                        <div className="messages" onScroll={handleScroll} >
                            
                            <MessagesList />

                            <div ref={messagesEndRef} />
                            {/* 
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                        
                         */}
                        </div>


                        <div className="sendarea">
                                { !atButt &&
                                <svg dataSlot="icon" onClick={scrollToBottom} className="last" fill="none" style={{color: "chocolate", width: "35px", paddingRight: "10px"}} strokeWidth={3} stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg" aria-hidden="true" >
                               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                               </svg>
                            // <button className="last" onClick={scrollToBottom}>{">"}</button>
                                }
                            <div className="senddocs">
                            </div>
                            <div className="textbox">
                                <button onClick={() => {
                                    // <addFriend />
                                    
                                }}>+</button>
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
            }
        </PanelGroup>
    </>
    )
  }

export default AppHome;