import React from 'react';

interface FileIconProps {
  type: 'folder' | 'file';
  extension?: string;
  customIcon?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FileIcon: React.FC<FileIconProps> = ({ 
  type, 
  extension, 
  customIcon,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  if (customIcon) {
    return <span className={sizeClasses[size]}>{customIcon}</span>;
  }

  const getFileIcon = () => {
    if (type === 'folder') {
      return '📁';
    }

    switch (extension?.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'txt':
      case 'md':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'mp4':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'zip':
      case 'rar':
        return '📦';
      case 'tsx':
      case 'ts':
      case 'jsx':
      case 'js':
        return '⚛️';
      case 'html':
      case 'css':
        return '🌐';
      case 'docx':
      case 'doc':
        return '📘';
      case 'xlsx':
      case 'xls':
        return '📗';
      case 'pptx':
      case 'ppt':
        return '📊';
      default:
        return '📄';
    }
  };

  return <span className={sizeClasses[size]}>{getFileIcon()}</span>;
};

export default FileIcon;
