'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Upload, MapPin, Send, CheckCircle } from 'lucide-react';
import { createComplaintAction } from '@/lib/actions';

// Dynamically import map (no SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => ({ default: mod.MapContainer })),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => ({ default: mod.TileLayer })),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => ({ default: mod.Marker })),
  { ssr: false }
);

function LocationPicker({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState([12.9716, 77.5946]);

  // This will be handled after map loads
  return position ? <Marker position={position as any} /> : null;
}

export default function ReportPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    formData.append('lat', location.lat.toString());
    formData.append('lng', location.lng.toString());
    if (preview) formData.append('photo', preview);

    await createComplaintAction(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900">Complaint Submitted Successfully!</h2>
          <p className="text-gray-600 mt-3">Your report has been sent to the authorities.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-medium hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Report a Civic Issue</h1>
        <p className="text-gray-600 mb-8">Help make your city cleaner & safer</p>

        <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Issue Title</label>
              <input name="title" required placeholder="e.g. Large pothole on Main Street" 
                     className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Issue Type</label>
              <select name="issueType" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500">
                <option value="Garbage">🗑 Garbage Dump</option>
                <option value="Pothole">🛣 Pothole</option>
                <option value="Water">💧 Water Leakage</option>
                <option value="Streetlight">💡 Broken Streetlight</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Priority</label>
              <select name="priority" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500">
                <option value="High">🔴 High</option>
                <option value="Medium">🟠 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
              <input name="address" placeholder="Enter full address" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Nearby Landmark (Optional)</label>
            <input name="landmark" placeholder="e.g. Near City Hall" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
            <textarea name="description" rows={4} placeholder="Describe the issue in detail..." 
                      className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:border-blue-500"></textarea>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Upload Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-blue-400 transition">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="photo" />
              <label htmlFor="photo" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-10 h-10 text-blue-500 mb-2" />
                <span className="font-medium">Click to upload photo of the issue</span>
                <span className="text-xs text-gray-500 mt-1">JPG, PNG • Max 5MB</span>
              </label>
              {preview && <img src={preview} alt="preview" className="mt-6 mx-auto max-h-48 rounded-2xl shadow-md" />}
            </div>
          </div>

          {/* Map */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Pin Exact Location
            </label>
            <div className="h-80 rounded-3xl overflow-hidden border border-gray-200 shadow-inner">
              <MapContainer 
                center={[12.9716, 77.5946]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onLocationChange={(lat, lng) => setLocation({ lat, lng })} />
              </MapContainer>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-semibold text-xl flex items-center justify-center gap-3 transition"
          >
            <Send className="w-6 h-6" />
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}