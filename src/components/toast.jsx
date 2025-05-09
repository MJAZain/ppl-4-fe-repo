import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className={`fixed top-10 z-50 px-4 py-3 rounded text-white shadow-lg  justify-center items-center ${bgColors[type]}`}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
