import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: 'Features', href: '/features' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              LINK-X
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.href 
                    ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/40' 
                    : 'text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:text-primary-400 dark:hover:bg-neutral-800/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-neutral-700 hover:text-primary-700 dark:text-neutral-200 dark:hover:text-primary-400">
              Log in
            </Link>
            <Link to="/register" className="btn-primary px-4 py-2 rounded-md text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:text-primary-400 dark:hover:bg-neutral-800 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 border-t border-neutral-200 dark:border-neutral-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`block px-4 py-2 rounded-md text-base font-medium ${
                location.pathname === link.href 
                  ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/40' 
                  : 'text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:text-primary-400 dark:hover:bg-neutral-800/70'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-neutral-200 dark:border-neutral-800">
            <Link to="/login" className="block px-4 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:text-primary-400 dark:hover:bg-neutral-800/70">
              Log in
            </Link>
            <Link to="/register" className="block px-4 py-2 mt-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 