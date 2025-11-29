import React from 'react';
import FileIcon from './FileIcon';
import { FileItem as FileItemType } from '@/types/finder';

interface FileItemProps {
  item: FileItemType;
  onDoubleClick: (item: FileItemType) => void;
  onContextMenu?: (e: React.MouseEvent, item: FileItemType) => void;
  isSelected?: boolean;
  onClick?: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ 
  item, 
  onDoubleClick, 
  onContextMenu,
  isSelected = false,
  onClick 
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center p-3 rounded-lg
        cursor-pointer select-none transition-all duration-150
        hover:bg-white/10
        ${isSelected ? 'bg-blue-500/30 ring-2 ring-blue-400' : ''}
      `}
      onDoubleClick={() => onDoubleClick(item)}
      onContextMenu={(e) => onContextMenu?.(e, item)}
      onClick={onClick}
    >
      <FileIcon 
        type={item.type} 
        extension={item.extension}
        customIcon={item.icon}
        size="md"
      />
      <span className="mt-2 text-xs text-black text-center max-w-[80px] truncate">
        {item.name}
      </span>
    </div>
  );
};

export default FileItem;
