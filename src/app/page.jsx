"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [editText, setEditText] = useState("");

  const fetchApi = async () => {
    const api = "https://spammer-backend.netlify.app/api/posts";
    const response = await fetch(`${api}`, { cache: "no-store" });
    const fetchedNotes = await response.json();

    setNotes(fetchedNotes.posts);
    console.log(fetchedNotes);
  };

  useEffect(() => {
    fetchApi();
  }, [notes]);

  const postMethod = async (e) => {
    e.preventDefault();
    const api = "https://spammer-backend.netlify.app/api/posts";
    await fetch(`${api}`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });
    setText("");
  };

  const putMethod = async (e, note) => {
    e.preventDefault();
    console.log(note.id);
    const api = `https://spammer-backend.netlify.app/api/posts/${note.id}`;
    await fetch(`${api}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: `${editText}` }),
    });

    document.querySelector(`.edit-${note.id}`).style.display = "none";
    document.querySelector(`.message-${note.id}`).style.display = "block";
  };

  const deleteMethod = async (note) => {
    const api = `https://spammer-backend.netlify.app/api/posts/${note.id}`;
    await fetch(`${api}`, {
      method: "DELETE",
    });
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

    setEditText(note.text);
  };

  const likeMethod = async (note) => {
    const api = `https://spammer-backend.netlify.app/api/posts/${note.id}`;
    await fetch(`${api}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: note.likes + 1 }),
    });
  };

  const postChild = async (e, note) => {
    e.preventDefault();
    const api = `https://spammer-backend.netlify.app/api/posts/${note.id}/children`;
    await fetch(`${api}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        children: note.children.push({
          id: 1,
          text: "I'm a child",
          likes: 0,
          children: [],
          parentId: note.id,
        }),
      }),
    });
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
              {note.text}{" "}
              <span id="cluds">
                <div className="clud" onClick={() => likeMethod(note)}>
                  👍 {note.likes}
                </div>
                <div className="clud" onClick={() => showEditInput(note)}>
                  ✏️
                </div>
                <div className="clud" onClick={() => deleteMethod(note)}>
                  🗑️
                </div>
                <div className="clud" onClick={(e) => postChild(e, note)}>
                  💬
                </div>
              </span>
            </div>

            <div id="messages">
              <div>
                {note.children.map((child) => {
                  return <div onClick={postChild(note)}>{child.text}</div>;
                })}
              </div>
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
