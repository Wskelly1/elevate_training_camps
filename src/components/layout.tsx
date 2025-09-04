"use client";
import * as React from "react"
import { Menu, X, User, BookOpen, Users, Target, ClipboardList, Image as ImageIcon, HelpCircle, Mail, MapPin, Facebook, Instagram, Linkedin, Send, Twitter, ChevronDown } from "lucide-react"
import { Button } from "../components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu"
import { Input } from "../components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import Link from "next/link"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "./Logo";
import { getSiteSettings, SiteSettings } from "../lib/queries";
import { urlFor } from "../lib/sanity";
import { usePathname } from "next/navigation";
import { client } from "../lib/sanity";

// Interface for about sections from Sanity
interface AboutSection {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

// Function to fetch about sections
async function getAboutSections(): Promise<AboutSection[]> {
  try {
    return await client.fetch(`
      *[_type == "aboutSection"] | order(_createdAt asc) {
        _id,
        title,
        slug
      }
    `);
  } catch (error) {
    console.error("Error fetching about sections:", error);
    return [];
  }
}

// Custom scroll handler for section navigation
function scrollToSection(sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) {
  // Get current path
  const currentPath = window.location.pathname;

  // For same-page navigation, handle it directly
  if (currentPath === '/about') {
    e.preventDefault();

    // Find the section
    const section = document.getElementById(sectionId);
    if (section) {
      // Get header height for offset
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;

      // Calculate the top position - position section exactly at the top after header
      const targetPosition = section.offsetTop - headerHeight;

      // Scroll to the section
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // For debugging
      console.log(`In-page scroll to: ${sectionId}, position: ${targetPosition}`);
    }
  } else {
    // For cross-page navigation, prevent default and let the link work normally
    // The about page will handle the scroll after loading via useEffect
    // Don't prevent default here - let the link navigate to the page with hash
  }
}

const customColors = {
  primary: '#755f4f',
  secondary: '#a89885',
  muted: '#cbccb5',
  darkAccent: '#7f6f51',
  headerFooterBg: '#f0ead6', // Richer cream for header/footer
  mainBg: '#fbf9f3',       // Lighter cream for main content
  foreground: '#333333',
  navText: '#000000', // Black text
  elevateGreen: '#427b4d', // Forest green
  darkerElevateGreen: '#387143', // Darker green for hover
  accent: '#d1c3a1', // Darker cream for dropdown hover
  hoverBrown: '#755f4f', // Brown color for hover
  navHoverBg: 'rgba(117, 95, 79, 0.1)', // Light brown background for hover
}

interface LayoutProps {
  children?: React.ReactNode
  showNavigation?: boolean
  footerContent?: React.ReactNode
}

/**
 * Main layout component for the Elevate Training Camps website.
 *
 * This component provides the consistent layout structure for all pages including:
 * - Header with responsive navigation (desktop and mobile versions)
 * - Main content area
 * - Footer with contact information and newsletter signup
 *
 * Features:
 * - Dynamic navigation based on Sanity CMS data
 * - Scroll-aware header that hides/shows based on scroll direction
 * - Mobile-responsive design with hamburger menu
 * - Custom color theming from Sanity settings
 * - Smooth scroll functionality for anchor links
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render within the layout
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  showNavigation = true,
  footerContent
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [navOverridden, setNavOverridden] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const lastScrollY = useRef(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Add a click listener to the header to handle navigation link clicks
    const handleNavLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        // When a nav link is clicked, ensure the body scroll is not locked
        document.body.style.overflow = 'auto';

        // Dispatch a custom event to signal navigation
        const navEvent = new CustomEvent('navigationClick', {
          detail: { href: link.href }
        });
        window.dispatchEvent(navEvent);

        // For debugging
        console.log('Navigation link clicked:', link.href);
      }
    };

    const headerElement = headerRef.current;
    if (headerElement) {
      const navLinks = headerElement.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick, true); // Use capture phase
      });

      return () => {
        navLinks.forEach(link => {
          link.removeEventListener('click', handleNavLinkClick, true);
        });
      };
    }
  }, [mounted]); // Rerun when mounted state changes

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      // For homepage, let the IntegratedHomepage component control nav visibility
      if (pathname === '/') {
        return;
      }

      // For other pages, use default scroll behavior
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setIsNavVisible(false); // scrolling down
      } else {
        setIsNavVisible(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    // Listen for custom nav visibility events from IntegratedHomepage
    const handleNavVisibilityEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{visible: boolean}>;
      setIsNavVisible(customEvent.detail.visible);
      setNavOverridden(customEvent.detail.visible === false); // Only override when hiding
    };

    const fetchSettings = async () => {
      const settings = await getSiteSettings();
      setSiteSettings(settings);
    };

    const fetchAboutSections = async () => {
      const sections = await getAboutSections();
      setAboutSections(sections);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("navVisibility", handleNavVisibilityEvent);
    fetchSettings();
    fetchAboutSections();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("navVisibility", handleNavVisibilityEvent);
    };
  }, [pathname]);

  // Helper function to assign appropriate icons based on section title
  function getIconForSection(title: string) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('story') || lowerTitle.includes('history')) return BookOpen;
    if (lowerTitle.includes('mission') || lowerTitle.includes('vision') || lowerTitle.includes('goal')) return Target;
    if (lowerTitle.includes('location') || lowerTitle.includes('where') || lowerTitle.includes('address')) return MapPin;
    if (lowerTitle.includes('team') || lowerTitle.includes('staff') || lowerTitle.includes('people')) return Users;
    return BookOpen; // Default icon
  }

  // Helper function to get dynamic description for sections
  function getDescriptionForSection(title: string) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('story') || lowerTitle.includes('history')) return "Discover our journey.";
    if (lowerTitle.includes('mission') || lowerTitle.includes('vision') || lowerTitle.includes('goal')) return "What drives us forward.";
    if (lowerTitle.includes('location') || lowerTitle.includes('where') || lowerTitle.includes('address')) return "Explore our camp locations.";
    if (lowerTitle.includes('team') || lowerTitle.includes('staff') || lowerTitle.includes('people')) return "Meet the people behind Elevate.";
    return "Learn more about us."; // Default description
  }

  // Generate navigation items dynamically
  const navigationItems = [
    {
      title: "About",
      icon: User,
      subItems: [
        // Always include "Our Team" first
        { title: "Our Team", href: "/about#our-team", icon: Users },
        // Add dynamic sections from Sanity (excluding pricing)
        ...aboutSections
          .filter(section => !section.title.toLowerCase().includes('pricing'))
          .map(section => ({
            title: section.title,
            href: `/about#${section.slug.current}`,
            icon: getIconForSection(section.title)
          }))
      ],
      href: "/about"
    },
    { title: "Coaching", href: "/coaching", icon: Target },
    { title: "Registration", href: "/registration", icon: ClipboardList },
    { title: "Media", href: "/media", icon: ImageIcon },
    { title: "FAQ", href: "/faq", icon: HelpCircle },
    { title: "Contact Us", href: "/contact", icon: Mail },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: customColors.mainBg,
        color: customColors.foreground,
        '--nav-bar-color': customColors.elevateGreen,
        '--nav-bar-hover-color': customColors.hoverBrown,
        '--nav-hover-bg': customColors.navHoverBg,
      } as React.CSSProperties}
    >
      {/* Header */}
      <header
        ref={headerRef}
        className={`sticky top-4 z-50 w-full transition-opacity duration-300 px-4 ${
          mounted && isNavVisible ? 'opacity-100' : 'opacity-0 invisible'
        }`}
      >
        <div className="max-w-7xl mx-auto rounded-full shadow-sm" style={{ backgroundColor: customColors.headerFooterBg }}>
          <div className="flex flex-row h-auto items-center justify-between px-6 py-3">
            {/* Logo container */}
            <div className="flex items-center h-12">
              <Logo maxWidth={180} />
            </div>

            {/* Desktop Navigation */}
            {showNavigation && (
              <div className="hidden md:block ml-auto">
                <NavigationMenu>
                  <NavigationMenuList className="flex gap-8 items-center">
                    {navigationItems.map((item) => (
                      <NavigationMenuItem key={item.title} className="flex items-center">
                        {item.subItems ? (
                          <>
                            <div className="flex items-center relative nav-item-with-bar nav-hover-bg">
                              <NavigationMenuTrigger
                                style={{
                                  color: customColors.navText,
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                  padding: '0.5rem 0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  backgroundColor: 'transparent',
                                  height: 'auto',
                                }}
                                className="bg-transparent border-none shadow-none"
                                onClick={(e) => {
                                  // Navigate to About when the text is clicked
                                  if (pathname === '/about') {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  } else {
                                    window.location.href = '/about';
                                  }
                                }}
                              >
                                {item.title}
                              </NavigationMenuTrigger>
                              <span className="hover-bar absolute bottom-0 left-0 right-0"></span>
                            </div>
                            <NavigationMenuContent>
                              <div className="grid grid-cols-2 gap-0 p-0 w-[500px]" style={{ minHeight: 250, backgroundColor: customColors.headerFooterBg }}>
                                {/* Left: Learn About Us fills full height */}
                                <div className="flex flex-col h-full">
                                  <NavigationMenuLink asChild>
                                    <Link
                                      className="flex flex-1 flex-col justify-end rounded-md px-6 pt-6 pb-4 m-4 no-underline outline-none focus:shadow-md relative overflow-hidden hover-scale-effect hover:shadow-lg transform transition-all duration-300 hover:scale-[1.03] cursor-pointer group"
                                      style={{ backgroundColor: customColors.muted, minHeight: 0 }}
                                      href="/about"
                                      onClick={(e) => {
                                        // Just navigate to the about page without scrolling to a specific section
                                        if (pathname === '/about') {
                                          e.preventDefault();
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                      }}
                                    >
                                      {mounted && siteSettings?.aboutUsImage && (
                                        <>
                                          <Image
                                            src={urlFor(siteSettings.aboutUsImage).url()}
                                            alt="About us"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-md transition-transform duration-300 hover-scale-target"
                                            style={{
                                              maskImage: 'linear-gradient(to bottom, black 20%, rgba(0,0,0,0.1) 70%)',
                                              WebkitMaskImage: 'linear-gradient(to bottom, black 20%, rgba(0,0,0,0.1) 70%)',
                                            }}
                                          />
                                          <div className="absolute inset-0 border-0 group-hover:border-4 transition-all duration-200 rounded-md border-transparent group-hover:border-[#d1c3a1] cursor-pointer">
                                          </div>
                                        </>
                                      )}
                                      <div className="mb-2 mt-4 text-lg font-medium relative z-10">
                                        Learn About Us
                                      </div>
                                      <p className="text-sm leading-tight relative z-10" style={{ color: customColors.foreground }}>
                                        Discover our story, meet our team, and understand our mission.
                                      </p>
                                    </Link>
                                  </NavigationMenuLink>
                                </div>
                                {/* Right: Links stacked at top */}
                                <div className="flex flex-col justify-between h-full py-4 pr-4">
                                  <div>
                                    {item.subItems.map((subItem) => (
                                      <NavigationMenuLink key={subItem.title} asChild>
                                        <Link
                                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:text-accent-foreground"
                                          href={subItem.href}
                                          onClick={(e) => {
                                            if (subItem.href.startsWith('/about#')) {
                                              const sectionId = subItem.href.split('#')[1];
                                              // Use the scrollToSection function which handles pathname checks
                                              scrollToSection(sectionId, e);
                                            }
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customColors.accent}
                                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                          <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                          <p className="text-sm leading-snug" style={{ color: customColors.darkAccent }}>
                                            {getDescriptionForSection(subItem.title)}
                                          </p>
                                        </Link>
                                      </NavigationMenuLink>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </NavigationMenuContent>
                          </>
                        ) : (
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              style={{
                                color: customColors.navText,
                                fontWeight: 'bold',
                                fontSize: '16px',
                                padding: '0.5rem 0.75rem',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              className="relative nav-item-with-bar nav-hover-bg"
                            >
                              <span>{item.title}</span>
                              <span className="hover-bar"></span>
                            </Link>
                          </NavigationMenuLink>
                        )}
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Menu"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mounted && isMobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-lg shadow-lg" style={{ backgroundColor: customColors.headerFooterBg }}>
            <div className="p-4 space-y-4">
              {navigationItems.map((item) => (
                <div key={item.title} className="space-y-2">
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => setAboutOpen(!aboutOpen)}
                        className="flex items-center justify-between w-full py-2 px-4 rounded-md hover:bg-muted/50"
                        style={{ color: customColors.navText }}
                      >
                        <span className="font-bold">{item.title}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {aboutOpen && (
                        <div className="ml-4 space-y-2 border-l-2 pl-4" style={{ borderColor: customColors.muted }}>
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="block py-2 px-4 rounded-md hover:bg-muted/50"
                              style={{ color: customColors.navText }}
                              onClick={(e) => {
                                if (subItem.href.startsWith('/about#')) {
                                  const sectionId = subItem.href.split('#')[1];
                                  // Use the scrollToSection function which handles pathname checks
                                  scrollToSection(sectionId, e);
                                }
                                // Close the mobile menu after navigation
                                toggleMobileMenu();
                              }}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-2 px-4 rounded-md hover:bg-muted/50"
                      style={{ color: customColors.navText }}
                    >
                      <span className="font-bold">{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-grow ${
        (pathname === '/' || pathname === '/faq' || pathname === '/about') ? '-mt-[4.5rem]' : 'pt-12'
      }`}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: customColors.headerFooterBg, color: customColors.navText }} className="relative border-t border-[#e6dfd3] transition-colors duration-300">
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-1 lg:grid-cols-2">
            {/* Contact/newsletter section */}
            <div className="relative" style={{ backgroundColor: 'rgba(168, 152, 133, 0.2)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h2 className="mb-4 text-3xl font-bold tracking-tight" style={{ color: '#000000' }}>Stay Connected</h2>
              <p className="mb-6" style={{ color: customColors.primary }}>
                Join our newsletter for the latest updates and exclusive offers.
              </p>
              <form className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pr-12 backdrop-blur-sm"
                  style={{ background: 'rgba(255, 255, 255, 0.6)', borderColor: customColors.primary, color: customColors.foreground }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-full"
                  style={{ backgroundColor: customColors.primary, color: '#fff' }}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </form>
              <div className="absolute -right-4 top-0 h-24 w-24 rounded-full" style={{ backgroundColor: customColors.primary, opacity: 0.1, filter: 'blur(32px)' }} />
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              <div>
                <h3 className="mb-4 text-lg font-semibold" style={{ color: '#000000' }}>Quick Links</h3>
                <nav className="space-y-2 text-sm">
                  <a href="/" className="block transition-colors hover:text-[#583e2e]" style={{ color: customColors.primary }}>
                    Home
                  </a>
                  <a href="/about" className="block transition-colors hover:text-[#583e2e]" style={{ color: customColors.primary }}>
                    About Us
                  </a>
                  <a href="/coaching" className="block transition-colors hover:text-[#583e2e]" style={{ color: customColors.primary }}>
                    Coaching
                  </a>
                  <a href="/registration" className="block transition-colors hover:text-[#583e2e]" style={{ color: customColors.primary }}>
                    Registration
                  </a>
                  <a href="/media" className="block transition-colors hover:text-[#583e2e]" style={{ color: customColors.primary }}>
                    Media
                  </a>
                  <a href="/faq" className="block transition-colors hover:text-[#583e2e]" style={{ color: customColors.primary }}>
                    Frequently Asked Questions
                  </a>
                  <a href="/contact" className="block transition-colors hover:text-[#583e2e]" style={{ color: customColors.primary }}>
                    Contact
                  </a>
                </nav>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold" style={{ color: '#000000' }}>Contact Us</h3>
                <address className="space-y-2 text-sm not-italic" style={{ color: customColors.primary }}>
                  <p>830 N Turquoise Dr</p>
                  <p>Flagstaff, AZ 86001</p>
                  <p>Phone: 651-207-4749</p>
                  <p>Email: elevatetrainingcamps@gmail.com</p>
                </address>
              </div>
              <div className="relative">
                <h3 className="mb-4 text-lg font-semibold" style={{ color: '#000000' }}>Follow Us</h3>
                <div className="mb-6 flex space-x-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full border-[#d3c7b4] hover:bg-[#e9e0d2] hover:border-[#a89885]">
                          <Facebook className="h-4 w-4 text-[#a89885]" />
                          <span className="sr-only">Facebook</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Follow us on Facebook</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full border-[#d3c7b4] hover:bg-[#e9e0d2] hover:border-[#a89885]">
                          <Twitter className="h-4 w-4 text-[#a89885]" />
                          <span className="sr-only">Twitter</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Follow us on Twitter</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full border-[#d3c7b4] hover:bg-[#e9e0d2] hover:border-[#a89885]">
                          <Instagram className="h-4 w-4 text-[#a89885]" />
                          <span className="sr-only">Instagram</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Follow us on Instagram</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#e6dfd3] pt-8 text-center md:flex-row">
            <p className="text-sm" style={{ color: customColors.primary }}>
              © 2025 Elevate Training Camps. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm">
              <a href="#" className="transition-colors hover:text-[#583e2e] hover:underline" style={{ color: customColors.primary }}>
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-[#583e2e] hover:underline" style={{ color: customColors.primary }}>
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-[#583e2e] hover:underline" style={{ color: customColors.primary }}>
                Cookie Settings
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
