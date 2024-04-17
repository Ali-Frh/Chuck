import {ContextMenu} from "./ContextMenu"
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
import axios from "axios";

// divRef.current.scrollTop = divRef.current.scrollHeight;

function getLastSeen(timestamp) {
    if (timestamp == 0 ) {
        return "Online";
    } else {
        console.log(timestamp)
    }

    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    console.log(days + "-" + hours + "-" + seconds + "-" + minutes )
    const date = new Date(timestamp);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: true,
    };
  
    if (days < 1) {
        // console.log()
        if (minutes < 10 && hours == 0) {
            if (minutes == 0 ) {
                return "Last seen just now"
            }
            return `last seen ${minutes} minutes ago` 
        }
      return `last seen at ${date.toLocaleTimeString(undefined, {hour:"numeric", minute:"numeric"})}`;
    } else if (days === 1) {
      return `last seen yesterday at ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })}`;
    } else {
      return `last seen ${date.toLocaleTimeString(undefined, options)}`;
    }
  }
  

const AppHome = () => {
    var uid = localStorage.getItem("uid");
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
    const [topLoader, setTopLoader ] = useState("hide")
    const [lastAsked, setLastAsked] = useState(0)

    const [currentMid, setMid] = useState(0);
    // var p = 0;
    const [lastOffs, setLastOffs] = useState(0 )


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
    
      useEffect(()=> {
        if (currentMessages.length != 0) {
        const updatedChats = Chats.map(chat => {
            if (chat.chat_id == chat_id) {
                return {...chat, lastMess: [currentMessages[0][0], currentMessages[0][ 1], currentMessages[ 0][2]  ]}; // Replace 'new_last_seen_value' with the updated timestamp
            }
            return chat;
        });
        setChats(updatedChats);
        console.log("hah", Chats)
        console.log("haha", currentMessages)
    }
      }, [currentMessages])

      const closeChat = () => {
        setCurrentMessages([]);
        setChat_id(0);
        setInChat(false); 
      } 

      const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const atBottom = scrollHeight - scrollTop <= clientHeight + 20;
        if (atBottom) {
            setAtButt(true);
        } else {
            setAtButt(!true);
            // console.log("is not" )
          // User is not at the bottom
          // Enable autoscroll
          // scrollToBottom();
        }

        if ( scrollTop < 20 
             && currentMessages.length > 9 
             ) {
            // console.log(1) 
            
            setTopLoader("show")

            // console.log( lastAsked)
            let id = currentMessages[currentMessages.length -1][4]
            // console.log(id)
            if (id != lastAsked) {
                // p = scrollHeight
                setLastOffs( scrollHeight)
                // console.log(p + " => height")
                setLastAsked(id)
                setTimeout(() => {

                    // console.log("reqq")
                    socket.emit("getRest", JSON.stringify({"chat_id": chat_id, "mid": id, "direction": "UP" }))
                    setTopLoader("hide")
                }, 700);
                
            } else {setTopLoader("hide")}

        } else {
            setTopLoader("hide")
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

        // socket.on('foo', onFooEvent);
        
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            //   socket.off('foo', onFooEvent);
        };
    }, []);
    socket.on("getMessages", loadMessages); 
    socket.on("openChat", openChatBlyat);
    socket.on("get_chats", onGetChats ); 
    
    
    const grest = (data) => {
        console.log ("grest"+ data)
        data = JSON.parse(data)

        console.log("stage 1=>"+chat_id)
        if (data["chat_id"] == chat_id ) {
            
            let d = data["messages"]
            if (data["direction"] == "UP") {
                
                console.log("12")
                setCurrentMessages(prev => {
                    // Filter out elements from d that are already present in prev
                    const filteredD = d.filter(newMessage => !prev.some(existingMessage => existingMessage[3] === newMessage[3]));
                  
                    // Update state by combining prev and filteredD
                    return [...prev, ...filteredD];
                });
                
                // setTimeout(()=> {

                //     let elem =  document.getElementsByClassName("messages")[0]
                //     let offs = elem.scrollHeight - lastOffs 
                //     console.log(offs+ " offs, elem sche=> "+elem.scrollHeight+ " la => " + lastOffs   )
                //     elem.scrollTo(0, offs) 
                // }, 0);

            }
        }
    }

    socket.on("getRest", grest)

    const lastSeener = (data) => {
        data = JSON.parse(data)
        console.log(Chats)
        console.log(data)
        // console.log()
        // const temp = Chats;
        const updatedChats = Chats.map(chat => {
            if (chat.chat_id === data.user) {
                return {...chat, lastSeen: data.value}; // Replace 'new_last_seen_value' with the updated timestamp
            }
            return chat;
        });
        if (data. user == chat_id) {
            setChats(updatedChats);
            // setChats()
            setLastOnline(data.value)
            // console.log ("SUKA" + data. value)
        } 
    }
    socket.on("lastSeenHook", lastSeener);

    // setMessages("Salam");
    const haha = (data) => {
        // (data)=> {
            console.log(data);
            const d = JSON.parse(data); 

            data = d;


            
    





            const updatedChats = Chats.map(chat => {
                if (chat.chat_id == data["chat_id"]) {
                    return {...chat, lastMess: [data["sender"], data["type"], data["value" ] ]}; // Replace 'new_last_seen_value' with the updated timestamp
                }
                return chat;
            });
    
            setChats(updatedChats);
            console.log("hah", Chats)





            if (d["chat_id"] == chat_id ){
                console.log("neww")
                console.log(d)
                
                const de = [[parseInt(d["sender"]), d["type"], d["value"], d["send_at"], +d["mid"], null , null]];
                console.log("+ "+ de)
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
        setLastAsked(0)

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

            //   setLastOffs( scrollHeight)
            //     // console.log(p + " => height")
                // setTimeout(() => {

                    // console.log("reqq")
                if ( lastAsked!= d[d.length -1 ][4] )  {

                    socket.emit("getRest", JSON.stringify({
                        "chat_id": data[ "chat_id"], "mid": d[d.length -1][4],
                        "direction": "UP" }))
                        console.log ("got")
                        // setLastAsked
                        setLastAsked(d[d.length -1 ][4]) 
                        scrollToBottom();
                        // setLastOffs(document.getElementsByClassName("messages")[0].scrollHeight - 50)
                } 
                    // setTopLoader("hide")
                // }, 700);
              
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
        if (textBox.current.value .replace(/\s/g, '').length == 0) {
            return;
        }
        console.log (textBox.current.value);
        const data = {
            "chat_id": chat_id,
            "type": "text",
            "value": textBox.current.value
        }
        
        socket.emit("sendMessage", JSON.stringify(data));

        const d = [[+localStorage.getItem("uid"), "text", textBox.current.value, Date.now()/1000, null, null]]; 
        setTimeout(()=> {

            textBox.current.value = ""
        }, 100);
        // textBox.current.rows = 1;
        // if (chat_id != localStorage.getItem("uid")){
        // setCurrentMessages(prev => {
        //     // Filter out elements from d that are already present in prev
        //      const filteredD = d.filter(newMessage => !prev.some(existingMessage => existingMessage[3] === newMessage[3]));
          
        //     // Update state by combining prev and filteredD
        //     // return [...prev, ...filteredD];
        //     return [...filteredD, ...prev]
        //   });
        
        // }
    }

    const DeleteMessage = (e) => {
        alert(e);
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
            <div>
                <img width={"50px"} height={"50px"} src={chat["avatar"] == "null"?  dude: chat["avatar" ]} alt="" />
                
                {chat["lastSeen"] == 0  &&

                <span className="onlineindic">
                        .
                </span>}
            </div> 
            
            <div className="right">
                <span className="title">{chat["name"]}</span>
                <span></span>
                {haveBadge.includes(chat["chat_id"]) && <span className="badge">
                    .
                </span>}

                {/* <span></span> */}
                <span className="lil-wrap">

                <span className="who-said">{chat["lastMess"][0] == uid && chat["chat_id"] != uid && "You: "}</span>
                <span className="lil-text">{chat["lastMess"][1] == "text" && chat["lastMess"][2]} </span>
                </span>
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

    socket.on("deleteMessage", (data) => {
        data = JSON.parse(data)
        console.log(data )
        if (data["chat_id"] == chat_id) {
            let mid = data["mid"]
            console.log("hidin "+mid)
            const updatedMessages = currentMessages.filter(item => item[4] !== mid);
            
            // Update the state with the new array
            setCurrentMessages(updatedMessages);
        }

    } )

    const deleteMessage = (mid, chat) => {
        socket.emit("deleteMessage", JSON.stringify({chat_id:chat_id, mid: mid}));
        console.log("Requesting delete "+mid+" in "+chat_id)
    }
    
    
    const MessagesList = () => {
        let lastDate = 0;
        
        return  (
        <>
            {/* Meow {chat_id} */}
            
            {/* {console.log( currentMessages)} */}
            {currentMessages && currentMessages.slice().reverse() .map((message, index) => { 
                let d = new Date(message[3]* 1000 );
                let dete = d.toLocaleString("en-us", {month: "long", day:"numeric"})
                // dete = message[3]
                // lastDate == 0 ? lastDate = dete : lastDate;

                return (
                // <div key={index}>{message[2]}</div>
                <>
                    { lastDate != dete &&
                         

                        <div className="fdate">{dete}</div>
                    
                    }
                    <Message key={message[4 ]} mid={message[4 ]} from_user={message[0]} to_user={chat_id} type={message[1]} value ={message[2]} 
                    time =       {message[3]} delete={deleteMessage} setMid={setMid } />
                    
                    <div style={ {display: "none"}}>
                     { lastDate = dete  }
                        
                    </div>
                </>
                )
        }
            )}
                {/* <Message mid={1} from_user={1} to_user={1} type={"text"} value={"Hey Koni!!!!!!!!!!!!!!!!!!!"} time={1712077050} /> */}


                    
            

            
        </>
    ) }
    ;
    
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
    <svg  fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
} */}


            {((width > 600) || (inChat) ) &&
            <Panel className="yeaah">
                {inChat  && 
                <>
                    <div className="top-bar">
                        <svg   onClick={closeChat} className="chev-left" fill="none" style={{color: "chocolate", width: "35px", paddingRight: "10px"}} strokeWidth={3} stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>

                        <img src={avatar} />     
                        <div className="namebox">
                            <span className="recipient">{chat_id == localStorage.getItem("uid") ? " Saved Message " : currentRecipient}</span>
                            <span className="suka">{chat_id == localStorage.getItem("uid") ? "Online": getLastSeen( lastOnline) } </span>
                        </div>
                    </div> 
                    <div className="chat-stage">
                        { topLoader == "show" &&  <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div> }
                        <button style={{position: "absolute", top:0, right:0, display: "none"}} onClick={()=> {
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
                            <ContextMenu delete={deleteMessage} mid={currentMid} />
                        </div>


                        <div className="sendarea">
                                { !atButt &&
                                <svg  onClick={scrollToBottom} className="last" fill="none" style={{color: "chocolate", width: "35px", paddingRight: "10px"}} strokeWidth={3} stroke="currentColor" viewBox="0 0 24 24"
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
                                    alert(window.innerHeight + ", " + window.height + "/"  )
                                    
                                }}>+</button>
                                <textarea dir="auto" name="" id="" cols="30" rows="1" 
                                ref ={textBox}
                                onKeyPress={(e)=> {
                                    if(e.key == "Enter" && !e.nativeEvent.shiftKey) {
                                        sendMessage(e)

                                    }
                                }}
                                ></textarea>
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