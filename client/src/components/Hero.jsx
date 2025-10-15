import React, { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";
import { FiBriefcase, FiUsers, FiTrendingUp } from "react-icons/fi";
import { HERO_CONSTANTS } from "../constants/heroConstants.js";
import {
  handleSearch,
  handleTagClick,
  getAnimationConfig,
  getInteractionAnimation,
  getCssClasses,
  getBackgroundAnimationDelay,
  getTimingConfig
} from "../utils/heroUtils.js";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const searchRef = useRef(null);
  const [activeTag, setActiveTag] = useState(null);

  return (
    <motion.div
      {...getAnimationConfig('container')}
    >
      {/* Floating container with margin on all sides */}
      <section className={getCssClasses('MAIN_CONTAINER')}>
        {/* Modern gradient background with animated elements */}
        <div className={getCssClasses('GRADIENT_BACKGROUND')}>
          {/* Animated background elements */}
          <div className={getCssClasses('ANIMATED_ELEMENTS')}>
            {HERO_CONSTANTS.CLASSES.GLOW_PARTICLES.map((particleClass, index) => (
              <div
                key={index}
                className={particleClass}
                style={{ animationDelay: index > 0 ? getBackgroundAnimationDelay(`PARTICLE_${index + 1}`) : '0s' }}
              ></div>
            ))}
          </div>
          {HERO_CONSTANTS.CLASSES.BLUR_ELEMENTS.map((blurClass, index) => (
            <div
              key={index}
              className={blurClass}
              style={{ animationDelay: index > 0 ? getBackgroundAnimationDelay(`BLUR_${index + 1}`) : '0s' }}
            ></div>
          ))}
          <div className={getCssClasses('OVERLAY')}></div>
        </div>

        <div className={getCssClasses('CONTENT_WRAPPER')}>
          <div className="text-center">
            <motion.h1
              {...getAnimationConfig('title')}
              className={getCssClasses('TITLE')}
            >
              {HERO_CONSTANTS.CONTENT.TITLE.MAIN} <span className={getCssClasses('TITLE_HIGHLIGHT')}>{HERO_CONSTANTS.CONTENT.TITLE.HIGHLIGHT}</span>
              <br />
              {HERO_CONSTANTS.CONTENT.TITLE.WITH} <span className={getCssClasses('TITLE_BRAND')}>{HERO_CONSTANTS.CONTENT.TITLE.BRAND}</span>
            </motion.h1>

            <motion.p
              {...getAnimationConfig('subtitle')}
              className={getCssClasses('SUBTITLE')}
            >
              {HERO_CONSTANTS.CONTENT.SUBTITLE}
            </motion.p>

            {/* Stats bar */}
            <motion.div
              {...getAnimationConfig('stats')}
              className={getCssClasses('STATS_CONTAINER')}
            >
              {HERO_CONSTANTS.STATS.map((stat, index) => {
                const IconComponent = stat.icon === 'FiBriefcase' ? FiBriefcase :
                                    stat.icon === 'FiUsers' ? FiUsers : FiTrendingUp;
                return (
                  <motion.div
                    key={index}
                    className={getCssClasses('STAT_ITEM')}
                    whileHover={getInteractionAnimation('STAT_HOVER')}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <IconComponent className={getCssClasses('STAT_ICON')} />
                    <span className={getCssClasses('STAT_NUMBER')}>{stat.number}</span>
                    <span className={getCssClasses('STAT_LABEL')}>{stat.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Enhanced search form */}
            <motion.form
              onSubmit={(e) => handleSearch(e, searchRef, setSearchFilter, setIsSearched)}
              {...getAnimationConfig('searchForm')}
              className={getCssClasses('SEARCH_FORM_CONTAINER')}
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  className={getCssClasses('GLOW_EFFECT')}
                  animate={getInteractionAnimation('GLOW_ANIMATION')}
                />

                <div className={getCssClasses('SEARCH_FORM')}>
                  <div className="flex flex-col md:flex-row">
                    <motion.div
                      className={getCssClasses('SEARCH_INPUT_CONTAINER')}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiSearch className={getCssClasses('SEARCH_ICON')} />
                      <input
                        type="text"
                        ref={searchRef}
                        placeholder={HERO_CONSTANTS.CONTENT.SEARCH_PLACEHOLDER}
                        className={getCssClasses('SEARCH_INPUT')}
                        defaultValue={activeTag || ""}
                      />
                    </motion.div>

                    <motion.button
                      type="submit"
                      className={getCssClasses('SEARCH_BUTTON')}
                      whileHover={getInteractionAnimation('SEARCH_BUTTON_HOVER')}
                      whileTap={getInteractionAnimation('SEARCH_BUTTON_TAP')}
                    >
                      <motion.div
                        className={getCssClasses('SEARCH_BUTTON_SHINE')}
                        {...getInteractionAnimation('SHINE_ANIMATION')}
                      />
                      <span className={getCssClasses('SEARCH_BUTTON_TEXT')}>{HERO_CONSTANTS.CONTENT.SEARCH_BUTTON}</span>
                      <FiArrowRight className={getCssClasses('SEARCH_BUTTON_ICON')} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.form>

            {/* Enhanced popular tags */}
            <motion.div
              {...getAnimationConfig('tags')}
              className={getCssClasses('TAGS_CONTAINER')}
            >
              <span className={getCssClasses('TAGS_LABEL')}>{HERO_CONSTANTS.CONTENT.POPULAR_SEARCHES_LABEL}</span>
              <div className={getCssClasses('TAGS_GRID')}>
                {HERO_CONSTANTS.POPULAR_TAGS.map((tag, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleTagClick(tag, setActiveTag, searchRef)}
                    className={getCssClasses('TAG_BUTTON', { active: activeTag === tag })}
                    whileHover={getInteractionAnimation('TAG_HOVER')}
                    whileTap={getInteractionAnimation('TAG_TAP')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: getTimingConfig('TAG_ANIMATION_DELAY_BASE', i) }}
                  >
                    <motion.div
                      className={getCssClasses('TAG_BUTTON_HOVER')}
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className={getCssClasses('TAG_BUTTON_TEXT')}>{tag}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

   {/* Trusted companies Section */}
    <motion.div
      {...getAnimationConfig('trustedSection')}
      className={getCssClasses('TRUSTED_SECTION')}
    >
      {/* Simple header */}
      <div className={getCssClasses('TRUSTED_HEADER')}>
        <p className={getCssClasses('TRUSTED_LABEL')}>
          {HERO_CONSTANTS.CONTENT.TRUSTED_BY}
        </p>
        <h3 className={getCssClasses('TRUSTED_TITLE')}>
          {HERO_CONSTANTS.CONTENT.TRUSTED_DESCRIPTION}
        </h3>
      </div>

      {/* Clean logo grid */}
      <div className={getCssClasses('LOGOS_CONTAINER')}>
        {HERO_CONSTANTS.COMPANY_LOGOS.map((logo, index) => (
          <motion.div
            key={index}
            {...getAnimationConfig('logoItem', index)}
            whileHover={getInteractionAnimation('LOGO_HOVER')}
            transition={{
              duration: 0.2
            }}
            className={getCssClasses('LOGO_ITEM')}
          >
            <div className={getCssClasses('LOGO_WRAPPER')}>
              <img
                src={logo}
                alt={`Company ${index + 1}`}
                className={getCssClasses('LOGO_IMAGE')}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Minimal accent */}
      <motion.div
        className={getCssClasses('ACCENT_LINE')}
        {...getAnimationConfig('accentLine')}
      >
        <div className={getCssClasses('ACCENT_DIVIDER')}></div>
      </motion.div>
    </motion.div>
    </motion.div>
  );
};

export default Hero;
