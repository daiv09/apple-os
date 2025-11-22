import { FolderData, FileItem } from '@/types/finder';

export const desktopItems: FileItem[] = [
  {
    id: 'folder-1',
    name: 'Projects',
    type: 'folder',
    icon: '📁',
    dateModified: 'Nov 22, 2025',
  },
  {
    id: 'folder-2',
    name: 'Documents',
    type: 'folder',
    icon: '📁',
    dateModified: 'Nov 20, 2025',
  },
  {
    id: 'folder-3',
    name: 'Photos',
    type: 'folder',
    icon: '📁',
    dateModified: 'Nov 18, 2025',
  },
  {
    id: 'file-1',
    name: 'Resume.pdf',
    type: 'file',
    icon: '📄',
    extension: 'pdf',
    size: '245 KB',
    dateModified: 'Nov 21, 2025',
  },
  {
    id: 'file-2',
    name: 'Notes.txt',
    type: 'file',
    icon: '📝',
    extension: 'txt',
    size: '12 KB',
    dateModified: 'Nov 22, 2025',
    content: 'Sample notes content...',
  },
];

export const projectsFolder: FileItem[] = [
  {
    id: 'project-1',
    name: 'Portfolio Website',
    type: 'folder',
    icon: '📁',
    dateModified: 'Nov 22, 2025',
  },
  {
    id: 'project-2',
    name: 'React App',
    type: 'folder',
    icon: '📁',
    dateModified: 'Nov 15, 2025',
  },
  {
    id: 'code-1',
    name: 'app.tsx',
    type: 'file',
    icon: '⚛️',
    extension: 'tsx',
    size: '8 KB',
    dateModified: 'Nov 22, 2025',
  },
];

export const documentsFolder: FileItem[] = [
  {
    id: 'doc-1',
    name: 'Report.docx',
    type: 'file',
    icon: '📘',
    extension: 'docx',
    size: '156 KB',
    dateModified: 'Nov 19, 2025',
  },
  {
    id: 'doc-2',
    name: 'Presentation.pptx',
    type: 'file',
    icon: '📊',
    extension: 'pptx',
    size: '2.3 MB',
    dateModified: 'Nov 18, 2025',
  },
];

export const photosFolder: FileItem[] = [
  {
    id: 'photo-1',
    name: 'Sunset.jpg',
    type: 'file',
    icon: '🖼️',
    extension: 'jpg',
    size: '1.2 MB',
    dateModified: 'Nov 10, 2025',
  },
  {
    id: 'photo-2',
    name: 'Mountains.png',
    type: 'file',
    icon: '🖼️',
    extension: 'png',
    size: '3.5 MB',
    dateModified: 'Nov 12, 2025',
  },
];

export const folderStructure: { [key: string]: FileItem[] } = {
  'Desktop': desktopItems,
  'Projects': projectsFolder,
  'Documents': documentsFolder,
  'Photos': photosFolder,
};
