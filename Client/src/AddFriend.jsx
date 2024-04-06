import "./css/addfriend.css"

const AddFriend = (props) => {
    return (
        <div className="
            back-black
        ">
            <div className="the-box">
                <button onClick={props.close} className="close-box">+</button>
                <input type="text" className="input" />
                <button>Search</button>
            </div>
            {/* <h1>Meow</h1> */}
        </div >
    )
}

export default AddFriend; 