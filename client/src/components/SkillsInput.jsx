import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { filterSkills, MAX_SKILLS, MIN_CHARS_FOR_SUGGESTIONS } from '../constants/skillsConstants';

const SkillsInput = ({ skills = [], onChange, disabled = false, maxSkills = MAX_SKILLS }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle input change and filter suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length >= MIN_CHARS_FOR_SUGGESTIONS) {
      const filtered = filterSkills(value, skills);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Add skill
  const addSkill = (skill) => {
    if (!skill || !skill.trim()) return;
    
    const trimmedSkill = skill.trim();
    
    // Check if skill already exists (case-insensitive)
    const exists = skills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase());
    if (exists) {
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Check max skills limit
    if (skills.length >= maxSkills) {
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Add the skill
    const updatedSkills = [...skills, trimmedSkill];
    onChange(updatedSkills);
    
    // Reset input
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    onChange(updatedSkills);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    addSkill(suggestion);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        addSkill(inputValue);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          addSkill(suggestions[selectedIndex]);
        } else if (inputValue.trim()) {
          addSkill(inputValue);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {/* Input Field */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || skills.length >= maxSkills}
            placeholder={
              skills.length >= maxSkills
                ? `Maximum ${maxSkills} skills reached`
                : 'Type to search skills (e.g., JavaScript, React)...'
            }
            className="w-full pl-4 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
            >
              <div className="p-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      selectedIndex === index
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'hover:bg-blue-50 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{suggestion}</span>
                    {selectedIndex === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skills Count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">
          {skills.length} / {maxSkills} skills added
        </span>
        {skills.length > 0 && (
          <span className="text-blue-600 font-semibold">
            Click skill to remove
          </span>
        )}
      </div>

      {/* Selected Skills */}
      <AnimatePresence mode="popLayout">
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border-2 border-gray-100"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.03 }}
                className="group relative"
              >
                <button
                  type="button"
                  onClick={() => !disabled && removeSkill(skill)}
                  disabled={disabled}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:pr-3"
                >
                  <span>{skill}</span>
                  {!disabled && (
                    <X className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mr-2 group-hover:mr-0" />
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      {!disabled && (
        <p className="text-sm text-gray-500 italic">
          Tip: Start typing to see suggestions, use arrow keys to navigate, and press Enter to select
        </p>
      )}
    </div>
  );
};

export default SkillsInput;
