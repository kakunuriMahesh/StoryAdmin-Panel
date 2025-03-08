// src/components/StoryForm.jsx
import React, { useState } from 'react';

const StoryForm = ({ addStory }) => {
  const [formData, setFormData] = useState({
    nameEn: '',
    nameTe: '',
    nameHi: '',
    languages: [],
    storyCoverImage: null,
    bannerImge: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox' && name === 'languages') {
      const newLanguages = checked
        ? [...formData.languages, value]
        : formData.languages.filter((lang) => lang !== value);
      setFormData({ ...formData, languages: newLanguages });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const errors = [];
    formData.languages.forEach((lang) => {
      if (!formData[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`]) {
        errors.push(`Name (${lang}) is required`);
      }
    });
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      alert(`Please fill in all required fields:\n${errors.join('\n')}`);
      return;
    }

    const data = new FormData();
    data.append('nameEn', formData.nameEn);
    data.append('nameTe', formData.nameTe);
    data.append('nameHi', formData.nameHi);
    data.append('languages', JSON.stringify(formData.languages));
    if (formData.storyCoverImage) data.append('storyCoverImage', formData.storyCoverImage);
    if (formData.bannerImge) data.append('bannerImge', formData.bannerImge);

    addStory(data);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Add Story</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>English Name:</label>
          <input
            type="text"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
            className="border p-2 w-full"
            disabled={!formData.languages.includes('en')}
          />
        </div>
        <div>
          <label>Telugu Name:</label>
          <input
            type="text"
            name="nameTe"
            value={formData.nameTe}
            onChange={handleChange}
            className="border p-2 w-full"
            disabled={!formData.languages.includes('te')}
          />
        </div>
        <div>
          <label>Hindi Name:</label>
          <input
            type="text"
            name="nameHi"
            value={formData.nameHi}
            onChange={handleChange}
            className="border p-2 w-full"
            disabled={!formData.languages.includes('hi')}
          />
        </div>
        <div>
          <label>Languages:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="languages"
                value="en"
                checked={formData.languages.includes('en')}
                onChange={handleChange}
              />
              English
            </label>
            <label>
              <input
                type="checkbox"
                name="languages"
                value="te"
                checked={formData.languages.includes('te')}
                onChange={handleChange}
              />
              Telugu
            </label>
            <label>
              <input
                type="checkbox"
                name="languages"
                value="hi"
                checked={formData.languages.includes('hi')}
                onChange={handleChange}
              />
              Hindi
            </label>
          </div>
        </div>
        <div>
          <label>Story Cover Image:</label>
          <input type="file" name="storyCoverImage" onChange={handleChange} />
        </div>
        <div>
          <label>Banner Image:</label>
          <input type="file" name="bannerImge" onChange={handleChange} />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Story
        </button>
      </form>
    </div>
  );
};

export default StoryForm;

// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Image, Trash2 } from 'lucide-react';

// const StoryForm = ({ addStory }) => {
//   const location = useLocation();
//   const [formData, setFormData] = useState({ nameEn: '', nameTe: '', nameHi: '', storyCoverImage: null, bannerImge: null });
//   const [languages, setLanguages] = useState(location.state?.languages || ['en', 'te']);
//   const [imagePreviews, setImagePreviews] = useState({ storyCoverImage: null, bannerImge: null });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.storyCoverImage || !formData.bannerImge) {
//       alert('Please upload both Story Cover Image and Banner Image');
//       return;
//     }
//     const data = new FormData();
//     if (languages.includes('en')) data.append('nameEn', formData.nameEn);
//     if (languages.includes('te')) data.append('nameTe', formData.nameTe);
//     if (languages.includes('hi')) data.append('nameHi', formData.nameHi);
//     data.append('storyCoverImage', formData.storyCoverImage);
//     data.append('bannerImge', formData.bannerImge);
//     data.append('languages', JSON.stringify(languages));
//     addStory(data);
//   };

//   const handleImageChange = (field, e) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, [field]: file });
//     setImagePreviews({ ...imagePreviews, [field]: URL.createObjectURL(file) });
//   };

//   const removeImage = (field) => {
//     setFormData({ ...formData, [field]: null });
//     setImagePreviews({ ...imagePreviews, [field]: null });
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Add New Story</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="font-semibold">Languages:</label>
//           <div className="flex space-x-4">
//             <label><input type="checkbox" checked={languages.includes('en')} onChange={(e) => setLanguages(e.target.checked ? [...languages, 'en'] : languages.filter((l) => l !== 'en'))} /> English</label>
//             <label><input type="checkbox" checked={languages.includes('te')} onChange={(e) => setLanguages(e.target.checked ? [...languages, 'te'] : languages.filter((l) => l !== 'te'))} /> Telugu</label>
//             <label><input type="checkbox" checked={languages.includes('hi')} onChange={(e) => setLanguages(e.target.checked ? [...languages, 'hi'] : languages.filter((l) => l !== 'hi'))} /> Hindi</label>
//           </div>
//         </div>
//         {languages.includes('en') && (
//           <div className="mb-4">
//             <label className="flex items-center"><span className="font-semibold mr-2">Name (English):</span>
//               <input type="text" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} className="border p-2 w-full" />
//             </label>
//           </div>
//         )}
//         {languages.includes('te') && (
//           <div className="mb-4">
//             <label className="flex items-center"><span className="font-semibold mr-2">Name (Telugu):</span>
//               <input type="text" value={formData.nameTe} onChange={(e) => setFormData({ ...formData, nameTe: e.target.value })} className="border p-2 w-full" />
//             </label>
//           </div>
//         )}
//         {languages.includes('hi') && (
//           <div className="mb-4">
//             <label className="flex items-center"><span className="font-semibold mr-2">Name (Hindi):</span>
//               <input type="text" value={formData.nameHi} onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })} className="border p-2 w-full" />
//             </label>
//           </div>
//         )}
//         <div className="mb-4">
//           <label className="flex items-center"><Image className="mr-2" /> Story Cover Image:</label>
//           <input type="file" onChange={(e) => handleImageChange('storyCoverImage', e)} className="mb-2" />
//           {imagePreviews.storyCoverImage && (
//             <div className="flex items-center">
//               <img src={imagePreviews.storyCoverImage} alt="Preview" className="w-32 h-32 object-cover mr-2" />
//               <button type="button" onClick={() => removeImage('storyCoverImage')} className="text-red-500"><Trash2 /></button>
//             </div>
//           )}
//         </div>
//         <div className="mb-4">
//           <label className="flex items-center"><Image className="mr-2" /> Banner Image:</label>
//           <input type="file" onChange={(e) => handleImageChange('bannerImge', e)} className="mb-2" />
//           {imagePreviews.bannerImge && (
//             <div className="flex items-center">
//               <img src={imagePreviews.bannerImge} alt="Preview" className="w-32 h-32 object-cover mr-2" />
//               <button type="button" onClick={() => removeImage('bannerImge')} className="text-red-500"><Trash2 /></button>
//             </div>
//           )}
//         </div>
//         <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Story</button>
//       </form>
//     </div>
//   );
// };

// export default StoryForm;