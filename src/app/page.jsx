"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [editText, setEditText] = useState("");

  const fetchApi = async () => {
    const api = "https://jsonplaceholder.typicode.com/posts";
    const response = await fetch(`${api}`, { cache: "no-store" });
    const fetchedNotes = await response.json();

    setNotes(fetchedNotes);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const postMethod = async (e) => {
    e.preventDefault();
    const api = "https://jsonplaceholder.typicode.com/posts";
    const response = await fetch(`${api}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: text }),
    });
    const data = await response.json();
    const newNotes = [...notes, data];
    setNotes(newNotes);
    setText("");
  };

  const putMethod = async (e, note) => {
    e.preventDefault();
    console.log(note.id);
    const api = `https://jsonplaceholder.typicode.com/posts/${note.id}`;
    const response = await fetch(`${api}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: `${editText}` }),
    });
    const data = await response.json();

    const newNotes = notes.map((n) => {
      if (n.id === note.id) {
        return data;
      }
      return n;
    });
    setNotes(newNotes);

   
      document.querySelector(`.edit-${note.id}`).style.display = "none";
      document.querySelector(`.message-${note.id}`).style.display = "block";
    
  };

  const deleteMethod = async (note) => {
    const api = `https://jsonplaceholder.typicode.com/posts/${note.id}`;
    const response = await fetch(`${api}`, {
      method: "DELETE",
    });
    const data = await response.json();
    const newNotes = notes.filter((n) => n.id !== note.id);
    setNotes(newNotes);
  };

  const showEditInput = (note) => {
    if (
      document.querySelector(`.message-${note.id}`).style.display !== "none"
    ) {
      document.querySelector(`.message-${note.id}`).style.display = "none";
    }
    if (document.querySelector(`.edit-${note.id}`).style.display !== "block") {
      document.querySelector(`.edit-${note.id}`).style.display = "block";
    }

    setEditText(note.title);
  };

  return (
    <main>
      <h1>Spammer</h1>
      <form onSubmit={postMethod}>
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="What's your message?"
        />
        <button>Post Message</button>
      </form>

      <div id="messages">
        {notes.map((note) => (
          <div className="message" key={note.id}>
            <div className={`message-${note.id}`}>
              {note.title}{" "}
              <span id="cluds">
                <div className="clud" onClick={() => showEditInput(note)}>
                  ✏️
                </div>
                <div className="clud" onClick={() => deleteMethod(note)}>
                  🗑️
                </div>
              </span>
            </div>

            <div className={`edit-${note.id}`} style={{ display: "none" }}>
              <form onSubmit={(e) => putMethod(e, note)}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button>Edit Message</button>
                <button>Cancel</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
