import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, FaHome, FaUserFriends, FaBriefcase, 
  FaCommentDots, FaBell, FaCaretDown, FaUserCircle,
  FaLinkedin, FaEdit, FaPlus, FaBuilding, FaGraduationCap,
  FaMapMarkerAlt, FaGlobe, FaLink, FaTimes, FaCamera,
  FaSignOutAlt, FaEllipsisH, FaVolumeUp, FaVolumeMute,
  FaPlay, FaPause, FaRobot
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

// IMPORTANT: You need to create or verify this component exists
// If Connectimi_logo doesn't exist, replace with a logo component or remove
import Connectimi_logo from '../components/Connectimi_logo';

const Profile = () => {
  const navigate = useNavigate();
  const speechSynthesisRef = useRef(null);
  
  // State for user profile data
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
  
  // State for more options dropdown
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  
  // State for text-to-speech
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [profileSummary, setProfileSummary] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  
  // State for temporary edit data
  const [editData, setEditData] = useState({ 
    ...profileData,
    newSkill: '',
    newExperience: { title: '', company: '', startDate: '', endDate: '', location: '', description: '', current: false },
    newEducation: { school: '', degree: '', field: '', startYear: '', endYear: '', description: '' }
  });

  // State for image upload
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch profile data from API
  useEffect(() => {
    fetchProfileData();
    initializeSpeechSynthesis();
    
    // Cleanup function
    return () => {
      stopSpeaking();
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  // Initialize speech synthesis
  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      setIsSpeechSupported(true);
      
      // Load available voices
      const loadVoices = () => {
        const voices = speechSynthesisRef.current.getVoices();
        setAvailableVoices(voices);
        
        // Try to find a natural-sounding voice
        const preferredVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.includes('Google') || voice.name.includes('Samantha') || voice.name.includes('Daniel'))
        ) || voices[0];
        
        if (preferredVoice) {
          setSelectedVoice(preferredVoice);
        }
      };
      
      loadVoices();
      speechSynthesisRef.current.onvoiceschanged = loadVoices;
    } else {
      console.warn('Speech synthesis not supported in this browser');
      setIsSpeechSupported(false);
    }
  };

  // Generate AI summary of profile
  const generateProfileSummary = async () => {
    setIsSummarizing(true);
    
    try {
      // Simulate AI API call - Replace with actual AI service
      const aiSummary = await simulateAISummary(profileData);
      setProfileSummary(aiSummary);
      
      // Start speaking automatically after generation
      if (aiSummary && isSpeechSupported) {
        speakText(aiSummary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      // Fallback to manual summary
      const fallbackSummary = createManualSummary();
      setProfileSummary(fallbackSummary);
      if (isSpeechSupported) {
        speakText(fallbackSummary);
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  // Simulate AI summarization - Replace with actual API call
  const simulateAISummary = (profile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const summary = `Meet ${profile.name}, ${profile.headline}. 
        Based in ${profile.location}, ${profile.name.split(' ')[0]} has over ${Math.floor(profile.experience.length * 3)} years of professional experience.
        ${profile.about}
        
        Professional background includes: ${profile.experience.map(exp => 
          `${exp.title} at ${exp.company}`
        ).join(', ')}.
        
        Educational background: ${profile.education.map(edu => 
          `${edu.degree} from ${edu.school}`
        ).join(', ')}.
        
        Key skills include ${profile.skills.slice(0, 5).join(', ')} and more.
        ${profile.name.split(' ')[0]} has ${profile.connections} professional connections and their profile has been viewed ${profile.profileViews} times.`;
        
        resolve(summary);
      }, 1500);
    });
  };

  // Create manual summary as fallback
  const createManualSummary = () => {
    return `Profile Summary for ${profileData.name}. 
    ${profileData.headline} based in ${profileData.location}.
    ${profileData.about}
    
    Experience: ${profileData.experience.map(exp => 
      `${exp.title} at ${exp.company} from ${exp.startDate} to ${exp.endDate}`
    ).join('. ')}.
    
    Education: ${profileData.education.map(edu => 
      `${edu.degree} from ${edu.school}`
    ).join(', ')}.
    
    Skills: ${profileData.skills.slice(0, 8).join(', ')}.`;
  };

  // Text-to-speech functionality
  const speakText = (text) => {
    if (!speechSynthesisRef.current || !isSpeechSupported) {
      console.warn('Speech synthesis not available');
      return;
    }

    // Stop any ongoing speech
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Track progress
    let startTime = Date.now();
    const estimatedDuration = (text.length / 150) * 60 * 1000; // Rough estimate
    
    let progressInterval;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setSpeechProgress(0);
      startTime = Date.now();
    };
    
    // Update progress
    progressInterval = setInterval(() => {
      if (isSpeaking && !isPaused) {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
        setSpeechProgress(progress);
      }
    }, 100);
    
    utterance.onend = () => {
      clearInterval(progressInterval);
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgress(100);
      setTimeout(() => setSpeechProgress(0), 1000);
    };
    
    utterance.onerror = () => {
      clearInterval(progressInterval);
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgress(0);
    };
    
    speechSynthesisRef.current.speak(utterance);
  };

  const pauseSpeaking = () => {
    if (speechSynthesisRef.current && isSpeaking && isSpeechSupported) {
      speechSynthesisRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if (speechSynthesisRef.current && isPaused && isSpeechSupported) {
      speechSynthesisRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current && isSpeechSupported) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgress(0);
    }
  };

  const changeVoiceSpeed = (speed) => {
    setVoiceSpeed(speed);
    if (isSpeaking && profileSummary) {
      stopSpeaking();
      setTimeout(() => speakText(profileSummary), 100);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    stopSpeaking(); // Stop any ongoing speech
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/');
  };

  const fetchProfileData = async () => {
    try {
      // Mock data - replace with actual API call
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

    // Clean up previous preview URL if exists
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      // Clean up image preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview('');
      }
      
      setProfileData({ ...editData });
      setIsEditing(false);
      
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
        {/* IMPORTANT: If Connectimi_logo doesn't exist, replace with: */}
        {/* <div className="logo">Connectimi</div> */}
        <Connectimi_logo />
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
        <div className="nav-item me-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="nav-icon">
            <img 
              src={profileData.profileImage || "https://via.placeholder.com/32"} 
              alt="Profile" 
              className="nav-profile-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/32";
              }}
            />
            <FaCaretDown size={12} />
          </div>
          <span className="nav-label">Me</span>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <img 
                  src={profileData.profileImage || "https://via.placeholder.com/64"} 
                  alt="Profile" 
                  className="dropdown-profile-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/64";
                  }}
                />
                <div>
                  <h4>{profileData.name || 'User Name'}</h4>
                  <p>{profileData.headline || 'Your headline'}</p>
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
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={() => console.log(`Navigate to ${label}`)}>
      <div className="nav-icon">{icon}</div>
      <span className="nav-label">{label}</span>
    </div>
  );

  // Speech Controls Component
  const SpeechControls = () => (
    <div className="speech-controls">
      <div className="speech-header">
        <FaRobot className="ai-icon" />
        <h4>Profile Podcast</h4>
        {isSummarizing && <span className="summarizing-badge">Generating...</span>}
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${speechProgress}%` }}
        ></div>
      </div>
      
      <div className="speech-buttons">
        {isSpeaking ? (
          isPaused ? (
            <button className="speech-btn play-btn" onClick={resumeSpeaking}>
              <FaPlay /> Resume
            </button>
          ) : (
            <button className="speech-btn pause-btn" onClick={pauseSpeaking}>
              <FaPause /> Pause
            </button>
          )
        ) : (
          <button 
            className="speech-btn play-btn" 
            onClick={() => profileSummary ? speakText(profileSummary) : generateProfileSummary()}
            disabled={isSummarizing || !isSpeechSupported}
          >
            {isSummarizing ? 'Generating...' : <><FaPlay /> Listen to Profile</>}
          </button>
        )}
        
        <button className="speech-btn stop-btn" onClick={stopSpeaking} disabled={!isSpeechSupported}>
          <FaVolumeMute /> Stop
        </button>
      </div>
      
      <div className="speech-settings">
        <div className="speed-control">
          <label>Speed:</label>
          <div className="speed-options">
            {[0.5, 0.75, 1.0, 1.25, 1.5].map(speed => (
              <button
                key={speed}
                className={`speed-option ${voiceSpeed === speed ? 'active' : ''}`}
                onClick={() => changeVoiceSpeed(speed)}
                disabled={!isSpeechSupported}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
        
        {availableVoices.length > 0 && isSpeechSupported && (
          <div className="voice-selector">
            <label>Voice:</label>
            <select 
              value={selectedVoice ? selectedVoice.name : ''}
              onChange={(e) => {
                const voice = availableVoices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              disabled={!isSpeechSupported}
            >
              {availableVoices.filter(v => v.lang.includes('en')).map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name.replace('Microsoft ', '').replace('Google ', '').split(' - ')[0]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {!isSpeechSupported && (
        <div className="speech-warning">
          <p>Text-to-speech is not supported in your browser.</p>
        </div>
      )}
      
      {profileSummary && (
        <div className="summary-preview">
          <h5>Summary Preview:</h5>
          <p className="summary-text">{profileSummary.substring(0, 200)}...</p>
          <button 
            className="regenerate-btn"
            onClick={generateProfileSummary}
            disabled={isSummarizing || !isSpeechSupported}
          >
            <FaRobot /> Regenerate Summary
          </button>
        </div>
      )}
    </div>
  );

  // Complete Edit Form Component
  const EditForm = () => (
    <div className="edit-form">
      <h3>Edit Profile Information</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your name"
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
            placeholder="City, Country"
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={editData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
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
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>
        
        {/* Experience Section */}
        <div className="form-section full-width">
          <h4>Experience</h4>
          {editData.experience.map((exp, index) => (
            <div key={exp.id} className="form-row">
              <input
                type="text"
                placeholder="Title"
                value={exp.title}
                onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              />
              <input
                type="text"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="End Date"
                value={exp.endDate}
                onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                value={exp.location}
                onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeExperience(index)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Title"
              value={editData.newExperience.title}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newExperience: { ...prev.newExperience, title: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="Company"
              value={editData.newExperience.company}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newExperience: { ...prev.newExperience, company: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="Start Date"
              value={editData.newExperience.startDate}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newExperience: { ...prev.newExperience, startDate: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="End Date"
              value={editData.newExperience.endDate}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newExperience: { ...prev.newExperience, endDate: e.target.value }
              }))}
            />
            <button
              type="button"
              className="btn-add"
              onClick={addExperience}
            >
              <FaPlus /> Add
            </button>
          </div>
        </div>
        
        {/* Education Section */}
        <div className="form-section full-width">
          <h4>Education</h4>
          {editData.education.map((edu, index) => (
            <div key={edu.id} className="form-row">
              <input
                type="text"
                placeholder="School"
                value={edu.school}
                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={edu.field}
                onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
              />
              <input
                type="text"
                placeholder="Start Year"
                value={edu.startYear}
                onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
              />
              <input
                type="text"
                placeholder="End Year"
                value={edu.endYear}
                onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeEducation(index)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          
          <div className="form-row">
            <input
              type="text"
              placeholder="School"
              value={editData.newEducation.school}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newEducation: { ...prev.newEducation, school: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="Degree"
              value={editData.newEducation.degree}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newEducation: { ...prev.newEducation, degree: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={editData.newEducation.field}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newEducation: { ...prev.newEducation, field: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="Start Year"
              value={editData.newEducation.startYear}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newEducation: { ...prev.newEducation, startYear: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="End Year"
              value={editData.newEducation.endYear}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                newEducation: { ...prev.newEducation, endYear: e.target.value }
              }))}
            />
            <button
              type="button"
              className="btn-add"
              onClick={addEducation}
            >
              <FaPlus /> Add
            </button>
          </div>
        </div>
        
        {/* Skills Section */}
        <div className="form-section full-width">
          <h4>Skills</h4>
          <div className="skills-edit">
            {editData.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button
                  type="button"
                  className="skill-remove"
                  onClick={() => removeSkill(index)}
                >
                  <FaTimes />
                </button>
              </span>
            ))}
          </div>
          <div className="skill-input-container">
            <input
              type="text"
              placeholder="Add a skill"
              value={editData.newSkill}
              onChange={(e) => handleInputChange('newSkill', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button
              type="button"
              className="btn-add-skill"
              onClick={addSkill}
            >
              <FaPlus /> Add Skill
            </button>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button className="btn-save" onClick={handleSave} disabled={isUploading}>
          {isUploading ? 'Saving...' : 'Save Changes'}
        </button>
        <button className="btn-cancel" onClick={() => {
          setIsEditing(false);
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview('');
          }
        }} disabled={isUploading}>
          Cancel
        </button>
      </div>
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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80';
              }}
            />
            <div className="profile-image-container">
              <div className="profile-image-wrapper">
                <img 
                  src={isEditing && imagePreview ? imagePreview : (profileData.profileImage || 'https://via.placeholder.com/150')} 
                  alt={profileData.name}
                  className="profile-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
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
              <EditForm />
            ) : (
              <>
                <h1 className="profile-name">{profileData.name || 'User Name'}</h1>
                <p className="profile-headline">{profileData.headline || 'Your professional headline'}</p>
                <div className="profile-location">
                  <FaMapMarkerAlt /> {profileData.location || 'Location not specified'}
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
                  
                  {/* More button with dropdown */}
                  <div className="more-container">
                    <button 
                      className="btn-more"
                      onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                    >
                      <FaEllipsisH /> More
                    </button>
                    
                    {isMoreDropdownOpen && (
                      <div className="more-dropdown">
                        <div className="more-dropdown-item" onClick={generateProfileSummary}>
                          <FaRobot /> AI Profile Summary
                        </div>
                        <div className="more-dropdown-item" onClick={() => window.print()}>
                          Save as PDF
                        </div>
                        <div className="more-dropdown-item">
                          Share Profile
                        </div>
                        <div className="more-dropdown-divider"></div>
                        <div className="more-dropdown-item">
                          Report/Block
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Speech Controls Panel */}
                {(isSpeaking || isPaused || profileSummary) && (
                  <SpeechControls />
                )}
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
                <p>{profileData.about || 'No about information available.'}</p>
              </div>

              {/* Experience Section */}
              <div className="profile-section">
                <div className="section-header">
                  <h3><FaBuilding /> Experience</h3>
                </div>
                {profileData.experience.length > 0 ? (
                  profileData.experience.map((exp, index) => (
                    <div key={exp.id || index} className="experience-item">
                      <h4>{exp.title}</h4>
                      <p className="company">{exp.company}</p>
                      <p className="duration">{exp.startDate} - {exp.endDate} · {exp.location}</p>
                      {exp.description && <p className="description">{exp.description}</p>}
                    </div>
                  ))
                ) : (
                  <p>No experience information available.</p>
                )}
              </div>

              {/* Education Section */}
              <div className="profile-section">
                <div className="section-header">
                  <h3><FaGraduationCap /> Education</h3>
                </div>
                {profileData.education.length > 0 ? (
                  profileData.education.map((edu, index) => (
                    <div key={edu.id || index} className="education-item">
                      <h4>{edu.school}</h4>
                      <p className="degree">{edu.degree} in {edu.field}</p>
                      <p className="year">{edu.startYear} - {edu.endYear}</p>
                      {edu.description && <p className="description">{edu.description}</p>}
                    </div>
                  ))
                ) : (
                  <p>No education information available.</p>
                )}
              </div>

              {/* Skills Section */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>Skills</h3>
                </div>
                <div className="skills-container">
                  {profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))
                  ) : (
                    <p>No skills added yet.</p>
                  )}
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
                <h4>AI Features</h4>
                <div className="ai-features">
                  <button 
                    className="ai-feature-btn"
                    onClick={generateProfileSummary}
                    disabled={isSummarizing || !isSpeechSupported}
                  >
                    <FaRobot /> {isSummarizing ? 'Generating...' : 'Listen to Profile'}
                  </button>
                  <p className="ai-description">
                    Get an AI-generated podcast-style summary of your profile
                  </p>
                  {!isSpeechSupported && (
                    <p className="speech-warning-small">
                      Text-to-speech not supported in your browser
                    </p>
                  )}
                </div>
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