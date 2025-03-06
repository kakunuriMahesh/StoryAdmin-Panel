import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";

const Navbar = ({ stories, onSearch }) => { // Added onSearch prop to pass search results to App
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStory, setSelectedStory] = useState("");
  const navigate = useNavigate();

  // Handle search input changes and pass to parent (App)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(selectedStory, e.target.value); // Call parent function with selected story and query
  };

  // Navigate to edit part when a search result is clicked
  const handleSearchSelect = (storyName, partId) => {
    navigate(`/add-part?story=${storyName}${partId ? `&partId=${partId}` : ""}`);
    setSearchQuery("");
    setSelectedStory("");
  };

  // Filter stories or parts based on search query (display only, logic moved to App)
  const filteredStories = stories.filter((story) =>
    selectedStory
      ? story.name.en === selectedStory && // If story selected, filter by that story
        (story.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
         story.parts.card.some(part => 
           part.title.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
           part.part.some(subPart => subPart.heading.en.toLowerCase().includes(searchQuery.toLowerCase()))
         ))
      : story.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || // Otherwise, search all stories
        story.parts.card.some(part => 
          part.title.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
          part.part.some(subPart => subPart.heading.en.toLowerCase().includes(searchQuery.toLowerCase()))
        )
  );

  return (
    <nav className="bg-blue-600 p-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
          Admin Panel
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center bg-white rounded p-2">
              <Search size={20} className="text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch} // Trigger search on input change
                placeholder="Search stories, titles, or headings..."
                className="outline-none p-1 text-black w-[100%]"
              />
              <select
                value={selectedStory}
                onChange={(e) => setSelectedStory(e.target.value)} // Select story to narrow search
                className="outline-none bg-transparent text-black"
              >
                <option value="">All Stories</option>
                {stories.map((story) => (
                  <option key={story.id} value={story.name.en}>
                    {story.name.en}
                  </option>
                ))}
              </select>
            </div>
            {searchQuery && (
              <div className="absolute top-12 left-0 bg-white shadow-lg rounded w-full max-h-60 overflow-y-auto">
                {filteredStories.length > 0 ? (
                  filteredStories.map((story) =>
                    story.parts.card.map((part) => (
                      <div
                        key={part.id}
                        onClick={() => handleSearchSelect(story.name.en, part.id)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {part.title.en} ({story.name.en})
                      </div>
                    ))
                  )
                ) : (
                  <div className="p-2 text-gray-500">No matching stories or parts</div>
                )}
              </div>
            )}
          </div>
          <Link
            to="/my-stories"
            className="text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded flex items-center gap-2"
          >
            <BookOpen size={20} /> My Stories ({stories.length})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Search, BookOpen, ChevronDown, X } from "lucide-react";

// const Navbar = ({ stories }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStory, setSelectedStory] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const filteredStories = stories.filter((story) =>
//     selectedStory
//       ? story.name.en === selectedStory &&
//         story.name.en.toLowerCase().includes(searchQuery.toLowerCase())
//       : story.name.en.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSearchSelect = (storyName, partId) => {
//     navigate(
//       `/add-part?story=${storyName}${partId ? `&partId=${partId}` : ""}`
//     );
//     setSearchQuery("");
//     setSelectedStory("");
//     setIsDropdownOpen(false);
//   };

//   return (
//     <nav className="bg-blue-600 p-4 shadow">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <Link
//           to="/"
//           className="text-white text-2xl font-bold flex items-center gap-2"
//         >
//           Admin Panel
//         </Link>
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <div className="flex items-center bg-white rounded p-2">
//               <Search size={20} className="text-gray-500" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search stories..."
//                 className="outline-none p-1 text-black w-[100%]"
//               />
//               <select
//                 value={selectedStory}
//                 onChange={(e) => setSelectedStory(e.target.value)}
//                 onClick={() => setIsDropdownOpen(true)}
//                 className="outline-none bg-transparent text-black"
//               >
//                 <option value="">All Stories</option>
//                 {stories.map((story) => (
//                   <option key={story.id} value={story.name.en}>
//                     {story.name.en}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {searchQuery && (
//               <div className="absolute top-12 left-0 bg-white shadow-lg rounded w-full max-h-60 overflow-y-auto">
//                 {filteredStories.length > 0 ? (
//                   filteredStories.map((story) =>
//                     story.parts.card.map((part) => (
//                       <div
//                         key={part.id}
//                         onClick={() =>
//                           handleSearchSelect(story.name.en, part.id)
//                         }
//                         className="p-2 hover:bg-gray-100 cursor-pointer"
//                       >
//                         {part.title.en} ({story.name.en})
//                       </div>
//                     ))
//                   )
//                 ) : (
//                   <div className="p-2 text-gray-500">No matching stories</div>
//                 )}
//               </div>
//             )}
//           </div>
//           <Link
//             to="/my-stories"
//             className="text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded flex items-center gap-2"
//           >
//             <BookOpen size={20} /> My Stories ({stories.length})
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
