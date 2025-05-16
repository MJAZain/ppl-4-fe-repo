import { useEffect } from "react";
import {
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColors = {
    success: "bg-green-200",
    error: "bg-red-200",
    info: "bg-blue-200",
    warning: "bg-yellow-200",
  };

  const textColors = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
  };

  const icons = {
    success: CheckIcon,
    error: XMarkIcon,
    info: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 text-center p-2 h-10 flex items-center justify-center space-x-3 ${bgColors[type]} ${textColors[type]}`}
    >
      <Icon className="h-6 w-6" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;
