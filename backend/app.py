from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

def init_db():
    conn = sqlite3.connect("bookmarks.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route('/api/bookmarks', methods=['POST'])
def add_bookmark():
    data = request.json
    conn = sqlite3.connect("bookmarks.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bookmarks (title, url) VALUES (?, ?)",
                   (data['title'], data['url']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Added"}), 201

@app.route('/api/bookmarks', methods=['GET'])
def get_bookmarks():
    conn = sqlite3.connect("bookmarks.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookmarks")
    rows = cursor.fetchall()
    conn.close()

    bookmarks = []
    for row in rows:
        bookmarks.append({
            "id": row[0],
            "title": row[1],
            "url": row[2]
        })

    return jsonify(bookmarks)

@app.route('/api/bookmarks/<int:id>', methods=['DELETE'])
def delete_bookmark(id):
    conn = sqlite3.connect("bookmarks.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bookmarks WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted"})

@app.route('/api/bookmarks/<int:id>', methods=['PUT'])
def update_bookmark(id):
    data = request.json
    conn = sqlite3.connect("bookmarks.db")
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE bookmarks SET title=?, url=? WHERE id=?",
        (data['title'], data['url'], id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Updated"})

if __name__ == "__main__":
    app.run(debug=True)
    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000)