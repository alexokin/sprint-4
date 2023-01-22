import React, { useState } from "react";
import { addChecklist } from "../../store/actions/task.actions";

export function CheckList({task, groupId, board, setTaskDetailsModal}) {
  const [title, setTitle] = useState("Checklist");
  const [isAdding, setIsAdding] = useState(false);

function handleChange({target}) {
    const {value} = target
    setTitle(value)
}

function onAddChecklist(ev) {
    ev.preventDefault()
    addChecklist(title, task._id, groupId, board)
    setTaskDetailsModal(null)
}

  return (
    <section className="check-list">
      <div className="input-container">
        <form onSubmit={onAddChecklist}>
          <label htmlFor="addTitle">Title</label>
          <input
            autoFocus={window.innerWidth >= 1200}
            id="addTitle"
            type="text"
            value={title}
            onChange={handleChange}
          />
          <button className="blue btn">Add</button>
        </form>
      </div>
    </section>
  );
}