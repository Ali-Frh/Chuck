import "./css/context-menu.css"
import {useState} from "react"





const copyIcon = (props) => {
    return (
      <>
      
      </>
    );
  }
  

export const ContextMenu = (prop) => {
    

    return (
        <div className="context">
            <ul>
            <li>
            <svg dataSlot="icon" fill="none" strokeWidth={1.5} 
            stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true"          >
        <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
        </svg>
                    Reply
                    
                </li>
                <li>
                <svg dataSlot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
                    Copy
                    
                </li>

                <li onClick={()=> { prop.delete(prop.mid); console.log("ha"+prop.mid) }}>
                <svg dataSlot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"  >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                 </svg>
                Delete
                </li>
            </ul>
        </div>
    )
}

export function showContextMenu(event, mid) {
    event.preventDefault(); // Prevent the default context menu
    // console.log(event)
    const contextMenu = document.getElementsByClassName('context')[0];
    const containedIn = document.getElementsByClassName("messages")[0]; 
    const offsetX = 10; // Adjust as needed
    const offsetY = 10; // Adjust as needed
    
    // Calculate menu position relative to the click
    let menuX = event.clientX + offsetX;
    let menuY = event.clientY + offsetY;
    
    // contextMenu.offsetWidth = "200px";
    contextMenu.style.display= "block";

    // console.log(menuX + "-" + menuY + "_" + window.innerWidth + "=> " + contextMenu.offsetWidth)

    // Check if menu overflows on the right side
    let padd = 20;
    if (menuX + contextMenu.offsetWidth + padd > window.innerWidth) {
      menuX = window.innerWidth - contextMenu.offsetWidth - padd;
    }
    // setMid(mid)
    // Check if menu overflows on the bottom
    // window.innerHeight
    if (menuY + contextMenu.offsetHeight > containedIn.offsetHeight) {
    //   if (menuY + contextMenu.offsetHeight)
      menuY = containedIn.offsetHeight - contextMenu.offsetHeight + 50;
      console.log(menuY + "is y, "+ containedIn.offsetHeight + "is conta, "+contextMenu.offsetHeight)
    }
    
    // Set menu position
    contextMenu.style.left = `${menuX}px`;
    contextMenu.style.top = `${menuY}px`;
    
    // Show the context menu
  }
  

// export ContextMenu;
// export default showContextMenu;