import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./css/apphome.css"; 
import chuck from "./assets/chuck.png";
import amoo from "./assets/amoo.jpg";
import reza from "./assets/aghareza.jpg" 
import Message from "./message.jsx"
import { useState } from "react";

const AppHome = () => {
    const [inChat, setInChat] = useState( true ) 
    return (


    //   <div className="">
        <>
        
        

        <PanelGroup className="chatroom" autoSaveId="example" direction="horizontal">
            <Panel defaultSize={25} maxSize={50} minSize={8}>
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
                        <div className="chat-item">
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
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div><div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">Mr. Blyat</span >
                                <span>Suka!</span>
                            </div>
                        </div>
                        <div className="chat-item">
                            <img src={chuck} alt="" />
                            <div className="right">
                                <span className="title">کاظم قاقی</span >
                                <span>سلام پسرم چطوری ؟ </span>
                            </div>
                        </div>
                    </div>

                </div>
            </Panel>
            <PanelResizeHandle />
            
            <Panel className="yeaah">
                {inChat  && 
                <>
                    <div className="top-bar">
                        <img src={amoo} />     
                        <div className="namebox">
                            <span className="recipient">Amoo Joon</span>
                            <span className="suka">Last seen recently </span>
                        </div>
                    </div> 
                    <div className="chat-stage">
                        <div className="messages">
                            <Message mid={1} from_user={1} to_user={1} type={"text"} value={"Hey Koni!"} time={1712077050} />
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
                            <Message mid={2} from_user={2} to_user={1} type={"text"} value={"Salam Dada !"} time={1712077051} />
                        
                        
                        </div>

                        <div className="sendarea">
                            <div className="senddocs">
                            </div>
                            <div className="textbox">
                                <button>+</button>
                                <textarea name="" id="" cols="30" rows="1"></textarea>
                                <button>
                                
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
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