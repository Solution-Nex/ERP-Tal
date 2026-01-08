import React from "react";

interface GroupListSidebarProps {
  isOpen: boolean;
  filteredList: string[];
  activeIndex: number;
  ListName: string;
  onSelect: (item: string) => void;
  onHover: (index: number) => void;
}

const SideList: React.FC<GroupListSidebarProps> = ({
  isOpen,
  filteredList,
  activeIndex,
  onSelect,
  onHover,
  ListName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-full max-w-sm bg-[#C5C6C7] border border-gray-500 h-full overflow-y-auto fixed top-10 right-5 z-50">
      <h2 className="text-center font-serif text-white text-xl py-1 bg-[#176EE8] w-full">
        List of {ListName}
      </h2>
      <ul>
        {filteredList.map((item, index) => (
          <li
            key={index}
            className={`px-2 py-1 cursor-pointer ${
              index === activeIndex
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-400"
            }`}
            onMouseEnter={() => onHover(index)}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent input blur
              onSelect(item);
            }}
          >
            {item}
          </li>
        ))}
        {filteredList.length === 0 && (
          <li className="px-2 py-1 text-gray-600 italic">No groups found</li>
        )}
      </ul>
    </div>
  );
};

export default SideList;
