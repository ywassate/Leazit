import React from 'react';
import { Edit3, Save, X, Eye, EyeOff } from 'lucide-react';

interface ProfileFieldProps {
  field: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  displayValue: string;
  isEditing: boolean;
  editValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  error?: string;
  saving?: boolean;
  type?: string;
  placeholder?: string;
  canToggleMask?: boolean;
  showMasked?: boolean;
  onToggleMask?: () => void;
  required?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  field,
  label,
  icon,
  value,
  displayValue,
  isEditing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  error,
  saving = false,
  type = 'text',
  placeholder,
  canToggleMask = false,
  showMasked = false,
  onToggleMask,
  required = false
}) => {
  const isEmpty = !value || value === 'Non renseigné';
  
  return (
    <div className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border-2 ${
      isEmpty ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-transparent hover:border-blue-100'
    }`}>
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 shadow-lg ${
              isEmpty 
                ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                : 'bg-gradient-to-br from-slate-800 to-slate-900'
            }`}>
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{label}</h3>
                {required && <span className="text-red-500 text-lg">*</span>}
                {isEmpty && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                    À compléter
                  </span>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={type}
                      value={editValue}
                      onChange={e => onChange(e.target.value)}
                      className={`w-full border-3 rounded-2xl p-4 text-gray-900 transition-all duration-300 outline-none text-lg font-medium ${
                        error 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                      }`}
                      autoFocus
                      placeholder={placeholder || label}
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                      <X className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-medium ${
                    isEmpty ? 'text-amber-700 italic' : 'text-gray-800'
                  }`}>
                    {displayValue}
                  </span>
                  {canToggleMask && value && !isEmpty && (
                    <button
                      onClick={onToggleMask}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                      title={showMasked ? "Afficher" : "Masquer"}
                    >
                      {showMasked ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 ml-6">
            {isEditing ? (
              <>
                <button 
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                  disabled={saving}
                  onClick={onSave}
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {saving ? 'Sauvegarde...' : 'Enregistrer'}
                </button>
                <button 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl flex items-center gap-3 font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                  disabled={saving}
                  onClick={onCancel}
                >
                  <X className="h-5 w-5" />
                  Annuler
                </button>
              </>
            ) : (
              <button 
                className={`px-8 py-3 rounded-2xl flex items-center gap-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isEmpty
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                    : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white'
                }`}
                onClick={onEdit}
              >
                <Edit3 className="h-5 w-5" />
                {isEmpty ? 'Ajouter' : 'Modifier'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileField;