
import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Plus, X, Type, Layers, CheckCircle2, Loader2 } from 'lucide-react';
import { Asset, AssetType } from '../types';
import { loadAssets, saveAsset, deleteAsset } from '../utils/storage';

interface AssetLibraryProps {
  onClose?: () => void;
  onSelect?: (asset: Asset) => void;
  selectionMode?: boolean;
  filterType?: AssetType;
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ onClose, onSelect, selectionMode = false, filterType }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AssetType | 'ALL'>(filterType || 'ALL');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      const data = await loadAssets();
      setAssets(data);
      setIsLoading(false);
    };
    fetchAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      // Fixed: Explicitly cast to File[] to avoid 'unknown' type errors during iteration
      const fileArray = Array.from(files) as File[];
      
      for (const file of fileArray) {
        const reader = new FileReader();
        const assetPromise = new Promise<void>((resolve) => {
          reader.onload = async () => {
            const newAsset: Asset = {
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              type: activeTab === 'ALL' ? AssetType.LOGO : activeTab as AssetType,
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

  const filteredAssets = assets.filter(a => activeTab === 'ALL' || a.type === activeTab);

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
          {(['ALL', ...Object.values(AssetType)] as const).map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`w-full text-left px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${activeTab === type ? 'bg-red-700 text-white shadow-xl shadow-red-700/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              {type}
              <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === type ? 'bg-white/20' : 'bg-white/10'}`}>
                {assets.filter(a => type === 'ALL' || a.type === type).length}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide relative">
          {isLoading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-red-700 animate-spin" />
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {/* Upload Card - Only visible when not in ALL tab */}
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
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;
