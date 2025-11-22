export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: string;
  extension?: string;
  size?: string;
  dateModified?: string;
  content?: string; // For file preview
}

export interface FolderData {
  id: string;
  name: string;
  items: FileItem[];
  path: string;
}
