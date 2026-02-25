
import React, { useState, useEffect } from 'react';
// Added Edit3 to the imports to resolve the "Cannot find name 'Edit3'" error
import { 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  Plus, 
  X, 
  Type, 
  Layers, 
  CheckCircle2, 
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
  Monitor
} from 'lucide-react';
import { Asset, AssetType, FooterSettings, HeaderSettings } from '../types';
import { 
  loadAssets, 
  saveAsset, 
  deleteAsset, 
  loadFooterSettings, 
  saveFooterSettings,
  loadHeaderSettings,
  saveHeaderSettings
} from '../utils/storage';

interface AssetLibraryProps {
  onClose?: () => void;
  onSelect?: (asset: Asset) => void;
  selectionMode?: boolean;
  filterType?: AssetType;
  onFooterUpdate?: () => void;
  onHeaderUpdate?: () => void;
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ onClose, onSelect, selectionMode = false, filterType, onFooterUpdate, onHeaderUpdate }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AssetType | 'ALL' | 'FOOTER'>(filterType || 'ALL');
  const [dragActive, setDragActive] = useState(false);
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

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      const data = await loadAssets();
      setAssets(data);
      setIsLoading(false);
    };
    fetchAssets();
    
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
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      const fileArray = Array.from(files) as File[];
      
      for (const file of fileArray) {
        const reader = new FileReader();
        const assetPromise = new Promise<void>((resolve) => {
          reader.onload = async () => {
            const newAsset: Asset = {
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              type: activeTab === 'ALL' || activeTab === 'FOOTER' ? AssetType.LOGO : activeTab as AssetType,
              dataUrl: reader.result as string,
              createdAt: Date.now()
            };
            const updated = await saveAsset(newAsset);
            setAssets(updated);
            resolve();
          };
        });
        reader.readAsDataURL(file);
        await assetPromise;
      }
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this asset from library?')) {
      setIsLoading(true);
      const updated = await deleteAsset(id);
      setAssets(updated);
      setIsLoading(false);
    }
  };

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

  const filteredAssets = assets.filter(a => activeTab === 'ALL' || a.type === activeTab);

  const inputClass = "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium outline-none focus:border-red-700/50 focus:bg-white/[0.08] text-white placeholder:text-white/20 transition-all focus:ring-4 focus:ring-red-700/10";
  const labelClass = "block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1";

  const ICON_OPTIONS = {
    address: [
      { name: 'MapPin', Icon: MapPin },
      { name: 'Map', Icon: Map },
      { name: 'Navigation', Icon: Navigation },
      { name: 'Home', Icon: Home },
    ],
    email: [
      { name: 'Mail', Icon: Mail },
      { name: 'Send', Icon: Send },
      { name: 'Inbox', Icon: Inbox },
      { name: 'MessageSquare', Icon: MessageSquare },
    ],
    phone: [
      { name: 'Phone', Icon: Phone },
      { name: 'Smartphone', Icon: Smartphone },
      { name: 'PhoneCall', Icon: PhoneCall },
      { name: 'Headset', Icon: Headset },
    ],
    website: [
      { name: 'Globe', Icon: Globe },
      { name: 'Link', Icon: Link },
      { name: 'ExternalLink', Icon: ExternalLink },
      { name: 'Monitor', Icon: Monitor },
    ]
  };

  const IconSelector = ({ current, options, onSelect }: { current?: string, options: { name: string, Icon: any }[], onSelect: (name: string) => void }) => (
    <div className="flex gap-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt.name}
          onClick={() => onSelect(opt.name)}
          className={`p-2 rounded-lg border transition-all ${current === opt.name ? 'bg-red-700 border-red-700 text-white shadow-lg shadow-red-700/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-red-700/50 hover:text-red-700'}`}
          title={opt.name}
        >
          <opt.Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );

  const getIconComponent = (name: string | undefined, defaultIcon: any) => {
    const allOptions = [...ICON_OPTIONS.address, ...ICON_OPTIONS.email, ...ICON_OPTIONS.phone, ...ICON_OPTIONS.website];
    const found = allOptions.find(o => o.name === name);
    return found ? found.Icon : defaultIcon;
  };

  const renderSpacedWebsite = (url: string) => {
    const domain = url.replace(/\s+/g, '').toLowerCase();
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

  return (
    <div className={`flex flex-col h-full bg-[#0a0a0b] text-white animate-in fade-in duration-300 ${selectionMode ? 'rounded-3xl border border-white/10 overflow-hidden' : ''}`}>
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-700/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Asset Repository</h2>
            <p className="text-[10px] font-black text-red-700 uppercase tracking-[0.3em]">Central Digital Assets Management</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-3 bg-white/5 rounded-full hover:bg-red-700 transition-all group">
            <X className="w-5 h-5 text-gray-500 group-hover:text-white" />
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-white/5 p-6 space-y-2 bg-black/10">
          {(['ALL', ...Object.values(AssetType), 'FOOTER'] as const).map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`w-full text-left px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${activeTab === type ? 'bg-red-700 text-white shadow-xl shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              {type === 'FOOTER' ? 'GLOBAL FOOTER' : type}
              {type !== 'FOOTER' && (
                <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === type ? 'bg-white/20' : 'bg-white/10'}`}>
                  {assets.filter(a => type === 'ALL' || a.type === type).length}
                </span>
              )}
            </button>
          ))}
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
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-red-700 animate-spin" />
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {activeTab !== 'ALL' && (
                  <label className="relative group cursor-pointer aspect-square bg-white/[0.03] border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center hover:border-red-700/50 hover:bg-red-700/5 transition-all">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-gray-500 group-hover:text-red-700" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-white">Upload New</span>
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                  </label>
                )}

                {filteredAssets.map(asset => (
                  <div 
                    key={asset.id} 
                    className="group relative aspect-square bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-4 flex flex-col items-center justify-center hover:bg-white/[0.05] hover:border-red-700/30 transition-all overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }} className="p-2 bg-black/60 rounded-lg text-red-500 hover:bg-red-700 hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1 w-full flex items-center justify-center p-4">
                      <img src={asset.dataUrl} alt={asset.name} className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform group-hover:scale-110 duration-500" />
                    </div>

                    <div className="w-full pt-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-white truncate px-2">{asset.name}</p>
                      <p className="text-[8px] font-bold text-red-700 uppercase tracking-widest mt-1 opacity-60">{asset.type}</p>
                    </div>

                    {selectionMode && (
                      <button 
                        onClick={() => onSelect?.(asset)}
                        className="absolute inset-0 bg-red-700/0 hover:bg-red-700/40 flex items-center justify-center transition-all group/select opacity-0 hover:opacity-100"
                      >
                        <CheckCircle2 className="w-12 h-12 text-white scale-0 group-hover/select:scale-100 transition-transform" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {filteredAssets.length === 0 && !isLoading && (
                <div className="h-[400px] flex flex-col items-center justify-center text-gray-700 opacity-30 italic">
                  <ImageIcon className="w-20 h-20 mb-6" />
                  <p className="text-2xl font-black uppercase tracking-widest">No assets found in category</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;
