
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Type, 
  Layers, 
  Loader2, 
  Save, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Edit3,
  Map,
  Navigation,
  Home,
  Send,
  Inbox,
  MessageSquare,
  Smartphone,
  PhoneCall,
  Headset,
  Link,
  ExternalLink,
  Monitor,
  Zap,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { FooterSettings, HeaderSettings, HeroSettings } from '../types';
import { 
  loadFooterSettings, 
  saveFooterSettings,
  loadHeaderSettings, 
  saveHeaderSettings,
  loadHeroSettings,
  saveHeroSettings
} from '../utils/storage';

const HERO_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf048?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1493238555826-397b0d3f679a?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=2000"
];

interface GlobalSettingsProps {
  onClose: () => void;
  onFooterUpdate?: () => void;
  onHeaderUpdate?: () => void;
  onHeroUpdate?: () => void;
}

const ICON_OPTIONS = {
  address: ['MapPin', 'Map', 'Navigation', 'Home'],
  email: ['Mail', 'Send', 'Inbox', 'MessageSquare'],
  phone: ['Phone', 'Smartphone', 'PhoneCall', 'Headset'],
  website: ['Globe', 'Link', 'ExternalLink', 'Monitor']
};

const GlobalSettings: React.FC<GlobalSettingsProps> = ({ onClose, onFooterUpdate, onHeaderUpdate, onHeroUpdate }) => {
  const [activeTab, setActiveTab] = useState<'HEADER' | 'FOOTER' | 'HERO'>('HEADER');
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    address: '',
    addressIcon: 'MapPin',
    email: '',
    emailIcon: 'Mail',
    phone1: '',
    phone1Icon: 'Phone',
    phone2: '',
    phone2Icon: 'Phone',
    website: '',
    websiteIcon: 'Globe',
    bottomOffset: 10,
    topPadding: 0,
    horizontalPadding: 15,
    lineSpacing: 3
  });
  const [isSavingFooter, setIsSavingFooter] = useState(false);
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>({
    text: '',
    fontSize: 14,
    fontFamily: 'serif',
    alignment: 'left',
    isItalic: true
  });
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    selectedImages: [],
    transitionEffect: 'fade',
    interval: 5000
  });
  const [isSavingHero, setIsSavingHero] = useState(false);

  useEffect(() => {
    const fetchFooter = async () => {
      const settings = await loadFooterSettings();
      setFooterSettings(settings);
    };
    fetchFooter();

    const fetchHeader = async () => {
      const settings = await loadHeaderSettings();
      setHeaderSettings(settings);
    };
    fetchHeader();

    const fetchHero = async () => {
      const settings = await loadHeroSettings();
      setHeroSettings(settings);
    };
    fetchHero();
  }, []);

  const handleSaveFooter = async () => {
    setIsSavingFooter(true);
    await saveFooterSettings(footerSettings);
    setIsSavingFooter(false);
    if (onFooterUpdate) onFooterUpdate();
    alert('Global Footer settings secured successfully.');
  };

  const handleSaveHeader = async () => {
    setIsSavingHeader(true);
    await saveHeaderSettings(headerSettings);
    setIsSavingHeader(false);
    if (onHeaderUpdate) onHeaderUpdate();
    alert('Global Header settings secured successfully.');
  };

  const handleSaveHero = async () => {
    if (heroSettings.selectedImages.length === 0) {
      alert('Please select at least one image for the hero banner.');
      return;
    }
    setIsSavingHero(true);
    await saveHeroSettings(heroSettings);
    setIsSavingHero(false);
    if (onHeroUpdate) onHeroUpdate();
    alert('Hero Banner settings secured successfully.');
  };

  const getIconComponent = (name: string | undefined, fallback: any) => {
    const icons: Record<string, any> = {
      MapPin, Map, Navigation, Home,
      Mail, Send, Inbox, MessageSquare,
      Phone, Smartphone, PhoneCall, Headset,
      Globe, Link, ExternalLink, Monitor
    };
    return (name && icons[name]) || fallback;
  };

  const IconSelector = ({ current, options, onSelect }: { current: string | undefined, options: string[], onSelect: (name: string) => void }) => (
    <div className="flex gap-2 mt-2">
      {options.map(name => {
        const Icon = getIconComponent(name, Globe);
        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`p-2 rounded-lg border transition-all ${current === name ? 'bg-red-700 border-red-700 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );

  const renderSpacedWebsite = (url: string) => {
    const domain = url.replace(/\s+/g, '');
    return (
      <div className="web-url text-[15px] mt-[5px] tracking-[4px] font-sans text-black lowercase text-center font-bold">
        {domain.split('').map((char, i) => (
          <React.Fragment key={i}>
            <span className={char === 'g' || char === 'd' ? 'text-red-600' : 'text-black'}>{char}</span>
            {i < domain.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const labelClass = "text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2";
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-700/50 transition-all placeholder:text-gray-700 font-bold";

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-10 animate-in fade-in duration-500">
      <div className="bg-[#0a0a0b] w-full max-w-6xl h-full max-h-[90vh] rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-700/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        {/* Header */}
        <div className="px-12 py-10 border-b border-white/5 flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Global <span className="text-red-700">Settings</span></h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-2">Configure System-wide Document Assets</p>
          </div>
          <button 
            onClick={onClose}
            className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-red-700 hover:text-white transition-all group active:scale-90"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-white/5 p-6 space-y-2 bg-black/10">
            <button
              onClick={() => setActiveTab('HEADER')}
              className={`w-full text-left px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'HEADER' ? 'bg-red-700 text-white shadow-xl shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              GLOBAL HEADER
            </button>
            <button
              onClick={() => setActiveTab('FOOTER')}
              className={`w-full text-left px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'FOOTER' ? 'bg-red-700 text-white shadow-xl shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              GLOBAL FOOTER
            </button>
            <button
              onClick={() => setActiveTab('HERO')}
              className={`w-full text-left px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'HERO' ? 'bg-red-700 text-white shadow-xl shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              HERO BANNER
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-10 scrollbar-hide relative">
            {activeTab === 'FOOTER' ? (
              <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-10 duration-500">
                 <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 bg-red-700/10 rounded-xl flex items-center justify-center text-red-700">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-widest">Footer Content Editor</h3>
                        <p className="text-[10px] font-bold text-gray-600 uppercase">Synchronize across all documents</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={labelClass}>Location (Address)</label>
                        <div className="relative">
                          {React.createElement(getIconComponent(footerSettings.addressIcon, MapPin), { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" })}
                          <input 
                            type="text" 
                            value={footerSettings.address || ''} 
                            onChange={(e) => setFooterSettings({...footerSettings, address: e.target.value})} 
                            className={`${inputClass} !pl-12`} 
                          />
                        </div>
                        <IconSelector 
                          current={footerSettings.addressIcon} 
                          options={ICON_OPTIONS.address} 
                          onSelect={(name) => setFooterSettings({...footerSettings, addressIcon: name})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Email Contact</label>
                        <div className="relative">
                          {React.createElement(getIconComponent(footerSettings.emailIcon, Mail), { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" })}
                          <input 
                            type="text" 
                            value={footerSettings.email || ''} 
                            onChange={(e) => setFooterSettings({...footerSettings, email: e.target.value})} 
                            className={`${inputClass} !pl-12`} 
                          />
                        </div>
                        <IconSelector 
                          current={footerSettings.emailIcon} 
                          options={ICON_OPTIONS.email} 
                          onSelect={(name) => setFooterSettings({...footerSettings, emailIcon: name})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Phone Line 1</label>
                        <div className="relative">
                          {React.createElement(getIconComponent(footerSettings.phone1Icon, Phone), { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" })}
                          <input 
                            type="text" 
                            value={footerSettings.phone1 || ''} 
                            onChange={(e) => setFooterSettings({...footerSettings, phone1: e.target.value})} 
                            className={`${inputClass} !pl-12`} 
                          />
                        </div>
                        <IconSelector 
                          current={footerSettings.phone1Icon} 
                          options={ICON_OPTIONS.phone} 
                          onSelect={(name) => setFooterSettings({...footerSettings, phone1Icon: name})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Phone Line 2 (Optional)</label>
                        <div className="relative">
                          {React.createElement(getIconComponent(footerSettings.phone2Icon, Phone), { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" })}
                          <input 
                            type="text" 
                            value={footerSettings.phone2 || ''} 
                            onChange={(e) => setFooterSettings({...footerSettings, phone2: e.target.value})} 
                            className={`${inputClass} !pl-12`} 
                          />
                        </div>
                        <IconSelector 
                          current={footerSettings.phone2Icon} 
                          options={ICON_OPTIONS.phone} 
                          onSelect={(name) => setFooterSettings({...footerSettings, phone2Icon: name})} 
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className={labelClass}>Official Website URL</label>
                        <div className="relative">
                          {React.createElement(getIconComponent(footerSettings.websiteIcon, Globe), { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" })}
                          <input 
                            type="text" 
                            value={footerSettings.website || ''} 
                            onChange={(e) => setFooterSettings({...footerSettings, website: e.target.value})} 
                            className={`${inputClass} !pl-12`} 
                          />
                        </div>
                        <IconSelector 
                          current={footerSettings.websiteIcon} 
                          options={ICON_OPTIONS.website} 
                          onSelect={(name) => setFooterSettings({...footerSettings, websiteIcon: name})} 
                        />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-8">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-red-700/10 rounded-xl flex items-center justify-center text-red-700">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-widest">Layout & Spacing</h3>
                          <p className="text-[10px] font-bold text-gray-600 uppercase">Fine-tune footer positioning</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center">
                            <span className={labelClass}>Bottom Offset (mm)</span>
                            <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{footerSettings.bottomOffset}mm</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="50" 
                            value={footerSettings.bottomOffset ?? 10} 
                            onChange={(e) => setFooterSettings({...footerSettings, bottomOffset: parseInt(e.target.value)})} 
                            className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                          />
                        </div>

                        <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center">
                            <span className={labelClass}>Top Padding (mm)</span>
                            <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{footerSettings.topPadding}mm</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="30" 
                            value={footerSettings.topPadding ?? 0} 
                            onChange={(e) => setFooterSettings({...footerSettings, topPadding: parseInt(e.target.value)})} 
                            className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                          />
                        </div>

                        <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center">
                            <span className={labelClass}>Horizontal Padding (mm)</span>
                            <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{footerSettings.horizontalPadding}mm</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="50" 
                            value={footerSettings.horizontalPadding ?? 15} 
                            onChange={(e) => setFooterSettings({...footerSettings, horizontalPadding: parseInt(e.target.value)})} 
                            className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                          />
                        </div>

                        <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center">
                            <span className={labelClass}>Line Spacing (mm)</span>
                            <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{footerSettings.lineSpacing}mm</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="30" 
                            value={footerSettings.lineSpacing ?? 3} 
                            onChange={(e) => setFooterSettings({...footerSettings, lineSpacing: parseInt(e.target.value)})} 
                            className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveFooter}
                      disabled={isSavingFooter}
                      className="w-full py-5 bg-red-700 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-red-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-700/20 active:scale-95 disabled:opacity-50"
                    >
                      {isSavingFooter ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                      Save Changes Globally
                    </button>
                 </div>

                 {/* Footer Specific Preview */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Real-time Footer Preview</span>
                      <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group h-[250px]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-red-700/5 blur-3xl rounded-full"></div>
                      <div 
                        className="footer-render absolute left-0 right-0 z-10" 
                        style={{ 
                          bottom: `${footerSettings.bottomOffset ?? 10}mm`,
                          paddingLeft: `${footerSettings.horizontalPadding ?? 15}mm`,
                          paddingRight: `${footerSettings.horizontalPadding ?? 15}mm`,
                          paddingTop: `${footerSettings.topPadding ?? 0}mm`
                        }}
                      >
                        <div className="h-px bg-red-600/30 w-full" style={{ marginBottom: `${footerSettings.lineSpacing ?? 3}mm` }}></div>
                        <div className="flex justify-center items-center gap-4 text-[11px] text-black font-bold flex-wrap">
                          <span className="flex items-center gap-1 text-black">
                            <span className="text-red-600">
                              {React.createElement(getIconComponent(footerSettings.addressIcon, MapPin), { className: "w-3 h-3" })}
                            </span> 
                            {footerSettings.address || '---'}
                          </span>
                          <span className="flex items-center gap-1 text-black">
                            <span className="text-red-600">
                              {React.createElement(getIconComponent(footerSettings.emailIcon, Mail), { className: "w-3 h-3" })}
                            </span> 
                            {footerSettings.email || '---'}
                          </span>
                          <span className="flex items-center gap-1 text-black">
                            <span className="text-red-600">
                              {React.createElement(getIconComponent(footerSettings.phone1Icon, Phone), { className: "w-3 h-3" })}
                            </span> 
                            {footerSettings.phone1 || '---'}
                          </span>
                          {footerSettings.phone2 && (
                            <span className="flex items-center gap-1 text-black">
                              <span className="text-red-600">
                                {React.createElement(getIconComponent(footerSettings.phone2Icon, Phone), { className: "w-3 h-3" })}
                              </span> 
                              {footerSettings.phone2}
                            </span>
                          )}
                        </div>
                        {footerSettings.website && renderSpacedWebsite(footerSettings.website)}
                      </div>
                    </div>
                 </div>
              </div>
            ) : activeTab === 'HEADER' ? (
              <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-10 duration-500">
                 {/* Header Content Editor */}
                 <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 bg-red-700/10 rounded-xl flex items-center justify-center text-red-700">
                        <Type className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-widest">Header Content Editor</h3>
                        <p className="text-[10px] font-bold text-gray-600 uppercase">Top Bar Customization</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className={labelClass}>Header Text Content</label>
                        <input 
                          type="text" 
                          value={headerSettings.text || ''} 
                          onChange={(e) => setHeaderSettings({...headerSettings, text: e.target.value})} 
                          className={inputClass} 
                          placeholder="e.g. Importer & All kinds of Brand new & Reconditioned Vehicles Supplier"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className={labelClass}>Font Family</label>
                          <select 
                            value={headerSettings.fontFamily || 'serif'} 
                            onChange={(e) => setHeaderSettings({...headerSettings, fontFamily: e.target.value})}
                            className={inputClass}
                          >
                            <option value="serif">Serif (Classic)</option>
                            <option value="sans">Sans-Serif (Modern)</option>
                            <option value="mono">Monospace (Technical)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>Text Alignment</label>
                          <div className="flex bg-white/5 rounded-2xl p-1 gap-1 border border-white/10">
                            {(['left', 'center', 'right'] as const).map((align) => (
                              <button
                                key={align}
                                type="button"
                                onClick={() => setHeaderSettings({ ...headerSettings, alignment: align })}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${headerSettings.alignment === align ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                              >
                                {align}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center">
                            <span className={labelClass}>Font Size (px)</span>
                            <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{headerSettings.fontSize}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="8" 
                            max="32" 
                            value={headerSettings.fontSize ?? 14} 
                            onChange={(e) => setHeaderSettings({...headerSettings, fontSize: parseInt(e.target.value)})} 
                            className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                          />
                        </div>
                        <div className="flex items-center justify-between bg-black/20 p-5 rounded-2xl border border-white/5">
                          <span className={labelClass}>Italic Style</span>
                          <button 
                            onClick={() => setHeaderSettings({...headerSettings, isItalic: !headerSettings.isItalic})}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${headerSettings.isItalic ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                          >
                            {headerSettings.isItalic ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveHeader}
                      disabled={isSavingHeader}
                      className="w-full py-5 bg-red-700 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-red-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-700/20 active:scale-95 disabled:opacity-50"
                    >
                      {isSavingHeader ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                      Save Header Settings
                    </button>
                 </div>

                 {/* Header Specific Preview */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Real-time Header Preview</span>
                      <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group p-10 flex items-center justify-center min-h-[150px]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-red-700/5 blur-3xl rounded-full"></div>
                      <div className="w-full bg-[#e5e7eb] py-2 px-4 border-y border-gray-300">
                        <div 
                          style={{ 
                            textAlign: headerSettings.alignment || 'left',
                            fontSize: `${headerSettings.fontSize || 14}px`,
                            fontFamily: headerSettings.fontFamily === 'serif' ? 'serif' : headerSettings.fontFamily === 'mono' ? 'monospace' : 'sans-serif',
                            fontStyle: headerSettings.isItalic ? 'italic' : 'normal',
                            color: '#4b5563',
                            fontWeight: '500'
                          }}
                        >
                          {headerSettings.text || 'Header Text Preview'}
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-10 duration-500">
                <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-red-700/10 rounded-xl flex items-center justify-center text-red-700">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-widest">Hero Banner Settings</h3>
                      <p className="text-[10px] font-bold text-gray-600 uppercase">Website Background Control</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Select Banner Images</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {HERO_IMAGE_POOL.map((url, idx) => {
                          const isSelected = heroSettings.selectedImages.includes(url);
                          return (
                            <div 
                              key={idx} 
                              onClick={() => {
                                if (isSelected) {
                                  setHeroSettings({
                                    ...heroSettings,
                                    selectedImages: heroSettings.selectedImages.filter(img => img !== url)
                                  });
                                } else {
                                  setHeroSettings({
                                    ...heroSettings,
                                    selectedImages: [...heroSettings.selectedImages, url]
                                  });
                                }
                              }}
                              className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${isSelected ? 'border-red-700 scale-95 shadow-xl shadow-red-700/20' : 'border-transparent hover:border-white/20'}`}
                            >
                              <img src={url} alt={`Car ${idx}`} className="w-full h-full object-cover" />
                              {isSelected && (
                                <div className="absolute inset-0 bg-red-700/20 flex items-center justify-center">
                                  <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                              )}
                              <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[8px] font-black text-white uppercase">
                                Image {idx + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                        <label className={labelClass}>Transition Effect</label>
                        <div className="flex bg-white/5 rounded-2xl p-1 gap-1 border border-white/10">
                          {(['fade', 'slide', 'zoom'] as const).map((effect) => (
                            <button
                              key={effect}
                              type="button"
                              onClick={() => setHeroSettings({ ...heroSettings, transitionEffect: effect })}
                              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${heroSettings.transitionEffect === effect ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                              {effect}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center">
                          <span className={labelClass}>Auto-change Interval (ms)</span>
                          <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{heroSettings.interval}ms</span>
                        </div>
                        <input 
                          type="range" 
                          min="2000" 
                          max="15000" 
                          step="500"
                          value={heroSettings.interval} 
                          onChange={(e) => setHeroSettings({...heroSettings, interval: parseInt(e.target.value)})} 
                          className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveHero}
                    disabled={isSavingHero}
                    className="w-full py-5 bg-red-700 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-red-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-700/20 active:scale-95 disabled:opacity-50"
                  >
                    {isSavingHero ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Hero Settings
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Selected Images Summary</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {heroSettings.selectedImages.map((url, i) => (
                      <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                        <img src={url} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {heroSettings.selectedImages.length === 0 && (
                      <p className="text-[10px] font-bold text-gray-700 uppercase italic">No images selected</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;
