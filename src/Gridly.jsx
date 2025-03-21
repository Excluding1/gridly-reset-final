
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button.jsx";

const LOCAL_STORAGE_KEY = "gridly-widgets";

const Gridly = () => {
  const [widgets, setWidgets] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setWidgets(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = (type) => {
    const newWidget = {
      id: Date.now(),
      type,
      x: 0,
      y: 0,
      w: 300,
      h: 150,
    };
    setWidgets([...widgets, newWidget]);
    setShowAddMenu(false);
  };

  const updateWidgetSize = (id, newW, newH) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, w: newW, h: newH } : w))
    );
  };

  return (
    <div className="min-h-screen bg-dot-grid-light dark:bg-dot-grid-dark bg-[length:20px_20px] transition-colors duration-300">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">Gridly</h1>
        <Button onClick={() => setShowAddMenu(!showAddMenu)}>
          + Add Widget
        </Button>
      </div>

      {showAddMenu && (
        <div className="p-4 flex gap-4">
          <Button onClick={() => addWidget("clock")}>Clock</Button>
          <Button onClick={() => addWidget("todo")}>To-Do</Button>
          <Button onClick={() => addWidget("notes")}>Notes</Button>
        </div>
      )}

      <div className="flex flex-wrap gap-4 p-4">
        {widgets.map((widget) => (
          <ResizableWidget
            key={widget.id}
            widget={widget}
            onResize={updateWidgetSize}
          />
        ))}
      </div>
    </div>
  );
};

const ResizableWidget = ({ widget, onResize }) => {
  const [size, setSize] = useState({ w: widget.w, h: widget.h });

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (e) => {
      const newW = Math.max(150, size.w + (e.clientX - startX));
      const newH = Math.max(100, size.h + (e.clientY - startY));
      setSize({ w: newW, h: newH });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onResize(widget.id, size.w, size.h);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <motion.div
      className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-md cursor-move overflow-hidden"
      drag
      style={{ width: size.w, height: size.h }}
      whileDrag={{ scale: 1.03 }}
    >
      <Widget type={widget.type} />
      <div
        onMouseDown={handleMouseDown}
        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-tr"
      ></div>
    </motion.div>
  );
};

const Widget = ({ type }) => {
  switch (type) {
    case "clock":
      return <div className="text-xl text-black dark:text-white">🕒 Clock Widget</div>;
    case "todo":
      return <div className="text-xl text-black dark:text-white">📋 To-Do List</div>;
    case "notes":
      return <div className="text-xl text-black dark:text-white">📝 Notes</div>;
    default:
      return <div>Unknown Widget</div>;
  }
};

export default Gridly;
