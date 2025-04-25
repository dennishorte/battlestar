/**
 * Device detection utility functions
 */

const deviceDetection = {
  /**
   * Checks if the current device is mobile using multiple detection methods
   * @returns {boolean} True if the device is determined to be mobile
   */
  isMobile() {
    // Check screen size
    const screenCheck = window.innerWidth < 768;
    
    // Check user agent for mobile devices
    const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Check for touch capability
    const touchCheck = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;
    
    // Media query check
    const mediaQueryCheck = window.matchMedia("(max-width: 768px)").matches;
    
    // Return true if any of the checks pass
    return screenCheck || userAgentCheck || touchCheck || mediaQueryCheck;
  },
  
  /**
   * Checks if the device is in portrait orientation
   * @returns {boolean} True if the device is in portrait orientation
   */
  isPortrait() {
    return window.innerHeight > window.innerWidth;
  },
  
  /**
   * Checks if the device is a tablet (medium-sized touch device)
   * @returns {boolean} True if the device is likely a tablet
   */
  isTablet() {
    const tabletSize = window.innerWidth >= 768 && window.innerWidth <= 1024;
    const userAgentCheck = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    
    return tabletSize || userAgentCheck;
  },

  /**
   * Checks if the device has touch screen capability
   * @returns {boolean} True if the device has touch capability
   */
  isTouchScreen() {
    // Primary method: Check if browser supports touch events
    const touchEventsSupported = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;
    
    // Secondary method: Check using matchMedia to detect pointer capability
    const pointerCoarseCheck = window.matchMedia('(pointer: coarse)').matches;
    
    // Third method: Check if device might be touch-enabled based on user agent
    const touchDeviceUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    return touchEventsSupported || pointerCoarseCheck || touchDeviceUA;
  }
};

export default deviceDetection; 