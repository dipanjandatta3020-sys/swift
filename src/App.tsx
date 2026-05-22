/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  ArrowRight, 
  Clock, 
  Package, 
  TrendingUp, 
  Globe, 
  FileText, 
  CheckCircle, 
  ShieldCheck, 
  Smartphone, 
  User, 
  Layers, 
  Truck, 
  DollarSign, 
  Calculator, 
  Info,
  Calendar,
  Sparkles,
  Barcode,
  Menu,
  X,
  PhoneCall
} from 'lucide-react';

// Pre-configured simulated tracking database for live interaction
const SIMULATED_TRACKING_DB: Record<string, {
  status: 'received' | 'transit' | 'out_for_delivery' | 'delivered';
  currentLocation: string;
  sender: string;
  receiver: string;
  estimatedDelivery: string;
  serviceType: string;
  weight: string;
  history: { time: string; location: string; description: string }[];
}> = {
  'SWIFT-782-Y': {
    status: 'out_for_delivery',
    currentLocation: 'New York Hub, NY',
    sender: 'Global Tech Suppliers (Munich)',
    receiver: 'Sarah Jenkins (Brooklyn)',
    estimatedDelivery: 'Today (by 5:00 PM)',
    serviceType: 'Swift Express Priority',
    weight: '2.4 kg',
    history: [
      { time: '09:30 AM', location: 'Brooklyn Depot', description: 'Out for delivery with courier squad 14' },
      { time: '05:15 AM', location: 'New York Central Hub', description: 'Arrived at local hub, sorted to regional delivery' },
      { time: 'Yesterday', location: 'Frankfurt Airport', description: 'Customs cleared and departed overseas' },
      { time: '2 Days Ago', location: 'Munich Depot', description: 'Package picked up and registered' }
    ]
  },
  'SWIFT-104-X': {
    status: 'delivered',
    currentLocation: 'San Francisco, CA',
    sender: 'Aether Labs Corp',
    receiver: 'Marcus Vance (SOMA)',
    estimatedDelivery: 'Delivered (Yesterday, 14:12)',
    serviceType: 'Swift Same-Day Courier',
    weight: '0.85 kg',
    history: [
      { time: '02:12 PM', location: 'San Francisco, CA', description: 'Delivered and signed by M. Vance' },
      { time: '11:00 AM', location: 'SF Dispatch Center', description: 'Loaded onto courier vehicle' },
      { time: '08:45 AM', location: 'Aether Labs SFO', description: 'Picked up by on-demand courier courier' }
    ]
  },
  'SWIFT-991-A': {
    status: 'transit',
    currentLocation: 'Chicago Sorting Center, IL',
    sender: 'Eco-Wear Apparel',
    receiver: 'David Cho (Lincoln Park)',
    estimatedDelivery: 'May 25, 2026',
    serviceType: 'Swift Standard Ground',
    weight: '1.2 kg',
    history: [
      { time: '04:50 AM', location: 'Chicago Sorting Center', description: 'Departed sorting facility' },
      { time: 'Yesterday', location: 'Atlanta Depot', description: 'Origin scan and package dispatched' }
    ]
  }
};

export default function App() {
  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search dialog state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Parallax Event Listeners / Math
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // Normalized coordinates from -1.0 to 1.0 relative to hero element center
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const heroEl = heroRef.current;
    if (heroEl) {
      heroEl.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (heroEl) {
        heroEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Tracking System States
  const [trackNumber, setTrackNumber] = useState('SWIFT-782-Y');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<typeof SIMULATED_TRACKING_DB[string] | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackNumber.trim()) return;

    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingResult(null);

    // Simulate standard fast enterprise network delay
    setTimeout(() => {
      const formattedId = trackNumber.trim().toUpperCase();
      const match = SIMULATED_TRACKING_DB[formattedId];

      if (match) {
        setTrackingResult(match);
      } else {
        // Fallback dynamic tracking generated on-the-fly for any valid input style
        if (formattedId.length > 3) {
          setTrackingResult({
            status: 'received',
            currentLocation: 'Regional Dispatch Hub',
            sender: 'External Retailer Partner',
            receiver: 'Verified Recipient',
            estimatedDelivery: 'Within 3 Business Days',
            serviceType: 'Swift Economy Hub Saver',
            weight: 'Under 5.0 kg',
            history: [
              { time: 'Just now', location: 'System Entry Point', description: 'Electronic shipment data authorized. Sorting pending.' }
            ]
          });
        } else {
          setTrackingError('Invalid ID sequence. Use SWIFT-782-Y, SWIFT-104-X, SWIFT-991-A, or any key longer than 3 characters.');
        }
      }
      setTrackingLoading(false);
    }, 600);
  };

  // Live Metric Counters (incremented elegantly)
  const [metrics, setMetrics] = useState({ shipments: 4921040, accuracy: 99.87, transitLocations: 224 });
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        shipments: prev.shipments + Math.floor(Math.random() * 4) + 1
      }));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Quick Action Toggles (The 3 overlapping custom cards shown under the track input)
  // Options: 'ship' | 'quote' | 'business'
  const [activeDeckTab, setActiveDeckTab] = useState<'ship' | 'quote' | 'business'>('quote');

  // Shipping Form State (Tab 1: Ship Now)
  const [shipStep, setShipStep] = useState(1);
  const [shipForm, setShipForm] = useState({
    senderName: '',
    senderZip: '',
    receiverName: '',
    receiverZip: '',
    weight: '1.5',
    service: 'priority',
    confirmed: false
  });
  const [generatedWaybill, setGeneratedWaybill] = useState<{
    id: string;
    barcodeStr: string;
    date: string;
  } | null>(null);

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipForm.senderZip || !shipForm.receiverZip || !shipForm.senderName || !shipForm.receiverName) {
      alert('Keep consistency: Please fill out postal addresses to generate a legal waybill.');
      return;
    }
    const fakeId = `SWIFT-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedWaybill({
      id: fakeId,
      barcodeStr: `||||| |||| || |||| ||| ||| ${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    setShipStep(2);
  };

  // Quote Calculator State (Tab 2: Get a Quote)
  const [quoteWeights, setQuoteWeights] = useState('1.5');
  const [quoteOrigin, setQuoteOrigin] = useState('US_EAST');
  const [quoteDest, setQuoteDest] = useState('EU_WEST');
  const [pricingEstimation, setPricingEstimation] = useState({ priority: 35.50, standard: 18.20, saver: 11.45 });

  useEffect(() => {
    const weightNum = parseFloat(quoteWeights) || 1.0;
    let baseMultiplier = 12.0;
    if (quoteOrigin !== quoteDest) {
      baseMultiplier = 28.0;
    }
    const calculatedPriority = (weightNum * 6.5 + baseMultiplier).toFixed(2);
    const calculatedStandard = (weightNum * 3.8 + baseMultiplier * 0.6).toFixed(2);
    const calculatedSaver = (weightNum * 2.2 + baseMultiplier * 0.4).toFixed(2);

    setPricingEstimation({
      priority: parseFloat(calculatedPriority),
      standard: parseFloat(calculatedStandard),
      saver: parseFloat(calculatedSaver)
    });
  }, [quoteWeights, quoteOrigin, quoteDest]);

  // Business Consultation Onboarding State (Tab 3: Corporate request)
  const [bizForm, setBizForm] = useState({ companyName: '', contactPhone: '', cargoVolume: '100+' });
  const [bizFormSubmitted, setBizFormSubmitted] = useState(false);

  const handleBizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBizFormSubmitted(true);
    setTimeout(() => {
      setBizFormSubmitted(false);
      setBizForm({ companyName: '', contactPhone: '', cargoVolume: '100+' });
    }, 4000);
  };

  // Subtle Parallax Transform Multipliers
  const backgroundY = scrollY * 0.35;
  const overlayY = scrollY * 0.12;
  const cardFloatY = Math.sin(scrollY * 0.05) * 2; // subtle wave

  // Mouse translational multiplier
  const bgMouseX = mousePos.x * 20;
  const bgMouseY = mousePos.y * 15;
  const cardMouseX = mousePos.x * -12;
  const cardMouseY = mousePos.y * -8;

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900 selection:bg-yellow-400 selection:text-black">
      
      {/* 1. TOP UTILITY STRIP (High-Contrast Black & Soft White) */}
      <div className="bg-[#1C1D1F] text-xs text-neutral-300 border-b border-neutral-800 transition-all duration-300">
        <div id="top-util-container" className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="#locations" className="hover:text-yellow-400 flex items-center gap-1.5 transition-colors">
              <MapPin className="w-3.5 h-3.5" />
              <span>Find a Service Drop-off</span>
            </a>
            <span className="text-neutral-600">|</span>
            <span className="hidden sm:inline text-neutral-400">System Clock UTC: </span>
            <span className="font-mono text-yellow-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-yellow-400" />
              <span>08:14 UTC</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden md:inline hover:text-white cursor-pointer transition-colors">Careers</span>
            <span className="hidden md:inline text-neutral-700">•</span>
            <span className="hidden md:inline hover:text-white cursor-pointer transition-colors">Digital Logistics</span>
            <span className="hidden md:inline text-neutral-700">•</span>
            <span className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors">
              <Globe className="w-3 h-3 text-neutral-400" />
              <span>International (EN)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Bright Iconic DHL Yellow: #FFCC00) */}
      <header className="sticky top-0 z-50 bg-[#FFCC00] text-black shadow-md border-b-2 border-[#E0B400] transition-transform">
        <div id="main-header-container" className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-10">
            {/* Custom SVG/CSS Styled DHL-inspired Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative font-black italic tracking-tighter text-2xl bg-black text-[#FFCC00] px-4 py-1 rounded skew-x-12 flex items-center gap-1 shadow">
                <span className="text-white">SWIFT</span>
                <span className="text-[#FFCC00]">POST</span>
                {/* Horizontal speed bands replicating the image feel */}
                <div className="absolute -left-3 top-2 h-1 w-2 bg-black skew-x-12 opacity-80" />
                <div className="absolute -left-2.5 top-4.5 h-0.5 w-1.5 bg-black skew-x-12 opacity-80" />
              </div>
            </a>

            {/* Nav Menu */}
            <nav className="hidden lg:flex items-center gap-2 font-bold text-sm tracking-wide">
              <a href="#track-section" className="px-3.5 py-2 hover:bg-black/5 rounded-md transition-colors flex items-center gap-0.5">
                <span>Track</span>
              </a>
              <a href="#booking-card" onClick={() => setActiveDeckTab('ship')} className="px-3.5 py-2 hover:bg-black/5 rounded-md transition-colors">
                <span>Ship Packages</span>
              </a>
              <a href="#booking-card" onClick={() => setActiveDeckTab('quote')} className="px-3.5 py-2 hover:bg-black/5 rounded-md transition-colors">
                <span>Enterprise Logistics</span>
              </a>
              <a href="#announcements" className="px-3.5 py-2 hover:bg-black/5 rounded-md transition-colors">
                <span>Customer Care</span>
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Find Service Selector */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold border border-black/20 bg-white/40 px-3 py-1.5 rounded hover:bg-white/80 transition-all cursor-pointer">
              <MapPin className="w-3.5 h-3.5" />
              <span>Asia East / India Hub</span>
              <ChevronDown className="w-3 h-3" />
            </div>

            {/* Custom Minimal Search Activation */}
            <div className="relative">
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="p-2 hover:bg-black/10 rounded-full transition-colors relative"
                title="Search shipment data"
                id="search-btn"
              >
                <Search className="w-5 h-5 text-black" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-neutral-200 p-3 z-50">
                  <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded border border-neutral-300">
                    <Search className="w-4 h-4 text-neutral-500" />
                    <input 
                      type="text" 
                      placeholder="Search site or location..." 
                      className="bg-transparent border-none text-xs outline-none text-neutral-800 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-neutral-500 text-[10px] italic">
                      Live searching for "{searchQuery}"... Not found yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Portal Dropdown Button (Black for high contrast) */}
            <a 
              href="#booking-card" 
              onClick={() => setActiveDeckTab('business')} 
              className="hidden md:flex items-center gap-2 bg-black text-white px-5 py-2 rounded text-xs font-bold tracking-wider hover:bg-neutral-800 transition-all shadow hover:shadow-md"
            >
              <User className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span>CUSTOMER PORTAL</span>
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 rounded hover:bg-black/10 text-black focus:outline-none"
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Dropdown Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFCC00] border-t border-black/10 p-4 space-y-2 flex flex-col font-bold transition-all shadow-inner">
            <a href="#track-section" className="py-2.5 px-3 hover:bg-black/5 rounded text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
              📦 Track Shipment
            </a>
            <a href="#booking-card" className="py-2.5 px-3 hover:bg-black/5 rounded text-black transition-colors" onClick={() => { setActiveDeckTab('ship'); setMobileMenuOpen(false); }}>
              📦 Ship Now
            </a>
            <a href="#booking-card" className="py-2.5 px-3 hover:bg-black/5 rounded text-black transition-colors" onClick={() => { setActiveDeckTab('quote'); setMobileMenuOpen(false); }}>
              ⚡ Get a Shipping Quote
            </a>
            <a href="#booking-card" className="py-2.5 px-3 hover:bg-black/5 rounded text-black transition-colors" onClick={() => { setActiveDeckTab('business'); setMobileMenuOpen(false); }}>
              💼 Premium Business Solutions
            </a>
            <a href="#announcements" className="py-2.5 px-3 hover:bg-black/5 rounded text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
              📨 Support Center
            </a>
            <div className="pt-3 border-t border-black/10">
              <a href="#booking-card" className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded text-sm tracking-wide font-bold" onClick={() => { setActiveDeckTab('business'); setMobileMenuOpen(false); }}>
                <User className="w-4 h-4 text-[#FFCC00]" />
                <span>PORTAL LOGIN</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 3. PARALLAX HERO SECTION */}
      <section 
        ref={heroRef}
        className="relative overflow-hidden min-h-[660px] md:min-h-[720px] bg-neutral-900 flex flex-col justify-between"
        style={{ contentVisibility: 'auto' }}
      >
        {/* Layer 1: Simulated Parallax Underlay Sky Gradient & Dust */}
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-[#1F2022] z-0" />

        {/* Layer 2: Main Generated Hero Background Image (Static) */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-10 pointer-events-none opacity-45"
          style={{
            backgroundImage: `url('/images/delivery_hero_background_1779437692703.png')`,
          }}
        />

        {/* Dynamic Glowing Radial Overlay matching original warmth design */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/60 z-20 pointer-events-none" />

        {/* Floating Abstract Element (Static position) */}
        <div 
          className="absolute right-12 md:right-32 top-1/4 z-30 pointer-events-none hidden lg:block text-[#FFCC00]/40"
        >
          <div className="bg-neutral-900/90 border border-neutral-700/60 p-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-2xl">
            <div className="w-12 h-12 rounded-lg bg-[#FFCC00] flex items-center justify-center text-black">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-white text-xs font-bold tracking-tight">Rapid Air Fleet</div>
              <div className="text-neutral-400 text-[10px]">Priority Global Delivery</div>
            </div>
          </div>
        </div>

        {/* Hero Central Content Frame */}
        <div 
          id="hero-content-anchor" 
          className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-24 pb-32 z-30 w-full"
        >
          <div className="max-w-2xl text-left bg-black/45 md:bg-transparent p-6 md:p-0 rounded-2xl backdrop-blur-sm md:backdrop-blur-none">
            {/* Micro tagline */}
            <div className="inline-flex items-center gap-2 bg-[#FFCC00] text-black text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded shadow mb-5 md:mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Swift Logistics Core</span>
            </div>

            {/* Title with yellow & white pairing */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Track Your <span className="text-[#FFCC00]">Shipment</span> & Cargo
            </h1>
            
            <p className="text-neutral-300 text-sm md:text-base mb-8 max-w-lg leading-relaxed font-medium">
              Access hyper-accurate real-time monitoring. Provide your custom tracking credentials to estimate exact arrival times, dispatch alerts, and customs updates instantly.
            </p>

            {/* Tracking Submission Widget */}
            <form onSubmit={handleTrackSubmit} className="bg-white p-2.5 rounded-xl md:rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 border-2 border-[#FFCC00] max-w-xl transition-all hover:border-[#ffd700] focus-within:ring-4 focus-within:ring-[#FFCC00]/30" id="track-section">
              <div className="flex-1 flex items-center gap-3 px-3 py-2 sm:py-0">
                <Package className="w-5.5 h-5.5 text-neutral-400 shrink-0" />
                <input 
                  type="text" 
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                  placeholder="Enter tracking number(s)... e.g. SWIFT-782-Y" 
                  className="bg-transparent border-none text-black placeholder-neutral-500 text-sm font-semibold outline-none w-full font-mono"
                  disabled={trackingLoading}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={trackingLoading}
                className="bg-black hover:bg-neutral-800 text-[#FFCC00] hover:text-white px-2 sm:px-8 py-3.5 rounded-lg md:rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 min-w-[120px]"
              >
                {trackingLoading ? (
                  <div className="w-5 h-5 border-2 border-[#FFCC00] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>TRACK</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Core Helper Track IDs */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-300 font-medium">
              <span className="text-neutral-400">Sample tracking IDs:</span>
              <button 
                type="button"
                onClick={() => { setTrackNumber('SWIFT-782-Y'); }} 
                className="bg-neutral-800/80 hover:bg-neutral-700 hover:text-white px-2.5 py-1 rounded transition-colors text-[11px] font-mono border border-neutral-700/50"
              >
                SWIFT-782-Y (Out Delivery)
              </button>
              <button 
                type="button"
                onClick={() => { setTrackNumber('SWIFT-104-X'); }} 
                className="bg-neutral-800/80 hover:bg-neutral-700 hover:text-white px-2.5 py-1 rounded transition-colors text-[11px] font-mono border border-neutral-700/50"
              >
                SWIFT-104-X (Delivered)
              </button>
              <button 
                type="button"
                onClick={() => { setTrackNumber('SWIFT-991-A'); }} 
                className="bg-neutral-800/80 hover:bg-neutral-700 hover:text-white px-2.5 py-1 rounded transition-colors text-[11px] font-mono border border-neutral-700/50"
              >
                SWIFT-991-A (Transit)
              </button>
            </div>
          </div>
        </div>

        {/* Spacer before Deck to accommodate the overlapping styling */}
        <div className="h-10 w-full" />
      </section>

      {/* 4. TRACKING RESULTS AREA (Dynamic Workspace Triggered by User Interaction) */}
      {(trackingResult || trackingError) && (
        <section className="bg-white border-y border-neutral-250 py-12 transition-all duration-500 animate-fadeIn" id="results-display-area">
          <div className="max-w-4xl mx-auto px-4">
            
            {trackingError && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-orange-950 text-sm">Query Unrecognized</h4>
                  <p className="text-orange-900 text-xs mt-1">{trackingError}</p>
                </div>
              </div>
            )}

            {trackingResult && (
              <div className="bg-neutral-50 rounded-2xl border border-neutral-300 shadow-md p-6">
                
                {/* Header status block */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                  <div>
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Identified Shipment</span>
                    <h3 className="text-xl font-black text-neutral-900 mt-1 font-mono tracking-tight">{trackNumber.toUpperCase()}</h3>
                    <p className="text-xs text-neutral-600 mt-1">Service Level: <span className="font-semibold text-black">{trackingResult.serviceType}</span> | Dry Weight: <span className="font-semibold text-black">{trackingResult.weight}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-600 font-bold hidden sm:inline">Current Status:</span>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                      trackingResult.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-300' :
                      trackingResult.status === 'out_for_delivery' ? 'bg-[#FFCC00]/20 text-neutral-900 border border-[#FFCC00]' :
                      trackingResult.status === 'transit' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-neutral-200 text-neutral-800'
                    }`}>
                      {trackingResult.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Sender/Receiver details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5 border-b border-neutral-200 text-xs bg-neutral-100/50 -mx-6 px-6">
                  <div>
                    <span className="text-neutral-500 font-semibold block uppercase tracking-wide">Shipment Sender</span>
                    <span className="font-bold text-neutral-800 mt-1 block text-sm">{trackingResult.sender}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-semibold block uppercase tracking-wide">Destination Consignee</span>
                    <span className="font-bold text-neutral-800 mt-1 block text-sm">{trackingResult.receiver}</span>
                  </div>
                </div>

                {/* Progress bar tracking visual component */}
                <div className="py-8">
                  <div className="relative">
                    {/* Underlying track line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -translate-y-1/2 rounded" />
                    
                    {/* Dynamic colored progress bar length */}
                    <div className="absolute top-1/2 left-0 h-1 bg-[#FFCC00] -translate-y-1/2 rounded transition-all duration-1000"
                      style={{
                        width: 
                          trackingResult.status === 'received' ? '15%' :
                          trackingResult.status === 'transit' ? '50%' :
                          trackingResult.status === 'out_for_delivery' ? '82%' : '100%'
                      }}
                    />

                    {/* Nodes of progress */}
                    <div className="relative flex justify-between">
                      {/* Node 1 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          ['received', 'transit', 'out_for_delivery', 'delivered'].includes(trackingResult.status)
                            ? 'bg-[#FFCC00] text-black border-2 border-black' : 'bg-neutral-200 text-neutral-500'
                        }`}>
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-neutral-800 mt-2">Accepted</span>
                      </div>

                      {/* Node 2 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          ['transit', 'out_for_delivery', 'delivered'].includes(trackingResult.status)
                            ? 'bg-[#FFCC00] text-black border-2 border-black' : 'bg-neutral-200 text-neutral-500 border border-neutral-300'
                        }`}>
                          {['transit', 'out_for_delivery', 'delivered'].includes(trackingResult.status) ? '✓' : '2'}
                        </div>
                        <span className="text-[10px] font-bold text-neutral-800 mt-2">Transit</span>
                      </div>

                      {/* Node 3 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          ['out_for_delivery', 'delivered'].includes(trackingResult.status)
                            ? 'bg-[#FFCC00] text-black border-2 border-black animate-pulse' : 'bg-neutral-200 text-neutral-500 border border-neutral-300'
                        }`}>
                          {trackingResult.status === 'delivered' ? '✓' : '3'}
                        </div>
                        <span className="text-[10px] font-bold text-neutral-800 mt-2">With Courier</span>
                      </div>

                      {/* Node 4 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          trackingResult.status === 'delivered'
                            ? 'bg-green-600 text-white border-2 border-white shadow-md' : 'bg-neutral-200 text-neutral-500 border border-neutral-300'
                        }`}>
                          🏆
                        </div>
                        <span className="text-[10px] font-bold text-neutral-800 mt-2">Delivered</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Timeline description feed */}
                <div className="mt-4 pt-6 border-t border-neutral-200">
                  <h4 className="text-xs font-black text-neutral-700 uppercase tracking-widest mb-4">Detailed Audit Progress</h4>
                  <div className="space-y-4">
                    {trackingResult.history.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start text-xs">
                        <div className="w-20 font-mono text-neutral-500 font-semibold shrink-0 pt-0.5">{step.time}</div>
                        <div className="relative">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${idx === 0 ? 'bg-[#FFCC00] scale-125' : 'bg-neutral-300'}`} />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900">{step.location}</div>
                          <div className="text-neutral-600 mt-0.5">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ETA CTA Panel */}
                <div className="mt-6 bg-[#FFCC00]/10 border border-[#E0B400]/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-[#FFCC00] text-black p-2 rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-600 font-bold uppercase block -mb-0.5">Estimated Fulfillment Window</div>
                      <div className="text-sm font-black text-black">{trackingResult.estimatedDelivery}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { alert('Notifications integrated successfully! We will ping you on transit status shifts.'); }} 
                    className="bg-black text-white hover:bg-neutral-800 text-[10px] uppercase tracking-wider font-extrabold px-4 py-2.5 rounded shadow transition-transform hover:-translate-y-0.5"
                  >
                    Receive Mobile SMS Alerts
                  </button>
                </div>

              </div>
            )}

          </div>
        </section>
      )}

      {/* 5. INTERACTIVE CORE ACTION DECK SECTION (Overlap Cards Frame, Replicates DHL exact structures) */}
      <section className="relative z-30 -mt-24 max-w-5xl mx-auto px-4" id="booking-card">
        
        {/* The 3 Tab Triggers */}
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          
          {/* Tab 1: Get a Quote (Active by default for useful instant values) */}
          <button 
            type="button"
            onClick={() => { setActiveDeckTab('quote'); setShipStep(1); }}
            className={`cursor-pointer rounded-t-xl py-4 px-3 md:px-5 flex flex-col items-center justify-center text-center font-black text-xs md:text-sm transition-all shadow ${
              activeDeckTab === 'quote' 
                ? 'bg-white text-black border-t-4 border-[#FFCC00]' 
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-t-4 border-transparent'
            }`}
          >
            <Calculator className={`w-5 h-5 mb-2 ${activeDeckTab === 'quote' ? 'text-black' : 'text-neutral-500'}`} />
            <span className="uppercase tracking-widest text-[10px] md:text-[11px]">Get a Quote</span>
            <span className="hidden sm:inline font-normal text-[10px] text-neutral-500 mt-1">Estimate exact delivery costs</span>
          </button>

          {/* Tab 2: Ship Package Now */}
          <button 
            type="button"
            onClick={() => { setActiveDeckTab('ship'); }}
            className={`cursor-pointer rounded-t-xl py-4 px-3 md:px-5 flex flex-col items-center justify-center text-center font-black text-xs md:text-sm transition-all shadow ${
              activeDeckTab === 'ship' 
                ? 'bg-white text-black border-t-4 border-[#FFCC00]' 
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-t-4 border-transparent'
            }`}
          >
            <Package className={`w-5 h-5 mb-2 ${activeDeckTab === 'ship' ? 'text-black' : 'text-neutral-500'}`} />
            <span className="uppercase tracking-widest text-[10px] md:text-[11px]">Ship Package Now</span>
            <span className="hidden sm:inline font-normal text-[10px] text-neutral-500 mt-1">Create label and waybill</span>
          </button>

          {/* Tab 3: Request Business Account */}
          <button 
            type="button"
            onClick={() => { setActiveDeckTab('business'); }}
            className={`cursor-pointer rounded-t-xl py-4 px-3 md:px-5 flex flex-col items-center justify-center text-center font-black text-xs md:text-sm transition-all shadow ${
              activeDeckTab === 'business' 
                ? 'bg-white text-black border-t-4 border-[#FFCC00] bg-gradient-to-tr from-white to-yellow-50/20' 
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-t-4 border-transparent'
            }`}
          >
            <Layers className={`w-5 h-5 mb-2 ${activeDeckTab === 'business' ? 'text-yellow-400' : 'text-neutral-500'}`} />
            <span className="uppercase tracking-widest text-[10px] md:text-[11px] text-left sm:text-center">Business Account</span>
            <span className="hidden sm:inline font-normal text-[10px] text-neutral-500 mt-1">Save up to 45% volume premium</span>
          </button>

        </div>

        {/* Dynamic Context Card Body Area */}
        <div className="bg-white rounded-b-2xl shadow-xl border-x border-b border-neutral-200 p-6 md:p-8 text-neutral-900 transition-all min-h-[340px]">
          
          {/* TAB 1: SERVICE ESTIMATOR (Get a Quote) */}
          {activeDeckTab === 'quote' && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-[#FFCC00] text-black px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono">Simulated Quote Engine</span>
                <h3 className="text-lg font-black tracking-tight text-neutral-950">Shipping Rate Calculator</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Inputs */}
                <div className="space-y-4 md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-600 block mb-1">Shipping Origin</label>
                      <select 
                        value={quoteOrigin} 
                        onChange={(e) => setQuoteOrigin(e.target.value)}
                        className="w-full bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FFCC00] focus:outline-none"
                      >
                        <option value="US_EAST">United States East (SFO Hub)</option>
                        <option value="EU_WEST">European Logistics Zone (Munich Depot)</option>
                        <option value="ASIA_EAST">Asia East / India Hub (Delhi Gateway)</option>
                        <option value="AU_SOUTH">Australia South Gateway</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-600 block mb-1">Package Destination</label>
                      <select 
                        value={quoteDest} 
                        onChange={(e) => setQuoteDest(e.target.value)}
                        className="w-full bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FFCC00] focus:outline-none"
                      >
                        <option value="ASIA_EAST">Asia East / India Hub (Delhi Gateway)</option>
                        <option value="EU_WEST">European Logistics Zone (Munich Depot)</option>
                        <option value="US_EAST">United States East (SFO Hub)</option>
                        <option value="AU_SOUTH">Australia South Gateway</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-600 block mb-1">Estimated Package Weight (kg)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.1" 
                          min="0.1" 
                          max="150"
                          value={quoteWeights}
                          onChange={(e) => setQuoteWeights(e.target.value)}
                          className="w-full bg-neutral-100 border border-neutral-300 rounded-lg pl-3 pr-12 py-2.5 text-sm text-black font-semibold focus:ring-2 focus:ring-[#FFCC00] focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-neutral-400">KG</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-600 block mb-1">Package Dimensions (Volume)</label>
                      <input 
                        type="text" 
                        placeholder="Regular Shoe Box size (approx)" 
                        className="w-full bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#FFCC00] focus:outline-none"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-neutral-100/80 p-3 rounded-lg text-[11px] text-neutral-600 border border-neutral-200">
                    <Info className="w-4 h-4 text-neutral-600 shrink-0" />
                    <span>Real-time calculation dynamic pricing formulas adjust immediately upon weight modifications.</span>
                  </div>
                </div>

                {/* Simulated Pricing Output Tiers */}
                <div className="bg-neutral-50/70 border-l border-neutral-200 p-5 rounded-xl space-y-4">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Est. Tariffs & Speed Details</span>
                  
                  {/* Tier 1 */}
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <div>
                      <span className="font-black text-xs text-neutral-900 block">⚡ Swift Express Priority</span>
                      <span className="text-[10px] text-neutral-500 block">Next business morning delivery</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-black block font-mono">${pricingEstimation.priority.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <div>
                      <span className="font-bold text-xs text-neutral-800 block">📦 Standard Fast Air</span>
                      <span className="text-[10px] text-neutral-500 block">Estimated 2 to 3 delivery days</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-neutral-800 block font-mono">${pricingEstimation.standard.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-xs text-neutral-700 block">🐢 Swift Economy Ground</span>
                      <span className="text-[10px] text-neutral-500 block">Estimated 4 to 6 delivery days</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-neutral-700 block font-mono">${pricingEstimation.saver.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Booking Trigger CTA */}
                  <button 
                    type="button"
                    onClick={() => {
                      setShipForm(prev => ({ ...prev, weight: quoteWeights }));
                      setActiveDeckTab('ship');
                    }}
                    className="w-full bg-[#FFCC00] text-black hover:bg-black hover:text-white py-3 rounded-lg text-xs font-black tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Proceed to Book Pickup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: SHIP NOW WORKSPACE (Label & Waybill creator) */}
          {activeDeckTab === 'ship' && (
            <div className="animate-fadeIn">
              {shipStep === 1 ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="bg-black text-yellow-400 px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono">Digital Waybill Generator</span>
                    <h3 className="text-lg font-black tracking-tight text-neutral-950">Enter Delivery Authorization</h3>
                  </div>

                  <form onSubmit={handleCreateShipment} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Sender details */}
                      <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-250">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          <span>Origin (Sender Consignor)</span>
                        </h4>
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Company / Sender Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Acme Tech Solutions"
                            className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#FFCC00] focus:outline-none"
                            value={shipForm.senderName}
                            onChange={(e) => setShipForm(prev => ({ ...prev, senderName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Origin Zipcode / Postal code</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 560001 (India Hub)"
                            className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-[#FFCC00] focus:outline-none"
                            value={shipForm.senderZip}
                            onChange={(e) => setShipForm(prev => ({ ...prev, senderZip: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      {/* Recipient details */}
                      <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-250">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          <span>Destination (Recipient Consignee)</span>
                        </h4>
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Receiver Person Full Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Richard Hendricks"
                            className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#FFCC00] focus:outline-none"
                            value={shipForm.receiverName}
                            onChange={(prev) => setShipForm(v => ({ ...v, receiverName: prev.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Destination Zipcode / Postal code</label>
                          <input 
                            type="text" 
                            placeholder="e.g. NY-10022"
                            className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-[#FFCC00] focus:outline-none"
                            value={shipForm.receiverZip}
                            onChange={(prev) => setShipForm(v => ({ ...v, receiverZip: prev.target.value }))}
                            required
                          />
                        </div>
                      </div>

                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center bg-neutral-100 p-4 rounded-xl gap-4">
                      <div className="text-left">
                        <span className="text-[10px] uppercase text-neutral-500 font-bold block">Selected Weight:</span>
                        <span className="text-sm font-bold text-black">{shipForm.weight} kg Courier Package</span>
                      </div>
                      <button 
                        type="submit"
                        className="bg-black hover:bg-neutral-800 text-white hover:text-[#FFCC00] px-6 py-2.5 rounded text-xs font-black uppercase tracking-wider transition-colors"
                      >
                        Generate Barcode & Waybill Form
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* STEP 2: PRINTABLE WAYBILL */
                <div className="animate-fadeIn space-y-6">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5.5 h-5.5 text-green-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-green-950">Shipment Waybill Authorized Successfully</h4>
                      <p className="text-xs text-green-800">Your label has been stored locally. Attach this waybill to the top of your package.</p>
                    </div>
                  </div>

                  {/* The Physical styled label mockup */}
                  <div className="border-[3px] border-black p-4 bg-white max-w-lg mx-auto font-mono text-black text-xs text-left select-none relative shadow-xl">
                    <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
                      <div>
                        <span className="font-black text-sm italic tracking-tighter">SWIFTPOST INTERNATIONAL WAYBILL</span>
                        <div className="text-[9px] text-neutral-500">EXPRESS GLOBAL DELIVERIES</div>
                      </div>
                      <div className="text-right">
                        <span className="bg-black text-[#FFCC00] font-black px-1.5 py-0.5 mt-1 block tracking-wider uppercase text-[9px]">WP-PRIORITY</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="border border-neutral-300 p-2">
                        <div className="font-bold underline text-[9px] text-neutral-500">FROM (SENDER):</div>
                        <div className="font-black text-neutral-800 uppercase mt-1">{shipForm.senderName}</div>
                        <div className="text-[10px] mt-0.5">Zipcode: {shipForm.senderZip}</div>
                      </div>
                      <div className="border border-neutral-300 p-2">
                        <div className="font-bold underline text-[9px] text-neutral-500">TO (CONSIGNEE):</div>
                        <div className="font-black text-neutral-800 uppercase mt-1">{shipForm.receiverName}</div>
                        <div className="text-[10px] mt-0.5">Zipcode: {shipForm.receiverZip}</div>
                      </div>
                    </div>

                    <div className="border-t border-b border-black py-2 mb-3 flex justify-between">
                      <div>
                        <span className="text-[9px] text-neutral-500 block">SHIP DATE</span>
                        <span className="font-bold">{generatedWaybill?.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-neutral-500 block">WEIGHT DECLARED</span>
                        <span className="font-bold">{shipForm.weight} KG</span>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-100 rounded border border-neutral-300 text-center flex flex-col items-center">
                      <Barcode className="w-10 h-10 max-w-full text-black stroke-1 mb-1" />
                      {/* Barcode character simulation */}
                      <div className="font-mono text-[13px] font-bold tracking-[6px] text-black">
                        {generatedWaybill?.id}
                      </div>
                      <div className="text-[8px] text-neutral-500 uppercase mt-1 tracking-widest font-sans">Scannable Swift Reader Code</div>
                    </div>

                    <div className="text-[8px] text-neutral-600 mt-3 text-center uppercase font-sans">
                      This represents a real Simulated Waybill for sandbox verification • swiftpost tracking systems certified.
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => {
                        if (generatedWaybill) {
                          setTrackNumber(generatedWaybill.id);
                          // populate in mock db
                          SIMULATED_TRACKING_DB[generatedWaybill.id] = {
                            status: 'received',
                            currentLocation: `Delhi Gateway Zone (origin: ${shipForm.senderZip})`,
                            sender: shipForm.senderName,
                            receiver: shipForm.receiverName,
                            estimatedDelivery: 'Arriving in 3 days',
                            serviceType: 'Swift Express Saver',
                            weight: `${shipForm.weight} kg`,
                            history: [
                              { time: 'Just now', location: 'Waybill Generator Workspace', description: 'Consignor processed shipment details, package waiting for dispatch scan.' }
                            ]
                          };
                        }
                        alert('Waybill registered with central tracking system! You can now track it in real time.');
                        // redirect back to tracking
                        const resArea = document.getElementById('results-display-area');
                        if (resArea) resArea.scrollIntoView({ behavior: 'smooth' });
                        // force simulation click trigger
                        setTrackingResult(SIMULATED_TRACKING_DB[generatedWaybill!.id]);
                      }}
                      className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase px-5 py-2.5 rounded transition-transform shadow hover:-translate-y-0.5"
                    >
                      💡 Track this Newly Created Shipment Now!
                    </button>
                    <button 
                      onClick={() => setShipStep(1)}
                      className="text-neutral-500 hover:text-black font-semibold text-xs border border-transparent hover:border-neutral-300 rounded px-4 py-2.5"
                    >
                      Create Another Label
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BUSINESS ACCREDITATION (Save up to 45%) */}
          {activeDeckTab === 'business' && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono">Volume Partner Perks</span>
                <h3 className="text-lg font-black tracking-tight text-neutral-950">Premium Enterprise Account Activation</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Benefits */}
                <div className="space-y-4">
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                    Corporate logistics partners receive exclusive shipping conditions. Streamline your global dispatch rates with optimized Customs clearances, dedicated tracking APIs, and lower surcharge rates.
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5 bg-neutral-50 px-3 py-2 rounded border border-neutral-200">
                      <ShieldCheck className="w-5 h-5 text-yellow-600 shrink-0" />
                      <span className="font-bold text-neutral-800">Direct Discounts: Premium volume savers up to <span className="text-black font-black underline decoration-[#FFCC00]">45% discount</span></span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-neutral-50 px-3 py-2 rounded border border-neutral-200">
                      <Globe className="w-5 h-5 text-blue-600 shrink-0" />
                      <span className="font-bold text-neutral-800">Global Customs: Swift-pass priority channels overseas</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-neutral-50 px-3 py-2 rounded border border-neutral-200">
                      <TrendingUp className="w-5 h-5 text-green-600 shrink-0" />
                      <span className="font-bold text-neutral-800">Consolidated Billing: Fully automated end-of-month invoice billing</span>
                    </div>
                  </div>
                </div>

                {/* Account query Form */}
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                  {bizFormSubmitted ? (
                    <div className="text-center py-8 space-y-2 animate-fadeIn">
                      <span className="text-3xl">🤝</span>
                      <h4 className="font-black text-sm text-neutral-900 uppercase">Consultant Promptly Notified</h4>
                      <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">Your regional account corporate assistant will connect via phone within 15 minutes.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBizSubmit} className="space-y-4 text-xs text-left">
                      <span className="font-bold text-black uppercase tracking-wider block border-b pb-1.5">Free Business Agent Callback</span>
                      <div>
                        <label className="text-neutral-600 font-bold block mb-1">Company Trade Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Hendricks Logistics Inc" 
                          className="w-full bg-white border border-neutral-300 rounded px-2.5 py-2 font-medium focus:outline-[#FFCC00]"
                          value={bizForm.companyName}
                          onChange={(e) => setBizForm(p => ({ ...p, companyName: e.target.value }))}
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-neutral-600 font-bold block mb-1">Callback Phone</label>
                          <input 
                            type="tel" 
                            placeholder="+1 (555) 0192" 
                            className="w-full bg-white border border-neutral-300 rounded px-2.5 py-2 font-semibold focus:outline-[#FFCC00]"
                            value={bizForm.contactPhone}
                            onChange={(e) => setBizForm(p => ({ ...p, contactPhone: e.target.value }))}
                            required 
                          />
                        </div>
                        <div>
                          <label className="text-neutral-600 font-bold block mb-1">Est. Cargo Count (monthly)</label>
                          <select 
                            value={bizForm.cargoVolume} 
                            onChange={(e) => setBizForm(p => ({ ...p, cargoVolume: e.target.value }))}
                            className="w-full bg-white border border-neutral-300 rounded px-2.5 py-2 font-medium focus:outline-[#FFCC00]"
                          >
                            <option value="10-50">10 - 50 packages</option>
                            <option value="50-200">50 - 200 packages</option>
                            <option value="200-1000">200 - 1000 packages</option>
                            <option value="1000+">1000+ logistics loads</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-black text-[#FFCC00] hover:bg-[#FFCC00] hover:text-black py-2.5 font-black uppercase tracking-widest text-[10px] rounded transition-colors"
                      >
                        Request Instant Callback
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* 6. METRIC STRIP (Elegant Numbers Counter) */}
      <section className="bg-neutral-50 py-10 border-b border-neutral-300 relative z-10">
        <div id="metrics-strip-container" className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Metric 1 */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest block">Monthly Deliveries Worldwide</span>
              <div className="text-3xl font-black text-black font-mono tracking-tight">
                {metrics.shipments.toLocaleString()} <span className="text-yellow-500 text-xl font-bold">+</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs mx-auto">Hyper-scale global carrier system handling custom containers on-demand continuously.</p>
            </div>

            {/* Metric 2 */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest block">Accuracy & Fulfillment Score</span>
              <div className="text-3xl font-black text-black font-mono tracking-tight">
                {metrics.accuracy}% <span className="text-green-600 text-lg">★</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs mx-auto">Verified successful handoffs, with minimal return-to-sender anomalies.</p>
            </div>

            {/* Metric 3 */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest block">Regional Gateways Active</span>
              <div className="text-3xl font-black text-black font-mono tracking-tight">
                {metrics.transitLocations} <span className="text-yellow-500 text-sm">Main hubs</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs mx-auto">Sparsely distributed cargo airports and sorting hubs guaranteeing rapid routing.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 2.1 DOCUMENT AND PARCEL SHIPPING (For All Shippers) */}
      <section className="bg-neutral-100 py-16 md:py-24 border-b border-neutral-200 relative z-10" id="document-parcel-shipping">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0 bg-white rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
            
            {/* Text Card */}
            <div className="lg:col-span-5 p-8 md:p-12 bg-white z-20 flex flex-col justify-center h-full">
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5 block">
                For All Shippers
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-black leading-tight tracking-tight">
                Document and Parcel Shipping
              </h3>
              <p className="text-neutral-600 font-semibold text-xs mt-4 leading-relaxed">
                Learn about SWIFTPOST Express – the undisputed global leader in international express shipping. Enjoy unparalleled speeds and bulletproof custom clearances.
              </p>
              
              {/* Services Available */}
              <div className="mt-8">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-3 border-b pb-1">
                  Services Available
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 bg-yellow-400/5 hover:bg-yellow-400/10 border border-yellow-400/20 p-2.5 rounded transition-all">
                    <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                    <span className="text-neutral-900 font-extrabold text-[11px]">Next Possible Business Day</span>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-400/5 hover:bg-yellow-400/10 border border-yellow-400/20 p-2.5 rounded transition-all">
                    <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                    <span className="text-neutral-900 font-extrabold text-[11px]">Tailored Business Solutions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-400/5 hover:bg-yellow-400/10 border border-yellow-400/20 p-2.5 rounded transition-all">
                    <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                    <span className="text-neutral-900 font-extrabold text-[11px]">Flexible Import/Export</span>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-400/5 hover:bg-yellow-400/10 border border-yellow-400/20 p-2.5 rounded transition-all">
                    <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                    <span className="text-neutral-900 font-extrabold text-[11px]">Wide Optional Services</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-2">
                <a 
                  href="#booking-card" 
                  onClick={() => setActiveDeckTab('ship')} 
                  className="inline-block bg-[#E00000] hover:bg-black text-white px-8 py-3.5 rounded text-xs font-black tracking-widest uppercase transition-colors shadow-md"
                >
                  Explore Swift Express
                </a>
              </div>
            </div>

            {/* Image Block */}
            <div className="lg:col-span-7 h-[300px] lg:h-auto min-h-[350px] relative">
              <img 
                src="/images/delivery_shipper_1779438218388.png" 
                alt="Document and Parcel Shipping" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* 2.2 CARGO SHIPPING (Business Only) */}
      <section className="bg-neutral-50 py-16 md:py-24 border-b border-neutral-200 relative z-10" id="cargo-shipping">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0 bg-white rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
            
            {/* Image Block (Left on Desktop) */}
            <div className="lg:col-span-7 h-[300px] lg:h-auto min-h-[350px] order-2 lg:order-1 relative">
              <img 
                src="/images/cargo_shipping_1779438237814.png" 
                alt="Cargo Shipping" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent hidden lg:block" />
            </div>

            {/* Text Card */}
            <div className="lg:col-span-5 p-8 md:p-12 bg-white z-20 flex flex-col justify-center h-full order-1 lg:order-2">
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5 block">
                Business Only
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-black leading-tight tracking-tight">
                Cargo Shipping
              </h3>
              <p className="text-neutral-600 font-semibold text-xs mt-4 leading-relaxed">
                Discover safe shipping and high-volume logistics service options from SWIFTPOST Global Forwarding. We handle heavy marine freight and continental air bridges.
              </p>
              
              {/* Services Available */}
              <div className="mt-8">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-3 border-b pb-1">
                  Services Available
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-neutral-100 hover:bg-[#FFCC00]/25 border border-neutral-200/60 p-2.5 rounded text-center transition-all cursor-pointer">
                    <span className="text-xs font-black text-black block">Air</span>
                    <span className="text-[9px] text-neutral-500 font-bold block mt-0.5">Freight</span>
                  </div>
                  <div className="bg-neutral-100 hover:bg-[#FFCC00]/25 border border-neutral-200/60 p-2.5 rounded text-center transition-all cursor-pointer">
                    <span className="text-xs font-black text-black block">Ocean</span>
                    <span className="text-[9px] text-neutral-500 font-bold block mt-0.5">Freight</span>
                  </div>
                  <div className="bg-neutral-100 hover:bg-[#FFCC00]/25 border border-neutral-200/60 p-2.5 rounded text-center transition-all cursor-pointer">
                    <span className="text-xs font-black text-black block">Road</span>
                    <span className="text-[9px] text-neutral-500 font-bold block mt-0.5">Freight</span>
                  </div>
                  <div className="bg-neutral-100 hover:bg-[#FFCC00]/25 border border-neutral-200/60 p-2.5 rounded text-center transition-all cursor-pointer">
                    <span className="text-xs font-black text-black block">Rail</span>
                    <span className="text-[9px] text-neutral-500 font-bold block mt-0.5">Freight</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-2">
                <a 
                  href="#booking-card" 
                  onClick={() => setActiveDeckTab('business')} 
                  className="inline-block bg-[#E00000] hover:bg-black text-white px-8 py-3.5 rounded text-xs font-black tracking-widest uppercase transition-colors shadow-md"
                >
                  Explore Swift Global Forwarding
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.3 ENTERPRISE LOGISTICS SERVICES (Business Only) */}
      <section className="bg-neutral-100 py-16 md:py-24 border-b border-neutral-200 relative z-10" id="enterprise-logistics">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0 bg-white rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
            
            {/* Text Card */}
            <div className="lg:col-span-5 p-8 md:p-12 bg-white z-20 flex flex-col justify-center h-full">
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5 block">
                Business Only
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-black leading-tight tracking-tight">
                Enterprise Logistics Services
              </h3>
              <p className="text-neutral-600 font-semibold text-xs mt-4 leading-relaxed">
                Find out how SWIFTPOST Supply Chain can revolutionize your business as an end-to-end 3PL specialist. We scale operations from robotic warehousing to direct retail catalog drops.
              </p>
              
              {/* Solutions Available */}
              <div className="mt-8">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-3 border-b pb-1">
                  Solutions Available
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="flex items-center gap-2 bg-[#FFCC00]/5 hover:bg-[#FFCC00]/10 border border-neutral-200 p-2 rounded transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E00000]" />
                    <span className="text-neutral-800 font-bold text-[10px]">Warehousing</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFCC00]/5 hover:bg-[#FFCC00]/10 border border-neutral-200 p-2 rounded transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E00000]" />
                    <span className="text-neutral-800 font-bold text-[10px]">Packaging</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFCC00]/5 hover:bg-[#FFCC00]/10 border border-neutral-200 p-2 rounded transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E00000]" />
                    <span className="text-neutral-800 font-bold text-[10px]">Real Estate</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFCC00]/5 hover:bg-[#FFCC00]/10 border border-neutral-200 p-2 rounded transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E00000]" />
                    <span className="text-neutral-800 font-bold text-[10px]">Transport</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFCC00]/5 hover:bg-[#FFCC00]/10 border border-neutral-200 p-2 rounded transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E00000]" />
                    <span className="text-neutral-800 font-bold text-[10px]">Service Logistics</span>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-100 hover:bg-[#FFCC00]/20 border border-neutral-200 p-2 rounded transition-all justify-center">
                    <span className="text-[#E00000] font-black text-[10px]">And More! ➔</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-2">
                <a 
                  href="#booking-card" 
                  onClick={() => setActiveDeckTab('business')} 
                  className="inline-block bg-[#E00000] hover:bg-black text-white px-8 py-3.5 rounded text-xs font-black tracking-widest uppercase transition-colors shadow-md"
                >
                  Explore Swift Supply Chain
                </a>
              </div>
            </div>

            {/* Image Block */}
            <div className="lg:col-span-7 h-[300px] lg:h-auto min-h-[350px] relative">
              <img 
                src="/images/warehouse_logistics_1779438256893.png" 
                alt="Enterprise Logistics Services" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* 2.4 SWIFT FOR YOUR BUSINESS (Yellow Banner) */}
      <section className="bg-[#FFCC00] text-black overflow-hidden relative z-10 border-b border-black/10 py-12 lg:py-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:min-h-[220px]">
            
            {/* Image slanted frame inside custom layout */}
            <div className="w-full md:w-1/3 shrink-0 self-stretch relative hidden md:block">
              <div className="absolute inset-y-0 left-0 right-4 overflow-hidden -skew-x-12 bg-black border-r-4 border-black">
                <img 
                  src="/images/delivery_shipper_1779438218388.png" 
                  alt="Corporate fleet expert" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-110 skew-x-12"
                />
              </div>
            </div>

            {/* Content block */}
            <div className="text-left flex-1 space-y-3.5 md:py-6">
              <h3 className="text-2xl md:text-3.5xl font-black text-black tracking-tight leading-none uppercase">
                SWIFT for Your Business
              </h3>
              <p className="text-xs md:text-sm font-bold text-neutral-800 max-w-2xl leading-relaxed">
                Power your small and medium-sized business success with world-class shipping and logistics. Our team of experts can help you address the ever changing need of your customers in real-time.
              </p>
            </div>

            <div className="pb-6 md:pb-0 shrink-0 select-none">
              <a 
                href="#booking-card" 
                onClick={() => setActiveDeckTab('business')} 
                className="inline-block bg-[#E00000] hover:bg-black text-white px-8 py-4 rounded text-xs font-black tracking-wider uppercase transition-colors shadow-lg whitespace-nowrap"
              >
                Explore Proposed Solutions
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5 IMPORTANT SERVICE UPDATES (News grid) */}
      <section className="bg-white py-16 md:py-24 border-b border-neutral-200 relative z-10" id="service-bulletins">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-left space-y-2.5 mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight leading-none uppercase">
              Important Service Updates
            </h2>
            <p className="text-[#E00000] font-black text-sm uppercase tracking-wide">
              Service bulletins keep you up to date with news and alerts
            </p>
            
            {/* Live Indicator List */}
            <div className="pt-2">
              <span 
                onClick={() => {
                  alert("Live Bulletin Operational Update Middle East: Strategic transport corridors fully operational. Air freight routing and transit corridors updated for zero transit degradation.");
                }}
                className="inline-flex items-center gap-2.5 text-xs font-black text-black hover:text-[#E00000] border-l-4 border-[#FFCC00] pl-3.5 transition-colors cursor-pointer"
              >
                <span className="text-[#E00000] animate-ping scale-75 inline-block text-[8px]">●</span>
                <span>Operational Update Middle East</span>
                <span className="text-[#E00000] font-black">➔</span>
              </span>
            </div>
          </div>

          {/* Three Column Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Live Field Operations */}
            <div className="group rounded-2xl overflow-hidden shadow-md border border-neutral-200 bg-white hover:shadow-xl transition-all flex flex-col">
              <div className="h-52 overflow-hidden relative bg-neutral-100">
                <img 
                  src="/images/courier_van_1779438295065.png" 
                  alt="Delivery Carrier Operations" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#FFCC00] text-black font-extrabold text-[9px] px-2.5 py-1 rounded tracking-wider uppercase shadow">
                  Fleet Drive
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow text-left">
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-neutral-900 group-hover:text-[#E00000] transition-colors leading-tight">
                    On the Road with Swift Squad
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                    See behind-the-scenes as our clean logistic fleets implement dynamic parcel loading pipelines to secure high-priority deliveries on shorter timelines.
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => alert("Learn more: Fully electric local fleet rollout complete across city hubs, saving tons of emissions.")}
                  className="text-xs font-extrabold text-[#E00000] flex items-center gap-1.5 mt-5 hover:underline text-left self-start"
                >
                  <span>Learn about fleet efforts</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

            {/* Card 2: AI Tech Lobby */}
            <div className="group rounded-2xl overflow-hidden shadow-md border border-neutral-200 bg-white hover:shadow-xl transition-all flex flex-col">
              <div className="h-52 overflow-hidden relative bg-neutral-100">
                <img 
                  src="/images/tech_lobby_1779438316950.png" 
                  alt="Welcome to the Future" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black text-[#FFCC00] font-extrabold text-[9px] px-2.5 py-1 rounded tracking-wider uppercase shadow">
                  Core AI Tech
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow text-left">
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-neutral-900 group-hover:text-[#E00000] transition-colors leading-tight">
                    Welcome to the Future
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                    We have successfully launched our multi-agent AI neural routing engine inside the regional terminal lobbies, cutting cross-dock staging errors to absolute zero.
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => alert("Learn more: Our automated route matrix matches high-priority air cargo routes with zero carbon offsets dynamically.")}
                  className="text-xs font-extrabold text-[#E00000] flex items-center gap-1.5 mt-5 hover:underline text-left self-start"
                >
                  <span>Read smart systems paper</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

            {/* Card 3: Global Trade Trends */}
            <div className="group rounded-2xl overflow-hidden shadow-md border border-neutral-200 bg-white hover:shadow-xl transition-all flex flex-col">
              <div className="h-52 overflow-hidden relative bg-neutral-100">
                <img 
                  src="/images/chart_collage_1779438336353.png" 
                  alt="Global Trade Analytics" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#FFCC00] text-black font-extrabold text-[9px] px-2.5 py-1 rounded tracking-wider uppercase shadow">
                  Global Policy
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow text-left">
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-neutral-900 group-hover:text-[#E00000] transition-colors leading-tight">
                    Trade Analytics Report
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                    Review our comprehensive research on international freight developments, maritime shipping tariffs, and air-freight pricing metrics for 2026.
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => alert("Report downloaded: Standard 2026 tariff indexes guide for air cargo lanes.")}
                  className="text-xs font-extrabold text-[#E00000] flex items-center gap-1.5 mt-5 hover:underline text-left self-start"
                >
                  <span>Download trade briefing</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2.6 BOTTOM DETAIL SECTION ("Navigating Latest Tariff Developments") */}
      <section className="bg-[#FFCC00] text-black py-20 relative z-10 border-b border-black/10" id="announcements">
        <div id="announcement-content" className="max-w-5xl mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left side: Beautiful courier image cut-out card */}
            <div className="w-full lg:w-2/5 shrink-0 select-none">
              <div className="relative inline-block mx-auto">
                <div className="absolute inset-0 bg-black/15 rounded-2xl translate-x-2.5 translate-y-3.5 skew-x-1" />
                <img 
                  src="/images/delivery_hero_background_1779437692703.png" 
                  alt="Logistics Professional Driver" 
                  referrerPolicy="no-referrer"
                  className="w-full max-w-sm h-64 object-cover object-top rounded-2xl relative z-10 border-4 border-black shadow"
                />
                <span className="absolute bottom-3 left-3 bg-black text-white px-3 py-1.5 text-[9px] font-extrabold block rounded tracking-widest z-20 uppercase">SWIFT CARGO SQUAD</span>
              </div>
            </div>

            {/* Right side: News announcement block matching exact structure & copy style */}
            <div className="text-left space-y-5 flex-1">
              
              <div className="bg-black text-[#FFCC00] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest inline-block rounded">
                CUSTOMS & POLICY UPDATES
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight leading-none uppercase">
                Navigating Latest Tariff Developments
              </h2>

              <p className="text-xs md:text-sm text-neutral-900 leading-relaxed font-bold">
                Global trade is becoming increasingly complex as new U.S. tariffs and varying reciprocal measures emerge across countries and industries. At SWIFTPOST, we are committed to helping you navigate these changes seamlessly. Our automated Custom Declaration API checks tariff databases instantly to flag exceptions before your cargo boards.
              </p>

              {/* Accordion / feature triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/40 hover:bg-white/85 p-4 rounded-xl border border-black/15 transition-all cursor-pointer">
                  <span className="font-extrabold text-xs block text-black">✓ Duty Calculator Integrator</span>
                  <span className="text-[11px] text-neutral-850 block mt-1.5 leading-relaxed">Estimate import duty rates and Harmonized System codes seamlessly on-the-fly.</span>
                </div>

                <div className="bg-white/40 hover:bg-white/85 p-4 rounded-xl border border-black/15 transition-all cursor-pointer">
                  <span className="font-extrabold text-xs block text-black">✓ Cargo Priority Boarding</span>
                  <span className="text-[11px] text-neutral-850 block mt-1.5 leading-relaxed">Customs authorized status allows packages to bypass standard queues dynamically.</span>
                </div>
              </div>

              {/* Call-to-action button */}
              <div className="pt-3 flex flex-wrap gap-5 items-center">
                <a 
                  href="#booking-card" 
                  onClick={() => setActiveDeckTab('business')}
                  className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase px-7 py-4 rounded shadow transition-all duration-300 inline-flex items-center gap-1.5"
                >
                  <span>Connect with tariff specialist</span>
                  <PhoneCall className="w-3.5 h-3.5 text-[#FFCC00]" />
                </a>

                <span className="text-xs font-bold text-black border-l-2 border-black/30 pl-4">
                  Call helpline cargo support: <strong>+1 (800) SWIFT-HELP</strong>
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 8. FOOTER MAP & BRAND CLUSTERS */}
      <footer className="bg-neutral-900 text-neutral-400 py-16 text-xs border-t border-neutral-800 relative z-10">
        <div id="footer-container" className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">Customer Service</h5>
              <ul className="space-y-2 font-semibold">
                <li><a href="#help" className="hover:text-yellow-400 transition-colors">Help Center Hub</a></li>
                <li><a href="#help" className="hover:text-yellow-400 transition-colors">Contact Support Agent</a></li>
                <li><a href="#help" className="hover:text-yellow-400 transition-colors">Digital Customs Assistant</a></li>
                <li><a href="#help" className="hover:text-yellow-400 transition-colors">Submit Claims Portal</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">Enterprise Solutions</h5>
              <ul className="space-y-2 font-semibold">
                <li><a href="#business" className="hover:text-yellow-400 transition-colors">DHL Inspired Global Freight</a></li>
                <li><a href="#business" className="hover:text-yellow-450 transition-colors">Supply Chain Optimization</a></li>
                <li><a href="#business" className="hover:text-yellow-400 transition-colors">Custom Warehousing Drops</a></li>
                <li><a href="#business" className="hover:text-yellow-400 transition-colors">Integrated API Plugins</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">About SWIFTPOST</h5>
              <ul className="space-y-2 font-semibold">
                <li><a href="#about" className="hover:text-yellow-400 transition-colors">Our Carbon Neutral Fleet</a></li>
                <li><a href="#about" className="hover:text-yellow-450 transition-colors">Locations & Drop-boxes</a></li>
                <li><a href="#about" className="hover:text-yellow-400 transition-colors">Investor Relations</a></li>
                <li><a href="#about" className="hover:text-yellow-400 transition-colors">Press Release Room</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">Swift Safety Certification</h5>
              <div className="space-y-3.5">
                <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                  Authorizations verified and secured with SSL routing. All shipments subject to Swift Standard Tariff Declaration Terms.
                </p>
                <div className="flex items-center gap-2 text-[#FFCC00] font-bold border border-[#FFCC00]/20 bg-[#FFCC00]/5 px-3 py-2 rounded w-fit">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>ISO 9001 Logistics</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-left w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-bold text-white italic tracking-tighter">SWIFTPOST INTERNATIONAL INC</span>
                <span className="text-neutral-700">|</span>
                <span className="text-xs font-mono tracking-widest text-[#FFCC00] uppercase font-bold bg-[#FFCC00]/10 px-2.5 py-1 rounded border border-[#FFCC00]/20">
                  product of gloom
                </span>
                <span className="text-neutral-700">|</span>
                <span className="text-[11px]">© 2026. All logistics rights reserved.</span>
              </div>
            </div>
            <div className="flex gap-4 font-semibold text-neutral-500 text-left w-full sm:w-auto justify-start sm:justify-end">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Principles</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition-colors">Legal Terms of Use</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Preferences</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top button */}
      {showBackToTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-[#E00000] text-white w-12 h-12 rounded-full shadow-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all text-xs font-black flex items-center justify-center border border-white/20 animate-fadeIn"
          title="Back to Top"
        >
          <span className="text-base font-black">▲</span>
        </button>
      )}

    </div>
  );
}

// Simple fallback helper function for scrolling translation calculations
function offsetDecimal(scrollY: number, multiplier: number) {
  return scrollY * multiplier;
}
