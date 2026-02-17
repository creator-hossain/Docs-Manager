
import { BusinessDocument, Asset, DocumentType } from '../types';
import { supabase } from './supabase';

export interface LogoSettings {
  logoUrl?: string;
  logoSize?: number;
  logoPosition?: number;
}

export interface UserPreferences {
  typeSettings: Partial<Record<DocumentType, LogoSettings>>;
}

// Documents Supabase Utils
export const loadDocuments = async (): Promise<BusinessDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('data')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ? data.map(item => item.data as BusinessDocument) : [];
  } catch (e) {
    console.error('Failed to load documents:', e);
    return [];
  }
};

export const addOrUpdateDocument = async (doc: BusinessDocument): Promise<BusinessDocument[]> => {
  try {
    const { error } = await supabase
      .from('documents')
      .upsert({ 
        id: doc.id, 
        data: doc,
        created_at: new Date(doc.createdAt).toISOString()
      }, { onConflict: 'id' });

    if (error) throw error;
    return await loadDocuments();
  } catch (error) {
    console.error('Failed to save document:', error);
    alert('Failed to save to cloud database.');
    return [];
  }
};

export const deleteDocument = async (id: string): Promise<BusinessDocument[]> => {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return await loadDocuments();
  } catch (e) {
    console.error('Failed to delete document:', e);
    return [];
  }
};

// Asset Library Supabase Utils
export const loadAssets = async (): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('data');

    if (error) throw error;
    return data ? data.map(item => item.data as Asset) : [];
  } catch (e) {
    console.error('Failed to load assets:', e);
    return [];
  }
};

export const saveAsset = async (asset: Asset): Promise<Asset[]> => {
  try {
    const { error } = await supabase
      .from('assets')
      .upsert({ id: asset.id, data: asset });

    if (error) throw error;
    return await loadAssets();
  } catch (error) {
    console.error('Failed to save asset:', error);
    return await loadAssets();
  }
};

export const deleteAsset = async (id: string): Promise<Asset[]> => {
  try {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return await loadAssets();
  } catch (e) {
    console.error('Failed to delete asset:', e);
    return [];
  }
};

// User Preferences Supabase Utils
export const saveTypePreferences = async (type: DocumentType, settings: LogoSettings) => {
  try {
    const currentPrefs = await loadPreferences();
    const updatedPrefs = {
      ...currentPrefs,
      typeSettings: {
        ...currentPrefs.typeSettings,
        [type]: settings
      }
    };
    
    await supabase
      .from('preferences')
      .upsert({ id: 'user_prefs', data: updatedPrefs });
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
};

export const loadPreferences = async (): Promise<UserPreferences> => {
  try {
    const { data, error } = await supabase
      .from('preferences')
      .select('data')
      .eq('id', 'user_prefs')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"
    return data ? (data.data as UserPreferences) : { typeSettings: {} };
  } catch (e) {
    return { typeSettings: {} };
  }
};

export const getTypePreferences = async (type: DocumentType): Promise<LogoSettings | undefined> => {
  const prefs = await loadPreferences();
  return prefs.typeSettings?.[type];
};
