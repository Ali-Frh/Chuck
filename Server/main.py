from flask import Flask, request
# Needed for localhost testing.
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit
import sqlite3, time

db = []

def db_init(): 

    # Create a database and open the database.
    # If the database already exists just opens the database
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    # Create a users table if the table does not exists
    c.execute('''CREATE TABLE IF NOT EXISTS users(
              uid INTEGER,
              name TEXT,
              username TEXT,
              mail TEXT,
              password TEXT, 
              restriction TEXT,
              signup_time INTEGER,
              last_seen INTEGER,
              avatar TEXT
              
              )''')
    current_unix_time = int(time.time())

    # c.execute(f'''INSERT INTO users VALUES(
    #           1,
    #           "Ali",
    #            "Shakak",
    #            "ali@shak.net" ,
    #           "81dc9bdb52d04dc20036dbd8313ed055" , 
    #           "none",
    #           {current_unix_time},
    #           {current_unix_time},
    #           "null"
              
    #           )''')
    # commit changes and close database connect
    conn.commit()
    conn.close()

def db_connection(): 

    # Create a database and open the database.
    # If the database already exists just opens the database
    conn = sqlite3.connect('data.db',check_same_thread=False )
    return conn 
    # conn.close()


app = Flask(__name__)

# Socket io setup.
app.config['SECRET_KEY'] = 'secret!'
# |cors_allowed_origins| is required for localhost testing.
socket = SocketIO(app, cors_allowed_origins="*")

# For localhost testing.
CORS(app)


@socket.on('connect')
def test_connect():
    emit('custom-server-msg',
         {'data': 'Print this out via data.data in your client'})

@app.route("/auth",methods=['GET', 'POST'] ) 
def authentication():
    print("auuuuuth")
    # form = RegisterForm(request.form)
    with sqlite3.connect("data.db") as conn:
        c = conn.cursor()
        payload = request.get_json()["payload"]
        # print()
        c.execute(f"SELECT * FROM users WHERE username='{payload}' or mail='{payload}';")
        res= c.fetchall()
        if len(res) == 0:
            return "not found"
        else:
            return "found"
    return "failure", 500
    # print("yeaa")
    # return "200" 
import hashlib
  
# initializing string
str2hash = "GeeksforGeeks"
  
# encoding GeeksforGeeks using encode()
# then sending to md5()
# result = hashlib.md5(str2hash.encode())

@app.route("/login",methods=['GET', 'POST'] ) 
def authentication_login():
    # print("auuuuuth")
    # form = RegisterForm(request.form)
    with sqlite3.connect("data.db") as conn:
        c = conn.cursor()
        payload = request.get_json()["payload"]
        password = request.get_json()["password"] 
        hash =  hashlib.md5(password.encode()).hexdigest()
        # print()
        c.execute(f"SELECT * FROM users WHERE password='{hash}' AND username='{payload}' or mail='{payload}';")
        res= c.fetchall()
        if len(res) == 0:
            return "wrong"
        else:
            return "true buddy"
    return "failure", 500

if __name__ == '__main__':
    db_init() #move it to later func 
    db = db_connection()
    print("Starting websocket server")
    socket.run(app, allow_unsafe_werkzeug=True)
        
# from flask import Flask, render_template
# from flask_socketio import SocketIO, emit

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret'
# socketio = SocketIO(app)

# # @app.route('/')
# # def index():
# #     return render_template('index.html')

# @socketio.on('message')
# def handle_message(msg):
#     print('Message: ' + msg)
#     emit('message', msg, broadcast=True)

# @socketio.on('connect')
# def login_handler():
#     msg = "anap"
#     print('Message: ' + msg)
#     emit('message', msg, broadcast=True)

# if __name__ == '__main__':
#     socketio.run(app, allow_unsafe_werkzeug=True)
        
