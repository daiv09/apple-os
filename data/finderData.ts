import { FileItem } from '@/types/finder';

export const desktopItems: FileItem[] = [
  {
    id: 'folder-1',
    name: 'Projects',
    type: 'folder',
    icon: '/folder.png',
    dateModified: 'Nov 22, 2025',
  },
  {
    id: 'folder-2',
    name: 'Documents',
    type: 'folder',
    icon: '/folder.png',
    dateModified: 'Nov 20, 2025',
  },
  {
    id: 'folder-3',
    name: 'Photos',
    type: 'folder',
    icon: '/folder.png',
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
    id: "how-to-train-a-model",
    name: "How To Train a Model",
    type: "folder",
    icon: "/folder.png",
    dateModified: "Feb 19, 2026",
    content: "iOS App for Apple Swift Student Challenge: On-device image classification training."
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    type: "folder",
    icon: "/folder.png",
    dateModified: "Feb 19, 2026",
    content: "Personal portfolio website showcasing projects and skills, built with React and Tailwind CSS."
  },
  {
    id: "vui-system",
    name: "Voice-Based UI for Hands Free Data-Entry for Automation in Workplaces",
    type: "folder",
    icon: "/folder.png",
    dateModified: "Jun 2025",
    content: "88.8% accurate real-time speech-to-text system using Web Speech API and WIT.AI[cite: 31, 33]."
  },
  {
    id: "graph-rag",
    name: "Neo4j GraphRAG",
    type: "folder",
    icon: "/folder.png",
    dateModified: "Jan 2026",
    content: "Knowledge graph using Neo4j and LangChain for semantic data retrieval[cite: 41, 43, 44]."
  },
  {
    id: "clip-node",
    name: "ClipNode",
    type: "file",
    extension: "js",
    icon: "/file-icon.png", 
    dateModified: "Feb 17, 2026",
    content: "Chrome extension for managing clipboard history."
  },
  {
    id: "typing-master",
    name: "Typing Master",
    type: "file",
    extension: "cpp",
    icon: "/file-icon.png",
    dateModified: "Feb 05, 2026",
    content: "Object-Oriented Programming (OOP) game developed in C++."
  }
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
  'Projects': projectsFolder,
};
