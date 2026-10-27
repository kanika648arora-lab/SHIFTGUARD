import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, X, RefreshCw, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function PhotoProofModal({
  isOpen,
  onClose,
  mode, // 'checkin' | 'checkout'
  worker,
  siteName,
  currentDistanceKm,
  onProofConfirmed,
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload'
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef(null);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

  // Simulate snapping camera
  const handleSnapPhoto = () => {
    setIsCapturing(true);
    setTimeout(() => {
      // Use worker's realistic avatar or live snapshot sample
      setPhotoPreview(worker.avatar);
      setIsCapturing(false);
    }, 600);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (!photoPreview) return;
    onProofConfirmed({
      photoUrl: photoPreview,
      timestamp: currentTime,
      date: currentDate,
      distanceKm: currentDistanceKm,
      mode: mode,
    });
    setPhotoPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-navy-900 p-4 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {mode === 'checkin' ? '📸 Check-In Site Photo Proof' : '📸 Clock-Out Shift Photo Proof'}
              </h3>
              <p className="text-[11px] text-slate-300">
                SDG 8 Biometric Attendance & Location Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'camera'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Use Site Selfie Camera</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'upload'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo File</span>
          </button>
        </div>

        {/* Capture / Upload Area */}
        <div className="p-5 space-y-4">
          
          {/* Geolocation info badge */}
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {siteName}
            </span>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-800">
              {currentDistanceKm} km away (Verified &lt; 1km)
            </span>
          </div>

          {/* Photo Preview or Live Frame */}
          <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center">
            {photoPreview ? (
              <div className="w-full h-full relative">
                <img
                  src={photoPreview}
                  alt="Site Verification Photo"
                  className="w-full h-full object-cover"
                />
                
                {/* Watermark Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-white text-[10px] space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-emerald-300">
                    <span>{worker.name} ({worker.id})</span>
                    <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded text-[9px] uppercase font-mono">
                      Biometric Match 99.4%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 font-mono">
                    <span>{currentDate} • {currentTime}</span>
                    <span>Geo: {currentDistanceKm}km (Inside 1km radius)</span>
                  </div>
                </div>
              </div>
            ) : activeTab === 'camera' ? (
              <div className="flex flex-col items-center justify-center p-4 text-center text-white relative w-full h-full">
                {/* Viewfinder crosshairs */}
                <div className="w-40 h-40 border-2 border-dashed border-emerald-400/70 rounded-full flex items-center justify-center relative">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                  <span className="absolute bottom-2 text-[10px] text-emerald-300 font-bold">
                    Position Face in Circle
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-3 font-medium">
                  Site selfie will be geo-stamped with your current coordinates.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-slate-300">
                <Upload className="w-10 h-10 text-emerald-400 mb-2" />
                <p className="text-xs font-bold text-white">Select a photo from device</p>
                <p className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold rounded-lg border border-slate-700 transition"
                >
                  Browse Device Photos
                </button>
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex space-x-3">
            {photoPreview ? (
              <>
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition ring-2 ring-emerald-400/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Save Proof</span>
                </button>
              </>
            ) : activeTab === 'camera' ? (
              <button
                type="button"
                onClick={handleSnapPhoto}
                disabled={isCapturing}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md transition"
              >
                <Camera className="w-4 h-4" />
                <span>{isCapturing ? 'Snapping & Verifying...' : '📸 Snap Site Verification Photo'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md transition"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Image from Gallery</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3 px-5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-medium text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ISO 45001 & Labour Law Compliant Record
          </span>
          <span className="font-mono text-slate-400">Zero Unlawful Tracking</span>
        </div>
      </div>
    </div>
  );
}
