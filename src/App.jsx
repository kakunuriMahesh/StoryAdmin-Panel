import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyStories from './pages/MyStories';
import StoryForm from './components/StoryForm';
import PartForm from './components/PartForm';

function App() {
  const [stories, setStories] = useState([]); // Original stories from backend
  const [filteredStories, setFilteredStories] = useState([]); // Filtered stories for display
  const [modal, setModal] = useState({ show: false, message: '' });
  const navigate = useNavigate();

  // Fetch stories on mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('https://bharat-story-backend.vercel.app/api/stories');
        setStories(response.data);
        setFilteredStories(response.data); // Initialize filtered stories
      } catch (error) {
        console.error('Error fetching stories:', error);
        setModal({ show: true, message: 'Failed to load stories' });
        setTimeout(() => setModal({ show: false, message: '' }), 3000);
      }
    };
    fetchStories();
  }, []);

  // Add a new story with error handling
  const addStory = async (newStory) => {
    const formData = new FormData();
    formData.append('nameEn', newStory.name.en);
    formData.append('nameTe', newStory.name.te);
    if (newStory.storyCoverImage) formData.append('storyCoverImage', newStory.storyCoverImage);
    if (newStory.bannerImge) formData.append('bannerImge', newStory.bannerImge);

    try {
      const response = await axios.post('https://bharat-story-backend.vercel.app/api/stories', formData);
      setStories((prev) => [...prev, response.data.story]);
      setFilteredStories((prev) => [...prev, response.data.story]); // Update filtered stories
      setModal({ show: true, message: 'Story added successfully!' });
      setTimeout(() => {
        setModal({ show: false, message: '' });
        navigate('/add-part');
      }, 1500);
    } catch (error) {
      console.error('Error adding story:', error.response?.data || error.message);
      setModal({ show: true, message: `Failed to add story: ${error.response?.data?.details || 'Unknown error'}` });
      setTimeout(() => setModal({ show: false, message: '' }), 3000);
    }
  };

  // Add a new part with error handling
  const addPart = async (storyName, newPart) => {
    const formData = new FormData();
    const story = stories.find((s) => s.name.en === storyName);
    formData.append('storyId', story.id);
    Object.entries(newPart).forEach(([key, value]) => {
      if (key !== 'part' && key !== 'thumbnailImage' && key !== 'coverImage') {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => 
            formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`, subValue));
        } else {
          formData.append(key, value);
        }
      }
    });
    if (newPart.thumbnailImage) formData.append('thumbnailImage', newPart.thumbnailImage);
    if (newPart.coverImage) formData.append('coverImage', newPart.coverImage);
    newPart.part.forEach((p, i) => {
      Object.entries(p).forEach(([key, value]) => {
        if (key !== 'image') {
          if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => 
              formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}${i}`, subValue));
          } else {
            formData.append(`${key}${i}`, value);
          }
        }
      });
      if (p.image) formData.append(`partImage${i}`, p.image);
    });

    console.log('Sending formData for addPart:'); // Debug payload
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.post('https://bharat-story-backend.vercel.app/api/parts', formData);
      const updatedStories = stories.map((s) =>
        s.id === story.id ? { ...s, parts: { card: [...s.parts.card, response.data.part] } } : s
      );
      setStories(updatedStories);
      setFilteredStories(updatedStories); // Update filtered stories
      setModal({ show: true, message: 'Part added successfully!' });
      setTimeout(() => setModal({ show: false, message: '' }), 1500);
    } catch (error) {
      console.error('Error adding part:', error.response?.data || error.message);
      setModal({ show: true, message: `Failed to add part: ${error.response?.data?.details || 'Unknown error'}` });
      setTimeout(() => setModal({ show: false, message: '' }), 3000);
    }
  };

  // Update an existing part with error handling
  const updatePart = async (storyName, partId, updatedPart) => {
    const formData = new FormData();
    const story = stories.find((s) => s.name.en === storyName);
    formData.append('storyId', story.id);
    formData.append('partId', partId);
    Object.entries(updatedPart).forEach(([key, value]) => {
      if (key !== 'part' && key !== 'thumbnailImage' && key !== 'coverImage') {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => 
            formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`, subValue));
        } else {
          formData.append(key, value);
        }
      }
    });
    if (updatedPart.thumbnailImage) formData.append('thumbnailImage', updatedPart.thumbnailImage);
    if (updatedPart.coverImage) formData.append('coverImage', updatedPart.coverImage);
    updatedPart.part.forEach((p, i) => {
      Object.entries(p).forEach(([key, value]) => {
        if (key !== 'image') {
          if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => 
              formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}${i}`, subValue));
          } else {
            formData.append(`${key}${i}`, value);
          }
        }
      });
      if (p.image) formData.append(`partImage${i}`, p.image);
    });

    console.log('Sending formData for updatePart:'); // Debug payload
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.post('https://bharat-story-backend.vercel.app/api/parts', formData);
      const updatedStories = stories.map((s) =>
        s.id === story.id
          ? { ...s, parts: { card: s.parts.card.map((p) => (p.id === partId ? response.data.part : p)) } }
          : s
      );
      setStories(updatedStories);
      setFilteredStories(updatedStories); // Update filtered stories
      setModal({ show: true, message: 'Part updated successfully!' });
      setTimeout(() => setModal({ show: false, message: '' }), 1500);
    } catch (error) {
      console.error('Error updating part:', error.response?.data || error.message);
      setModal({ show: true, message: `Failed to update part: ${error.response?.data?.details || 'Unknown error'}` });
      setTimeout(() => setModal({ show: false, message: '' }), 3000);
    }
  };

  // Delete a part with error handling
  const deletePart = async (storyName, partId) => {
    const story = stories.find((s) => s.name.en === storyName);
    try {
      await axios.delete(`https://bharat-story-backend.vercel.app/api/parts/${story.id}/${partId}`);
      const updatedStories = stories.map((s) =>
        s.id === story.id
          ? { ...s, parts: { card: s.parts.card.filter((p) => p.id !== partId) } }
          : s
      );
      setStories(updatedStories);
      setFilteredStories(updatedStories); // Update filtered stories
      setModal({ show: true, message: 'Part deleted successfully!' });
      setTimeout(() => setModal({ show: false, message: '' }), 1500);
    } catch (error) {
      console.error('Error deleting part:', error.response?.data || error.message);
      setModal({ show: true, message: `Failed to delete part: ${error.response?.data?.details || 'Unknown error'}` });
      setTimeout(() => setModal({ show: false, message: '' }), 3000);
    }
  };

  // Handle search from Navbar
  const handleSearch = (selectedStory, query) => {
    if (!query) {
      setFilteredStories(stories); // Reset to all stories if query is empty
      return;
    }
    if (selectedStory) {
      // Filter within selected story
      const story = stories.find((s) => s.name.en === selectedStory);
      const filteredParts = story.parts.card.filter((p) =>
        p.title.en.toLowerCase().includes(query.toLowerCase()) ||
        p.part.some((subPart) => subPart.heading.en.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredStories(stories.map((s) =>
        s.name.en === selectedStory ? { ...s, parts: { card: filteredParts } } : s
      ));
    } else {
      // Filter across all stories
      const filtered = stories.map((s) => ({
        ...s,
        parts: {
          card: s.parts.card.filter((p) =>
            p.title.en.toLowerCase().includes(query.toLowerCase()) ||
            p.part.some((subPart) => subPart.heading.en.toLowerCase().includes(query.toLowerCase()))
          )
        }
      })).filter((s) => s.parts.card.length > 0 || s.name.en.toLowerCase().includes(query.toLowerCase()));
      setFilteredStories(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar stories={stories} onSearch={handleSearch} /> {/* Pass onSearch to Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-stories" element={<MyStories stories={filteredStories} />} /> {/* Use filteredStories */}
        <Route path="/add-story" element={<StoryForm addStory={addStory} />} />
        <Route
          path="/add-part"
          element={<PartForm stories={stories} addPart={addPart} updatePart={updatePart} deletePart={deletePart} />}
        />
      </Routes>
      {modal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg font-semibold">{modal.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import MyStories from './pages/MyStories';
// import StoryForm from './components/StoryForm';
// import PartForm from './components/PartForm';

// function App() {
//   const [stories, setStories] = useState([]);
//   const [modal, setModal] = useState({ show: false, message: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchStories = async () => {
//       const response = await axios.get('https://bharat-story-backend.vercel.app/api/stories');
//       setStories(response.data);
//     };
//     fetchStories();
//   }, []);

//   const addStory = async (newStory) => {
//     const formData = new FormData();
//     formData.append('nameEn', newStory.name.en);
//     formData.append('nameTe', newStory.name.te);
//     if (newStory.storyCoverImage) formData.append('storyCoverImage', newStory.storyCoverImage);
//     if (newStory.bannerImge) formData.append('bannerImge', newStory.bannerImge);

//     const response = await axios.post('https://bharat-story-backend.vercel.app/api/stories', formData);
//     setStories((prev) => [...prev, response.data.story]);
//     setModal({ show: true, message: 'Story added successfully!' });
//     setTimeout(() => {
//       setModal({ show: false, message: '' });
//       navigate('/add-part');
//     }, 1500);
//   };

//   const addPart = async (storyName, newPart) => {
//     const formData = new FormData();
//     const story = stories.find((s) => s.name.en === storyName);
//     formData.append('storyId', story.id);
//     Object.entries(newPart).forEach(([key, value]) => {
//       if (key !== 'part' && key !== 'thumbnailImage' && key !== 'coverImage') {
//         if (typeof value === 'object') {
//           Object.entries(value).forEach(([subKey, subValue]) => formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`, subValue));
//         } else {
//           formData.append(key, value);
//         }
//       }
//     });
//     if (newPart.thumbnailImage) formData.append('thumbnailImage', newPart.thumbnailImage);
//     if (newPart.coverImage) formData.append('coverImage', newPart.coverImage);
//     newPart.part.forEach((p, i) => {
//       Object.entries(p).forEach(([key, value]) => {
//         if (key !== 'image') {
//           if (typeof value === 'object') {
//             Object.entries(value).forEach(([subKey, subValue]) => formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}${i}`, subValue));
//           } else {
//             formData.append(`${key}${i}`, value);
//           }
//         }
//       });
//       if (p.image) formData.append(`partImage${i}`, p.image);
//     });
  
//     console.log('Sending formData for addPart:');
//     for (let pair of formData.entries()) {
//       console.log(`${pair[0]}: ${pair[1]}`);
//     }
  
//     const response = await axios.post('https://bharat-story-backend.vercel.app/api/parts', formData);
//     setStories((prev) =>
//       prev.map((s) =>
//         s.id === story.id ? { ...s, parts: { card: [...s.parts.card, response.data.part] } } : s
//       )
//     );
//     setModal({ show: true, message: 'Part added successfully!' });
//     setTimeout(() => setModal({ show: false, message: '' }), 1500);
//   };
  
//   const updatePart = async (storyName, partId, updatedPart) => {
//     const formData = new FormData();
//     const story = stories.find((s) => s.name.en === storyName);
//     formData.append('storyId', story.id);
//     formData.append('partId', partId);
//     Object.entries(updatedPart).forEach(([key, value]) => {
//       if (key !== 'part' && key !== 'thumbnailImage' && key !== 'coverImage') {
//         if (typeof value === 'object') {
//           Object.entries(value).forEach(([subKey, subValue]) => formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`, subValue));
//         } else {
//           formData.append(key, value);
//         }
//       }
//     });
//     if (updatedPart.thumbnailImage) formData.append('thumbnailImage', updatedPart.thumbnailImage);
//     if (updatedPart.coverImage) formData.append('coverImage', updatedPart.coverImage);
//     updatedPart.part.forEach((p, i) => {
//       Object.entries(p).forEach(([key, value]) => {
//         if (key !== 'image') {
//           if (typeof value === 'object') {
//             Object.entries(value).forEach(([subKey, subValue]) => formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}${i}`, subValue));
//           } else {
//             formData.append(`${key}${i}`, value);
//           }
//         }
//       });
//       if (p.image) formData.append(`partImage${i}`, p.image);
//     });
  
//     console.log('Sending formData for updatePart:');
//     for (let pair of formData.entries()) {
//       console.log(`${pair[0]}: ${pair[1]}`);
//     }
  
//     const response = await axios.post('https://bharat-story-backend.vercel.app/api/parts', formData);
//     setStories((prev) =>
//       prev.map((s) =>
//         s.id === story.id
//           ? {
//               ...s,
//               parts: { card: s.parts.card.map((p) => (p.id === partId ? response.data.part : p)) },
//             }
//           : s
//       )
//     );
//     setModal({ show: true, message: 'Part updated successfully!' });
//     setTimeout(() => setModal({ show: false, message: '' }), 1500);
//   };

//   const deletePart = async (storyName, partId) => {
//     const story = stories.find((s) => s.name.en === storyName);
//     await axios.delete(`https://bharat-story-backend.vercel.app/api/parts/${story.id}/${partId}`);
//     setStories((prev) =>
//       prev.map((s) =>
//         s.id === story.id
//           ? { ...s, parts: { card: s.parts.card.filter((p) => p.id !== partId) } }
//           : s
//       )
//     );
//     setModal({ show: true, message: 'Part deleted successfully!' });
//     setTimeout(() => setModal({ show: false, message: '' }), 1500);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar stories={stories} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/my-stories" element={<MyStories stories={stories} />} />
//         <Route path="/add-story" element={<StoryForm addStory={addStory} />} />
//         <Route
//           path="/add-part"
//           element={<PartForm stories={stories} addPart={addPart} updatePart={updatePart} deletePart={deletePart} />}
//         />
//       </Routes>
//       {modal.show && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded shadow-lg">
//             <p className="text-lg font-semibold">{modal.message}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;



