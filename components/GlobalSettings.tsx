
import React, { useState, useEffect } from 'react';
import { FooterSettings, HeaderSettings, HeroSettings, DocumentType, AssetType, Asset } from '../types';
import { 
  loadFooterSettings, 
  saveFooterSettings,
  loadAllHeaderSettings, 
  saveAllHeaderSettings,
  loadHeroSettings,
  saveHeroSettings,
  loadAssets
} from '../utils/storage';
import { DOC_TYPES_CONFIG } from '../constants';
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
  CheckCircle2,
  Maximize2,
  MoveHorizontal,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Database,
  Trash2
} from 'lucide-react';
import AssetLibrary from './AssetLibrary';

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
  const [allHeaderSettings, setAllHeaderSettings] = useState<Record<DocumentType, HeaderSettings>>({
    [DocumentType.INVOICE]: { text: '', fontSize: 14, fontFamily: 'serif', alignment: 'left', isItalic: true, logoUrl: '', logoSize: 220, logoPosition: 0 },
    [DocumentType.QUOTATION]: { text: '', fontSize: 14, fontFamily: 'serif', alignment: 'left', isItalic: true, logoUrl: '', logoSize: 220, logoPosition: 0 },
    [DocumentType.BILL]: { text: '', fontSize: 14, fontFamily: 'serif', alignment: 'left', isItalic: true, logoUrl: '', logoSize: 220, logoPosition: 0 },
    [DocumentType.CHALLAN]: { text: '', fontSize: 14, fontFamily: 'serif', alignment: 'left', isItalic: true, logoUrl: '', logoSize: 220, logoPosition: 0 },
    [DocumentType.PRO_INVOICE]: { text: '', fontSize: 14, fontFamily: 'serif', alignment: 'left', isItalic: true, logoUrl: '', logoSize: 220, logoPosition: 0 }
  });
  const [selectedHeaderType, setSelectedHeaderType] = useState<DocumentType>(DocumentType.INVOICE);
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    selectedImages: [],
    transitionEffect: 'fade',
    interval: 5000,
    backgroundPosition: '50% 50%',
    imagePositions: {}
  });
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState<{ open: boolean; target: string; type: AssetType } | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      const settings = await loadFooterSettings();
      setFooterSettings(settings);
    };
    fetchFooter();

    const fetchHeader = async () => {
      const settings = await loadAllHeaderSettings();
      setAllHeaderSettings(settings);
    };
    fetchHeader();

    const fetchAssets = async () => {
      setIsLoadingAssets(true);
      const loadedAssets = await loadAssets();
      setAssets(loadedAssets.filter(a => a.type === AssetType.LOGO));
      setIsLoadingAssets(false);
    };
    fetchAssets();

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
    await saveAllHeaderSettings(allHeaderSettings);
    setIsSavingHeader(false);
    if (onHeaderUpdate) onHeaderUpdate();
    alert('Global Header settings secured successfully.');
  };

  const currentHeader = allHeaderSettings[selectedHeaderType];

  const updateCurrentHeader = (updates: Partial<HeaderSettings>) => {
    setAllHeaderSettings(prev => ({
      ...prev,
      [selectedHeaderType]: { ...prev[selectedHeaderType], ...updates }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCurrentHeader({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newUrl = reader.result as string;
        if (!heroSettings.selectedImages.includes(newUrl)) {
          setHeroSettings({
            ...heroSettings,
            selectedImages: [...heroSettings.selectedImages, newUrl]
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAssetSelect = (asset: Asset) => {
    if (showAssetPicker) {
      updateCurrentHeader({ logoUrl: asset.dataUrl });
      setShowAssetPicker(null);
    }
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
    <div className="fixed inset-0 z-[150] bg-[#0a0a0b] animate-in fade-in duration-500">
      <div className="w-full h-full flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-700/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        {/* Header */}
        <div className="px-12 py-10 border-b border-white/5 flex justify-between items-center relative z-10 bg-black/20 backdrop-blur-md">
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
              <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-right-10 duration-500">
                 {/* Document Type Selector */}
                 <div className="flex flex-wrap items-center gap-4 bg-white/5 p-3 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                    {Object.entries(DOC_TYPES_CONFIG).map(([type, config]) => {
                      const isActive = selectedHeaderType === type;
                      return (
                        <button 
                          key={type}
                          onClick={() => setSelectedHeaderType(type as DocumentType)}
                          className={`px-6 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${isActive ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                          {React.cloneElement(config.icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
                          {config.label}
                        </button>
                      );
                    })}
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-10">
                       {/* Header Content Editor */}
                       <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-red-700/10 rounded-xl flex items-center justify-center text-red-700">
                              <Type className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-black uppercase tracking-widest">Header Content Editor</h3>
                              <p className="text-[10px] font-bold text-gray-600 uppercase">Top Bar Customization for {DOC_TYPES_CONFIG[selectedHeaderType].label}</p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <label className={labelClass}>Header Text Content</label>
                              <input 
                                type="text" 
                                value={currentHeader.text || ''} 
                                onChange={(e) => updateCurrentHeader({ text: e.target.value })} 
                                className={inputClass} 
                                placeholder="e.g. Importer & All kinds of Brand new & Reconditioned Vehicles Supplier"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className={labelClass}>Font Family</label>
                                <select 
                                  value={currentHeader.fontFamily || 'serif'} 
                                  onChange={(e) => updateCurrentHeader({ fontFamily: e.target.value })}
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
                                      onClick={() => updateCurrentHeader({ alignment: align })}
                                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentHeader.alignment === align ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
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
                                  <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{currentHeader.fontSize}px</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="8" 
                                  max="32" 
                                  value={currentHeader.fontSize ?? 14} 
                                  onChange={(e) => updateCurrentHeader({ fontSize: parseInt(e.target.value) })} 
                                  className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                                />
                              </div>
                              <div className="flex items-center justify-between bg-black/20 p-5 rounded-2xl border border-white/5">
                                <span className={labelClass}>Italic Style</span>
                                <button 
                                  onClick={() => updateCurrentHeader({ isItalic: !currentHeader.isItalic })}
                                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentHeader.isItalic ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                                >
                                  {currentHeader.isItalic ? 'Enabled' : 'Disabled'}
                                </button>
                              </div>
                            </div>
                          </div>
                       </div>

                       {/* Brand Customization (Moved from Document Forms) */}
                       <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-red-700/10 rounded-xl flex items-center justify-center text-red-700">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-black uppercase tracking-widest">Brand Customization</h3>
                              <p className="text-[10px] font-bold text-gray-600 uppercase">Logo & Positioning for {DOC_TYPES_CONFIG[selectedHeaderType].label}</p>
                            </div>
                          </div>

                           <div className="space-y-6">
                             <div className="bg-black/40 p-8 rounded-3xl border border-white/5 flex items-center gap-8">
                                <div className="w-32 h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
                                   {currentHeader.logoUrl ? (
                                     <img src={currentHeader.logoUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                                   ) : (
                                     <ImageIcon className="w-10 h-10 text-white/10" />
                                   )}
                                </div>
                                <div className="flex-1 space-y-4">
                                   <div className="flex flex-col gap-3">
                                      <label className="w-full bg-red-700 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-red-800 transition-all text-[11px] font-black uppercase tracking-widest active:scale-95 shadow-xl shadow-red-700/20 border border-red-600/50 text-center flex items-center justify-center gap-2 whitespace-nowrap">
                                        <Upload className="w-4 h-4 shrink-0" /> Upload New Logo
                                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                      </label>
                                      <button 
                                        type="button" 
                                        onClick={() => setShowAssetPicker({ open: true, target: 'logoUrl', type: AssetType.LOGO })}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95 whitespace-nowrap"
                                      >
                                        <Database className="w-4 h-4 shrink-0" /> Asset Library
                                      </button>
                                   </div>
                                </div>
                             </div>

                             <div>
                                <label className={labelClass}>Quick Select from Library</label>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mt-4">
                                  {assets.map((asset) => (
                                    <div 
                                      key={asset.id}
                                      onClick={() => updateCurrentHeader({ logoUrl: asset.dataUrl })}
                                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${currentHeader.logoUrl === asset.dataUrl ? 'border-red-700 bg-red-700/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                    >
                                      <img src={asset.dataUrl} alt={asset.name} className="w-full h-full object-contain p-2" />
                                      {currentHeader.logoUrl === asset.dataUrl && (
                                        <div className="absolute top-1 right-1">
                                          <CheckCircle2 className="w-3 h-3 text-red-700" />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  {assets.length === 0 && !isLoadingAssets && (
                                    <div className="col-span-full py-6 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No Logos in Library</p>
                                    </div>
                                  )}
                                </div>
                             </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center">
                                  <span className={labelClass}>Logo Scale</span>
                                  <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{currentHeader.logoSize ?? 220}px</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Maximize2 className="w-4 h-4 text-gray-600" />
                                  <input 
                                    type="range" 
                                    min="50" 
                                    max="500" 
                                    value={currentHeader.logoSize ?? 220} 
                                    onChange={(e) => updateCurrentHeader({ logoSize: parseInt(e.target.value) })} 
                                    className="flex-1 accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                                  />
                                </div>
                              </div>
                              <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center">
                                  <span className={labelClass}>Horizontal Offset</span>
                                  <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded-md">{currentHeader.logoPosition ?? 0}px</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <MoveHorizontal className="w-4 h-4 text-gray-600" />
                                  <input 
                                    type="range" 
                                    min="-200" 
                                    max="200" 
                                    value={currentHeader.logoPosition ?? 0} 
                                    onChange={(e) => updateCurrentHeader({ logoPosition: parseInt(e.target.value) })} 
                                    className="flex-1 accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                       </div>

                       <button 
                          onClick={handleSaveHeader}
                          disabled={isSavingHeader}
                          className="w-full py-5 bg-red-700 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-red-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-700/20 active:scale-95 disabled:opacity-50"
                        >
                          {isSavingHeader ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                          Save All Header Settings
                        </button>
                    </div>

                    {/* Header Specific Preview */}
                    <div className="space-y-6 sticky top-0 self-start z-20">
                       <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Real-time Header Preview ({DOC_TYPES_CONFIG[selectedHeaderType].label})</span>
                         <div className="h-px flex-1 bg-white/5"></div>
                       </div>
                       <div className="bg-white rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group p-0 flex flex-col h-[280px]">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/5 blur-3xl rounded-full"></div>
                          <div className="w-full p-0 flex flex-col">
                             <div className="flex pt-[5mm] mb-[5px] w-full">
                                <div className="logo-container" style={{ width: `${currentHeader.logoSize || 220}px`, marginLeft: `${currentHeader.logoPosition || 0}px` }}>
                                   {currentHeader.logoUrl && <img src={currentHeader.logoUrl} alt="Logo" className="w-full block" />}
                                </div>
                             </div>
                             <div className="w-full bg-[#e5e7eb] py-2 px-4 border-y border-gray-300 mb-6">
                                <div 
                                  style={{ 
                                    textAlign: currentHeader.alignment || 'left',
                                    fontSize: `${currentHeader.fontSize || 14}px`,
                                    fontFamily: currentHeader.fontFamily === 'serif' ? 'serif' : currentHeader.fontFamily === 'mono' ? 'monospace' : 'sans-serif',
                                    fontStyle: currentHeader.isItalic ? 'italic' : 'normal',
                                    color: '#4b5563',
                                    fontWeight: '500'
                                  }}
                                >
                                  {currentHeader.text || 'Importer & All kinds of Brand new & Reconditioned Vehicles Supplier'}
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="p-6 bg-red-700/5 rounded-[2rem] border border-red-700/10">
                          <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest leading-relaxed text-center">
                            This is a real-time preview of your header section. Changes are applied instantly.
                          </p>
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
                      <div className="flex justify-between items-center mb-4">
                        <label className={labelClass}>Select Banner Images</label>
                        <label className="bg-red-700 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-red-800 transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-red-700/20 flex items-center gap-2">
                          <Upload className="w-3 h-3" /> Add Custom Image
                          <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {Array.from(new Set([...HERO_IMAGE_POOL, ...heroSettings.selectedImages])).map((url, idx) => {
                          const isSelected = heroSettings.selectedImages.includes(url);
                          const isCustom = !HERO_IMAGE_POOL.includes(url);
                          return (
                            <div 
                              key={idx} 
                              className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${isSelected ? 'border-red-700 scale-95 shadow-xl shadow-red-700/20' : 'border-transparent hover:border-white/20'}`}
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
                            >
                              <img src={url} alt={`Banner ${idx}`} className="w-full h-full object-cover" />
                              {isSelected && (
                                <div className="absolute inset-0 bg-red-700/20 flex items-center justify-center">
                                  <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                              )}
                              
                              {isCustom && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHeroSettings({
                                      ...heroSettings,
                                      selectedImages: heroSettings.selectedImages.filter(img => img !== url)
                                    });
                                  }}
                                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors z-10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}

                              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[8px] font-black text-white uppercase">
                                {isCustom ? 'Custom' : `Preset ${idx + 1}`}
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
                          value={heroSettings.interval ?? 5000} 
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
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Selected Images & Precision Focus</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {heroSettings.selectedImages.map((url, i) => {
                      const pos = (heroSettings.imagePositions && heroSettings.imagePositions[url]) || { x: 50, y: 50 };
                      
                      const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                        
                        const newPositions = { ...(heroSettings.imagePositions || {}) };
                        newPositions[url] = { x, y };
                        setHeroSettings({ ...heroSettings, imagePositions: newPositions });
                      };

                      return (
                        <div key={i} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image {i + 1} Preview</span>
                              <span className="text-[10px] font-black text-red-700 bg-red-700/10 px-3 py-1 rounded-full">X: {pos.x}% | Y: {pos.y}%</span>
                            </div>
                            <div 
                              className="relative aspect-video rounded-3xl overflow-hidden cursor-crosshair border border-white/10 group"
                              onClick={handleImageClick}
                            >
                              <img src={url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                              
                              {/* Focus Marker */}
                              <div 
                                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                              >
                                <div className="absolute inset-0 bg-red-700 rounded-full blur-md opacity-50 animate-pulse"></div>
                                <div className="relative w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                                  <div className="w-1 h-1 bg-white rounded-full"></div>
                                </div>
                                <div className="absolute h-8 w-px bg-white/50"></div>
                                <div className="absolute w-8 h-px bg-white/50"></div>
                              </div>
                              
                              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-white text-center uppercase tracking-widest">
                                Click anywhere on the image to set focus point
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col justify-center space-y-8">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <label className={labelClass}>Horizontal Focus (X-Axis)</label>
                                <span className="text-[10px] font-black text-red-700">{pos.x}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={pos.x} 
                                onChange={(e) => {
                                  const newPositions = { ...(heroSettings.imagePositions || {}) };
                                  newPositions[url] = { ...pos, x: parseInt(e.target.value) };
                                  setHeroSettings({ ...heroSettings, imagePositions: newPositions });
                                }} 
                                className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                              />
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <label className={labelClass}>Vertical Focus (Y-Axis)</label>
                                <span className="text-[10px] font-black text-red-700">{pos.y}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={pos.y} 
                                onChange={(e) => {
                                  const newPositions = { ...(heroSettings.imagePositions || {}) };
                                  newPositions[url] = { ...pos, y: parseInt(e.target.value) };
                                  setHeroSettings({ ...heroSettings, imagePositions: newPositions });
                                }} 
                                className="w-full accent-red-700 h-1.5 bg-white/5 rounded-lg cursor-pointer appearance-none" 
                              />
                            </div>

                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                              <p className="text-[9px] text-gray-500 font-bold leading-relaxed uppercase tracking-wider">
                                Tip: The focus point ensures that this specific part of the image remains visible on all screen sizes.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {heroSettings.selectedImages.length === 0 && (
                      <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
                        <ImageIcon className="w-12 h-12 text-gray-700 mb-4" />
                        <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest">No images selected for the banner</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAssetPicker && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-20 animate-in zoom-in duration-300">
          <div className="w-full max-w-6xl h-full shadow-2xl relative">
            <AssetLibrary 
              selectionMode 
              onSelect={handleAssetSelect} 
              onClose={() => setShowAssetPicker(null)} 
              filterType={showAssetPicker.type}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSettings;
