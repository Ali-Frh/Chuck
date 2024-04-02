from flask import Flask, request
# Needed for localhost testing.
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit
import sqlite3, time

import smtplib
import secrets
import string

def generate_random_token(length):
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(length))
    return token
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
    t = conn.cursor()
    t.execute("CREATE TABLE IF NOT EXISTS tokens(token TEXT, ip TEXT, uid INTEGER, device TEXT, last_active INTEGER);")
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


def send_mail(data):
    

    with smtplib.SMTP("sandbox.smtp.mailtrap.io", 2525) as server:
        server.login("4bde487839cb76", "********4888")
        server.sendmail(data["sender"], data["receiver"], data["message"])
        return True

def token_helper_logged_in(uid,device , ip):
    with  sqlite3.connect("data.db") as conn:
        token = generate_random_token(24)
        ti = int( time.time( ) )
        c = conn.cursor() 
        c.execute(f"INSERT INTO tokens VALUES ('{ token }', '{ip}', '{ uid }', '{ device }',  '{ ti }')")
        conn.commit()
        return token

def token_helper_verify(token): 
    # pube = 0
    with     sqlite3.connect("data.db") as conn:
        # token = generate_random_token(24)
        #ti = int( time.time( ) )
        c = conn.cursor() 
        c.execute(f"SELECT uid FROM tokens WHERE token='{ token }'")
        # conn.commit()
        try:
            pube = (c.fetchone()[0])
        except:
            pube = 0
    # if pube 
    return pube

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
        c.execute(f"SELECT uid FROM users WHERE password='{hash}' AND username='{payload}' or mail='{payload}';")
        res= c.fetchall()
        if len(res) == 0:
            return "wrong"
        else:
            # print(res[0])
            return token_helper_logged_in(res[0][0], "Chuck Web v1.0", request.remote_addr)
            return "true buddy"
    return "failure", 500

if __name__ == '__main__':
    db_init() #move it to later func 
    db = db_connection()
    print("Starting websocket server")
    # token_helper_logged_in("1", "Your Moms Phone", "1.2.3.4")
    # print(
        # token_helper_verify("8aFc1T8LALi9aF0JgdmusjwI")
    # ,"", token_helper_verify("12") )
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
        
