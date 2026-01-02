import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaHome, FaUserFriends, FaBriefcase, 
  FaCommentDots, FaBell, FaCaretDown, FaUserCircle,
  FaLinkedin, FaEdit, FaPlus, FaBuilding, FaGraduationCap,
  FaMapMarkerAlt, FaGlobe, FaLink, FaTimes, FaCamera,
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  
  // State for user profile data (will be fetched from API)
  const [profileData, setProfileData] = useState({
    name: '',
    headline: '',
    location: '',
    connections: 0,
    profileViews: 0,
    postImpressions: 0,
    about: '',
    experience: [],
    education: [],
    skills: [],
    website: '',
    profileImage: '',
    bannerImage: '',
    email: '',
    phone: ''
  });

  // State for navbar dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for temporary edit data
  const [editData, setEditData] = useState({ 
    ...profileData,
    newSkill: '', // For adding new skills
    newExperience: { title: '', company: '', startDate: '', endDate: '', location: '', description: '', current: false },
    newEducation: { school: '', degree: '', field: '', startYear: '', endYear: '', description: '' }
  });

  // State for image upload
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch profile data from API
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    // Clear user data from localStorage/sessionStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Clear any authentication tokens/cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Navigate to login page
    navigate('/');
    
    // Optional: Show success message
    console.log('Successfully signed out');
  };

  // Mock API endpoint - replace with your actual API URL
  const API_URL = 'https://api.example.com/profile'; // Change this to your actual API

  const fetchProfileData = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch(API_URL);
      // const data = await response.json();
      
      // Mock data - replace with your API response
      const mockData = {
        name: 'Alex Johnson',
        headline: 'Senior Software Engineer at TechCorp',
        location: 'San Francisco, California',
        connections: 543,
        profileViews: 1287,
        postImpressions: 3256,
        about: 'Passionate software engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Previously worked at WebSolutions Inc where I led a team of 5 developers.',
        experience: [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'TechCorp',
            startDate: '2020-03',
            endDate: 'Present',
            location: 'San Francisco, CA',
            description: 'Lead development of customer-facing web applications using React and Node.js'
          },
          {
            id: 2,
            title: 'Software Engineer',
            company: 'WebSolutions Inc',
            startDate: '2017-06',
            endDate: '2020-02',
            location: 'New York, NY',
            description: 'Developed and maintained multiple client websites and web applications'
          }
        ],
        education: [
          {
            id: 1,
            school: 'Stanford University',
            degree: 'Master of Science',
            field: 'Computer Science',
            startYear: '2015',
            endYear: '2017',
            description: 'Specialized in Machine Learning and Web Technologies'
          },
          {
            id: 2,
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startYear: '2011',
            endYear: '2015',
            description: 'Graduated Magna Cum Laude'
          }
        ],
        skills: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'Python', 'Docker', 'Kubernetes', 'GraphQL'],
        website: 'https://alexjohnson.dev',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567'
      };

      setProfileData(mockData);
      setEditData(prev => ({
        ...prev,
        ...mockData,
        newSkill: '',
        newExperience: { title: '', company: '', startDate: '', endDate: '', location: '', description: '', current: false },
        newEducation: { school: '', degree: '', field: '', startYear: '', endYear: '', description: '' }
      }));
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // In real app, upload to API
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      // Replace with actual upload API
      // const response = await fetch(`${API_URL}/upload`, {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update edit data with new image
      setEditData(prev => ({
        ...prev,
        profileImage: previewUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle edit save
  const handleSave = async () => {
    try {
      // In production: API call to update profile
      // const response = await fetch(API_URL, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editData)
      // });
      
      // if (response.ok) {
      //   const updatedData = await response.json();
      //   setProfileData(updatedData);
      // }
      
      // For now, just update local state
      setProfileData({ ...editData });
      setIsEditing(false);
      
      // Reset image preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview('');
      }
      
      console.log('Profile saved:', editData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Handle input changes in edit mode
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle experience changes
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...editData.experience];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setEditData(prev => ({
      ...prev,
      experience: updatedExperiences
    }));
  };

  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...editData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setEditData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  // Add new experience
  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      ...editData.newExperience
    };
    setEditData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp],
      newExperience: { title: '', company: '', startDate: '', endDate: '', location: '', description: '', current: false }
    }));
  };

  // Add new education
  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      ...editData.newEducation
    };
    setEditData(prev => ({
      ...prev,
      education: [...prev.education, newEdu],
      newEducation: { school: '', degree: '', field: '', startYear: '', endYear: '', description: '' }
    }));
  };

  // Add new skill
  const addSkill = () => {
    if (editData.newSkill.trim()) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  // Remove experience
  const removeExperience = (index) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Remove education
  const removeEducation = (index) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Remove skill
  const removeSkill = (index) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // LinkedIn-like navbar component
  const Navbar = () => (
    <nav className="navbar">
      <div className="navbar-left">
        <FaLinkedin className="linkedin-logo" size={40} color="#0A66C2" />
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
          />
        </div>
      </div>
      
      <div className="navbar-center">
        <NavItem icon={<FaHome />} label="Home" active={false} />
        <NavItem icon={<FaUserFriends />} label="My Network" active={false} />
        <NavItem icon={<FaBriefcase />} label="Jobs" active={false} />
        <NavItem icon={<FaCommentDots />} label="Messaging" active={false} />
        <NavItem icon={<FaBell />} label="Notifications" active={false} />
        
        {/* Me dropdown */}
        <div className="nav-item" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="nav-icon">
            <img 
              src={profileData.profileImage || <FaUserCircle size={24} />} 
              alt="Profile" 
              className="nav-profile-img"
            />
            <FaCaretDown size={12} />
          </div>
          <span className="nav-label">Me</span>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <img src={profileData.profileImage} alt="Profile" className="dropdown-profile-img" />
                <div>
                  <h4>{profileData.name}</h4>
                  <p>{profileData.headline}</p>
                </div>
              </div>
              <div className="dropdown-item" onClick={() => navigate('/profile')}>
                View Profile
              </div>
              <div className="dropdown-item">Account</div>
              <div className="dropdown-item">Settings & Privacy</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item">Manage</div>
              <div className="dropdown-item" onClick={() => {
                setIsEditing(true);
                setIsDropdownOpen(false);
              }}>
                <FaEdit /> Edit Profile
              </div>
              <div className="dropdown-item signout-item" onClick={handleSignOut}>
                <FaSignOutAlt /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  const NavItem = ({ icon, label, active }) => (
    <div className={`nav-item ${active ? 'active' : ''}`}>
      <div className="nav-icon">{icon}</div>
      <span className="nav-label">{label}</span>
    </div>
  );

  return (
    <div className="profile-container">
      <Navbar />
      
      <div className="profile-content">
        {/* Profile Header/Banner */}
        <div className="profile-header">
          <div className="profile-banner">
            <img 
              src={profileData.bannerImage || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'} 
              alt="Banner" 
              className="banner-image"
            />
            <div className="profile-image-container">
              <div className="profile-image-wrapper">
                <img 
                  src={isEditing && imagePreview ? imagePreview : profileData.profileImage} 
                  alt={profileData.name}
                  className="profile-image"
                />
                {isEditing && (
                  <div className="image-upload-container">
                    <label htmlFor="profile-image-upload" className="image-upload-btn">
                      <FaCamera /> Change Photo
                    </label>
                    <input 
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                    {isUploading && <div className="uploading-text">Uploading...</div>}
                  </div>
                )}
              </div>
              {!isEditing && (
                <button 
                  className="edit-profile-btn"
                  onClick={() => {
                    setEditData({ 
                      ...profileData,
                      newSkill: '',
                      newExperience: { title: '', company: '', startDate: '', endDate: '', location: '', description: '', current: false },
                      newEducation: { school: '', degree: '', field: '', startYear: '', endYear: '', description: '' }
                    });
                    setIsEditing(true);
                  }}
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>
          
          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <h3>Edit Profile Information</h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Headline</label>
                    <input 
                      type="text" 
                      value={editData.headline}
                      onChange={(e) => handleInputChange('headline', e.target.value)}
                      placeholder="e.g., Senior Software Engineer at Company"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      value={editData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., San Francisco, California"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Website</label>
                    <input 
                      type="url" 
                      value={editData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>About</label>
                    <textarea 
                      value={editData.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      rows="5"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  {/* Experience Section */}
                  <div className="form-section full-width">
                    <h4>Experience</h4>
                    {editData.experience.map((exp, index) => (
                      <div key={exp.id} className="edit-item">
                        <div className="form-row">
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                            placeholder="Job Title"
                            className="form-input"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            placeholder="Company"
                            className="form-input"
                          />
                        </div>
                        <div className="form-row">
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                            placeholder="Start Date (YYYY-MM)"
                            className="form-input"
                          />
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                            placeholder="End Date (YYYY-MM or Present)"
                            className="form-input"
                          />
                        </div>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                          placeholder="Location"
                          className="form-input full-width"
                        />
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          placeholder="Description"
                          rows="3"
                          className="form-textarea full-width"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeExperience(index)}
                          className="remove-btn"
                        >
                          <FaTimes /> Remove
                        </button>
                      </div>
                    ))}
                    
                    <div className="add-item-form">
                      <h5>Add New Experience</h5>
                      <div className="form-row">
                        <input
                          type="text"
                          value={editData.newExperience.title}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            newExperience: { ...prev.newExperience, title: e.target.value }
                          }))}
                          placeholder="Job Title"
                          className="form-input"
                        />
                        <input
                          type="text"
                          value={editData.newExperience.company}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            newExperience: { ...prev.newExperience, company: e.target.value }
                          }))}
                          placeholder="Company"
                          className="form-input"
                        />
                      </div>
                      <div className="form-row">
                        <input
                          type="text"
                          value={editData.newExperience.startDate}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            newExperience: { ...prev.newExperience, startDate: e.target.value }
                          }))}
                          placeholder="Start Date"
                          className="form-input"
                        />
                        <input
                          type="text"
                          value={editData.newExperience.endDate}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            newExperience: { ...prev.newExperience, endDate: e.target.value }
                          }))}
                          placeholder="End Date"
                          className="form-input"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={addExperience}
                        className="add-btn"
                      >
                        <FaPlus /> Add Experience
                      </button>
                    </div>
                  </div>
                  
                  {/* Education Section */}
                  <div className="form-section full-width">
                    <h4>Education</h4>
                    {editData.education.map((edu, index) => (
                      <div key={edu.id} className="edit-item">
                        <div className="form-row">
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                            placeholder="School/University"
                            className="form-input"
                          />
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            placeholder="Degree"
                            className="form-input"
                          />
                        </div>
                        <div className="form-row">
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                            placeholder="Field of Study"
                            className="form-input"
                          />
                          <input
                            type="text"
                            value={edu.startYear}
                            onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                            placeholder="Start Year"
                            className="form-input"
                          />
                          <input
                            type="text"
                            value={edu.endYear}
                            onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                            placeholder="End Year"
                            className="form-input"
                          />
                        </div>
                        <textarea
                          value={edu.description}
                          onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                          placeholder="Description"
                          rows="2"
                          className="form-textarea full-width"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeEducation(index)}
                          className="remove-btn"
                        >
                          <FaTimes /> Remove
                        </button>
                      </div>
                    ))}
                    
                    <div className="add-item-form">
                      <h5>Add New Education</h5>
                      <div className="form-row">
                        <input
                          type="text"
                          value={editData.newEducation.school}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            newEducation: { ...prev.newEducation, school: e.target.value }
                          }))}
                          placeholder="School/University"
                          className="form-input"
                        />
                        <input
                          type="text"
                          value={editData.newEducation.degree}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            newEducation: { ...prev.newEducation, degree: e.target.value }
                          }))}
                          placeholder="Degree"
                          className="form-input"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={addEducation}
                        className="add-btn"
                      >
                        <FaPlus /> Add Education
                      </button>
                    </div>
                  </div>
                  
                  {/* Skills Section */}
                  <div className="form-section full-width">
                    <h4>Skills</h4>
                    <div className="skills-edit-container">
                      {editData.skills.map((skill, index) => (
                        <div key={index} className="skill-edit-item">
                          <span>{skill}</span>
                          <button 
                            type="button" 
                            onClick={() => removeSkill(index)}
                            className="skill-remove-btn"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="add-skill-form">
                      <input
                        type="text"
                        value={editData.newSkill}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          newSkill: e.target.value
                        }))}
                        placeholder="Add a skill"
                        className="skill-input"
                      />
                      <button 
                        type="button" 
                        onClick={addSkill}
                        className="add-skill-btn"
                      >
                        <FaPlus /> Add
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSave} disabled={isUploading}>
                    {isUploading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className="btn-cancel" onClick={() => setIsEditing(false)} disabled={isUploading}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="profile-name">{profileData.name}</h1>
                <p className="profile-headline">{profileData.headline}</p>
                <div className="profile-location">
                  <FaMapMarkerAlt /> {profileData.location}
                </div>
                {profileData.website && (
                  <div className="profile-website">
                    <FaLink /> <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a>
                  </div>
                )}
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">{profileData.connections}+</span>
                    <span className="stat-label">connections</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{profileData.profileViews}</span>
                    <span className="stat-label">profile views</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{profileData.postImpressions}</span>
                    <span className="stat-label">post impressions</span>
                  </div>
                </div>
                <div className="profile-actions">
                  <button className="btn-connect">Connect</button>
                  <button className="btn-message">Message</button>
                  <button className="btn-more">More</button>
                </div>
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="profile-main">
            {/* Left Column */}
            <div className="profile-left">
              {/* About Section */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>About</h3>
                </div>
                <p>{profileData.about}</p>
              </div>

              {/* Experience Section */}
              <div className="profile-section">
                <div className="section-header">
                  <h3><FaBuilding /> Experience</h3>
                </div>
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <h4>{exp.title}</h4>
                    <p className="company">{exp.company}</p>
                    <p className="duration">{exp.startDate} - {exp.endDate} · {exp.location}</p>
                    {exp.description && <p className="description">{exp.description}</p>}
                  </div>
                ))}
              </div>

              {/* Education Section */}
              <div className="profile-section">
                <div className="section-header">
                  <h3><FaGraduationCap /> Education</h3>
                </div>
                {profileData.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h4>{edu.school}</h4>
                    <p className="degree">{edu.degree} in {edu.field}</p>
                    <p className="year">{edu.startYear} - {edu.endYear}</p>
                    {edu.description && <p className="description">{edu.description}</p>}
                  </div>
                ))}
              </div>

              {/* Skills Section */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>Skills</h3>
                </div>
                <div className="skills-container">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Resources */}
            <div className="profile-right">
              <div className="profile-card">
                <h4>Profile views</h4>
                <div className="stat-large">{profileData.profileViews}</div>
                <p className="stat-desc">Who viewed your profile</p>
              </div>
              
              <div className="profile-card">
                <h4>Post impressions</h4>
                <div className="stat-large">{profileData.postImpressions}</div>
                <p className="stat-desc">Impressions of your posts</p>
              </div>
              
              <div className="profile-card">
                <h4>Resources</h4>
                <ul className="resources-list">
                  <li>Creator mode</li>
                  <li>My items</li>
                  <li>Language</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;