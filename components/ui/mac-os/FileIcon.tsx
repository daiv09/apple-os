"use client";

import React from "react";
import Image from "next/image";

interface FileIconProps {
  type: "folder" | "file";
  extension?: string;
  customIcon?: string; // emoji or custom symbol
  size?: "sm" | "md" | "lg";
}

const FileIcon: React.FC<FileIconProps> = ({
  type,
  extension,
  customIcon,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const folderIconSizes = {
    sm: 28,
    md: 40,
    lg: 56,
  };

  // If a custom emoji icon is provided, use it.
  if (customIcon && !customIcon.startsWith("/")) {
    return <span className={sizeClasses[size]}>{customIcon}</span>;
  }

  // FOLDER ICON → Always use folder.png
  if (type === "folder") {
    return (
      <Image
        src="/folder.png"
        alt="Folder Icon"
        width={folderIconSizes[size]}
        height={folderIconSizes[size]}
      />
    );
  }

  // FILE ICONS
  const getFileIcon = () => {
    switch (extension?.toLowerCase()) {
      case "pdf":
        return "📄";
      case "txt":
      case "md":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "mp4":
      case "mov":
        return "🎥";
      case "mp3":
      case "wav":
        return "🎵";
      case "zip":
      case "rar":
        return "📦";
      case "tsx":
      case "ts":
      case "jsx":
      case "js":
        return "⚛️";
      case "html":
      case "css":
        return "🌐";
      case "docx":
      case "doc":
        return "📘";
      case "xlsx":
      case "xls":
        return "📗";
      case "pptx":
      case "ppt":
        return "📊";
      default:
        return "📄";
    }
  };

  return <span className={sizeClasses[size]}>{getFileIcon()}</span>;
};

export default FileIcon;
