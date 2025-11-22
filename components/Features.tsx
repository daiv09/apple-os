// demo.tsx

import {
  ResourceCardsGrid,
  ResourceCardItem,
} from "@/components/ui/cards-grid";

// Sample data for the resource cards
const resourceData: ResourceCardItem[] = [
  {
    iconSrc:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-tRfo11d3TVT3JA1CtlD6iR8HZCvIQM.png&w=320&q=75",
    title: "SOPs",
    lastUpdated: "29 April 2025",
    href: "#",
  },
  {
    iconSrc:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-fs2N6IIs4VkGZQpjrS17tAgnWBFkbl.png&w=320&q=75",
    title: "Contracts",
    lastUpdated: "29 April 2025",
    href: "#",
  },
  {
    iconSrc:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-uqbQgvm8wfMxwP35nXRvS4ZteqmoCU.png&w=320&q=75",
    title: "Templates",
    lastUpdated: "29 April 2025",
    href: "#",
  },
  {
    iconSrc:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-vSXxF8u21GdIWRr8AtFn5sK74jIZN8.png&w=320&q=75",
    title: "Policies",
    lastUpdated: "29 April 2025",
    href: "#",
  },
  {
    iconSrc:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-OcGyav7XXTTVq0fDXxzmOVek6Noq7s.png&w=320&q=75",
    title: "Knowledge Base",
    lastUpdated: "29 April 2025",
    href: "#",
  },
  {
    iconSrc:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-5zVOONIN28dJticozuMBCoSEjaw6VA.png&w=320&q=75",
    title: "Archive",
    lastUpdated: "29 April 2025",
    href: "#",
  },
];

const ResourceGrid = () => {
  return (
    <div className="w-full max-w-6xl p-4 md:p-8 pt-10 md:pt-16">
      <h1
        className="
    text-3xl md:text-4xl 
    font-bold 
    text-center 
    mb-10 
    transition-all 
    duration-300 
    hover:scale-105 
    hover:text-primary
  "
      >
        Working on
      </h1>
      <ResourceCardsGrid items={resourceData} />
    </div>
  );
};

export default ResourceGrid;
