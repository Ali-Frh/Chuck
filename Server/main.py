import sys

from flask import Flask, request
# Needed for localhost testing.
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit, join_room, leave_room
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
    
    p = conn.cursor()
    p.execute("""
        Create Table if not exists messages(
              mid integer,
              chat_id integer,
              replied_to integer,
              type text,
              value text,
              fromuser integer, 
              send_at integer,
              edited text,
              deleted text, 
              id INTEGer primary  key Autoincrement

        )
"""
    )

    a = conn.cursor()
    a.execute("""
              Create Table If not exists chats (
                id Integer,
               uid integer, 
              chat_id integer,  
              last_message  integer 
              )
              """)
    
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

def get_last_mid(uid, chat_id):
    
    with sqlite3.connect("data.db") as conn:
        c = conn.cursor(        )
        # c.execute(f"SELECT mid FROM messages WHERE (uid)")
        c.execute(f"""
    Select mid FROM messages WHERE (chat_id='{chat_id}' AND fromuser ='{uid}') OR 
        (chat_id='{uid}' AND fromuser='{chat_id}') ORDER BY send_at DESC LIMIT 1;                   
 """)
        # numba = 0
        numba = c.fetchone()
    
    if numba == None:
        return 0
    else:
        return numba[0]

app = Flask(__name__)

# Socket io setup.
app.config['SECRET_KEY'] = 'secret!'
# |cors_allowed_origins| is required for localhost testing.
socket = SocketIO(app, cors_allowed_origins="*")

# For localhost testing.
CORS(app)

online_users = {}
conn_to_uid = {}

def buddies(uid):
    with sqlite3.connect("data.db") as conn:
        c = conn.cursor(        )
        c.execute("Select chat_id  from chats where uid='"+str(uid)+"';" )
        d= c.fetchall()
        print("uid", uid, ":", d)
    onlines = []
    for i in d:
        # print(i)
        i = i[0]
        if i in online_users:
            onlines.append(online_users[i])

    return onlines

import  json

@socket.on('connect')
def test_connect():
    auth= request.headers.get('Authorization')
# , request.sid)
    
    uid= (token_helper_verify(auth))
    if uid == 0:
        # emit()
        return 
    online_users[uid] = request.sid
    conn_to_uid[request.sid ]=  uid  
    print("User", uid, "is Online.")
    # emit('custom-server-msg',
        #  {'data': 'Print this out via data.data in your client'})
    with sqlite3.connect("data.db") as conn:
        c = conn.cursor(        )
        c.execute("UPDATE users SET last_seen=0 WHERE uid=\""+str(uid) + "\";" )
        conn.commit()
    
    budds = buddies(uid)
    for budd in budds:
        emit("lastSeenHook", json.dumps({"user": uid, "value": "0"}), room=budd)
        # return c.fetchall()


#  @socket.on("query")
# def query_user(user):
    # print("hah")


def get_user_meta(uid):
    with sqlite3.connect("data.db") as conn:
        c = conn.cursor(        )
        c.execute("Select uid,name,username,avatar,last_seen from users where uid='"+str(uid)+"';" )
        return c.fetchall()

@socket.on("deleteMessage")
def delete(data):
    with sqlite3.connect("data.db") as conn:
        sq = conn.cursor()
        data = json.loads(data)
        uid = str(conn_to_uid[request.sid])
        chat_id = data["chat_id"]
        mid = data["mid"]

        # Check if the message exists and belongs to the user
        sq.execute(f"""
                    SELECT COUNT(*) FROM messages
                    WHERE mid = ? AND ((chat_id = ? AND fromuser = ?) OR (fromuser = ? AND chat_id = ?))
                    """, (mid, chat_id, uid, chat_id, uid))
        message_exists = sq.fetchone()[0]

        if message_exists and mid != None:
            # sq.execute(
            #     f"""
            #             DELETE FROM messages
            #             WHERE mid = ? AND ((chat_id = ? AND fromuser=?) OR (fromuser = ? and chat_id = ?) )
            #             """, (mid, chat_id, uid,chat_id, uid))
            sq.execute(
    f"""
    UPDATE messages
    SET deleted = 'yes'
    WHERE mid = ? AND ((chat_id = ? AND fromuser = ?) OR (fromuser = ? AND chat_id = ?) )
    """, (mid, chat_id, uid, chat_id, uid))

            conn.commit()
            print("Message deleted:", mid)

            if (int(chat_id) in online_users):
                room = online_users[int(chat_id)]
                emit("deleteMessage", json.dumps({"chat_id": uid,  "mid": mid}), room=room)

            emit("deleteMessage", json.dumps({"chat_id": chat_id, "mid": mid}))
            # conn.commit()
        else:
            print("Message not found or permission denied.")

@socket.on("sendMessage")
def send(data):
    with sqlite3.connect("data.db") as conn:
        sq = conn.cursor()
        data = json.loads(data)
        sender = str(conn_to_uid[request.sid])

        mid = get_last_mid(sender, data["chat_id"]) + 1 
        sq.execute(f"""
                   INSERT INTO messages(mid, chat_id, type, fromuser, value, send_at) VALUES(
                   "{mid} ",
                   "{data["chat_id"]}", 
                "{ data["type"]}",
                   {sender}, 
                 "{data["value"]}",
                   {int(time.time() )}) """)
        print("hah", data)

        conn.commit()

        print("="*10,"\n" , online_users)
        
        if int( data["chat_id"]     ) in  online_users:
            print("yeah")
            emit("incomingMsg", json.dumps({"mid": mid, 
                                            "sender": sender,
                                             "chat_id":conn_to_uid[request.sid],
                                             "type": data["type"] , "value": data["value"],
                                               "send_at":     int(time.time())}), 
                                           room=online_users[int( data["chat_id"]         )])
        emit("incomingMsg",json.dumps({"mid": mid, 
                                       "sender": sender,
                                             "chat_id": data["chat_id"],
                                             "type": data["type"] , "value": data["value"],
                                               "send_at":     int(time.time())}))

        # fresh = get_user_meta(conn_to_uid[request.sid]) [0]
        # dat = {int(conn_to_uid[request.sid]):{
        # dat = [{
            # "chat_id": conn_to_uid[request.sid],

@socket.on('disconnect')
def handle_disconnect():
    uid = conn_to_uid [request.sid]
    print('Client disconnected without telling', uid)

    budds = buddies(uid)
    for budd in budds:
        print("told", budd, "="*20)
        emit("lastSeenHook", json.dumps({"user": uid, "value": str(time.time() * 1000 )}) , room=budd)

    with sqlite3.connect("data.db") as conn:
        c = conn.cursor(        )
        c.execute("UPDATE users SET last_seen=\""+str(time.time() * 1000 ) + "\" WHERE uid=\""+str(uid) + "\"; " )
        conn.commit()



@socket.on("getRest")
def get_rest(data):
    data = json.loads(data)
    user = conn_to_uid[request.sid]
    peer = data["chat_id"]

    if data["direction"] == "UP":
        sql = f"""
    Select fromuser, type, value, send_at, mid, replied_to, edited FROM messages WHERE (mid < {data["mid"]} and deleted IS NULL And ((chat_id='{user}' AND fromuser ='{peer}') OR 
        (chat_id='{peer}' AND fromuser='{user}') )) ORDER BY send_at DESC LIMIT 10;                   
 """


# offset buddy
    with sqlite3.connect("data.db") as conn:
        sq = conn.cursor()
        sq.execute(sql)
        # print("hah", data)
        r = sq.fetchall()
        
        r = {"chat_id": peer, "messages": r, "direction": data["direction"]}
        
        
        emit("getRest", json.dumps (
        r      ))
        print("SENT")

@socket.on("getMessages")
def get_mess(data):
    data = json.loads(data)
    user = conn_to_uid[request.sid]
    peer = data["chat_id"]
# offset buddy
    with sqlite3.connect("data.db") as conn:
        sq = conn.cursor()
        sq.execute(f"""
    Select fromuser, type, value, send_at, mid, replied_to, edited FROM messages WHERE (deleted IS NULL And ((chat_id='{user}' AND fromuser ='{peer}') OR 
        (chat_id='{peer}' AND fromuser='{user}') )) ORDER BY send_at DESC LIMIT 10;                   
 """)
        # print("hah", data)
        r = sq.fetchall()
        
        r = {"chat_id": peer, "messages": r}
        
        
        emit("getMessages", json.dumps (
        r      ))
        print("SENT")

def get_buddies_last_mess(id1, id2): 
    with sqlite3.connect("data.db") as conn: 
        sq = conn.cursor()
        sq.execute(f"""
                   SELECT fromuser, type, value FROM messages WHERE
                    deleted IS NULL AND ( (chat_id=? and fromuser=?) or (chat_id=? and fromuser=?)) 
                    ORDER BY send_at DESC LIMIT 1
                   """, (id1, id2, id2, id1))
        return sq.fetchone()


@socket.on("get_chats")
def get_chats(data):
    with sqlite3.connect("data.db") as conn:
        sq = conn.cursor()
        sq.execute("SELECT chat_id,last_message FROM chats WHERE uid='"+str(conn_to_uid[request.sid])+"' ORDER BY last_message DESC")
        # print("hah", data)
        fresh = get_user_meta(conn_to_uid[request.sid]) [0]
        # dat = {int(conn_to_uid[request.sid]):{
        dat = [{
            "chat_id": conn_to_uid[request.sid],
            "last_message": "0",
            "name": "Saved Messages ",
            "username":fresh[2],
            "avatar":"null", 
            "lastMess": [conn_to_uid[request.sid], "text", "He"]           
        }]
        data = sq.fetchall()


        # z = 1
        for da in data:
            fresh = get_user_meta(da[0]) [0]
            mess = get_buddies_last_mess(conn_to_uid[request.sid], da[0])
            ar = {}
            ar["chat_id"] = da[0]
            ar["last_message"] = da[1]
            ar["name"] = fresh[1]
            ar["username"] = fresh[2]
            ar["avatar"] = fresh[3]
            ar["lastSeen"] = fresh[4]
            ar["lastMess"] = mess
            dat.append( ar)
            # dat[da[0]]= ar
            # z = z +1
        emit("get_chats", json.dumps(dat)) 

        # emit("get_chats",json.dumps(


@socket.on("openChat")
def get_meta(uid):
    try:
        print("openChat of", uid)
        fresh=  get_user_meta(uid) [0]
        # fresh = get_user_meta(da[0]) [0]
        ar = {}
        ar["chat_id"] = uid
        ar["last_message"] = 0
        ar["name"] = fresh[1]
        ar["username"] = fresh[2]
        ar["avatar"] = fresh[3]
        ar["last_online"] = fresh[4]
        # dat.append( ar)
        emit("openChat", json.dumps(ar))
    except Exception as e:
        print(e)


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
            return str( res[0][0] ) +":"+token_helper_logged_in(res[0][0], "Chuck Web v1.0", request.remote_addr)
            return "true buddy"
    return "failure", 500

@app.route("/logout", methods=["POST"])
def logout():
    with sqlite3.connect("data.db") as conn:
        c = conn.cursor()
        token = request.get_json()["token"]
        c.execute(f"DELETE FROM tokens WHERE token='{token}';")
        # res= c.fetchall()
        conn.commit()
    return "logged out"
        # if len(res) == 0:
            # return "wrong"
        # else: 
            # print(res[0])
            # return token_helper_logged_in(res[0][0], "Chuck Web v1.0", request.remote_addr)
            # return "true buddy"


if __name__ == '__main__':
    db_init() #move it to later func 
    db = db_connection()
    print("Starting websocket server")
    if (len(sys.argv)) == 2:
        if sys.argv[1].lower() == "ssl":
            print("loading ssl")
            import eventlet
            eventlet.monkey_patch() 
            ssl_context = ('/etc/letsencrypt/live/chuck127.easterndns.com/fullchain.pem',
                '/etc/letsencrypt/live/chuck127.easterndns.com/privkey.pem')
            socket.run(app, port=1080, host="0.0.0.0", debug=True, use_reloader=True, certfile=ssl_context[0], keyfile=ssl_context[1], log_output=True)
    else:
        print("no ssl")
        # socket.run(app, port=5000, allow_unsafe_werkzeug=True)
        socket.run(app, port=5000, host="0.0.0.0", debug=True, use_reloader=True)

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
        
