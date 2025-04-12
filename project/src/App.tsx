import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Map, { Marker, Popup } from 'react-map-gl';
import { AlertTriangle, Phone, MessageSquareText, ThermometerSun, Bot, Menu, X, Building2, Guitar as Hospital, Shield, Building, MapPin, Send, HelpCircle } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Facility {
  id: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function ChatBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Emergency Response Assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const chatRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "For immediate emergency assistance, please call 119.",
        "I can help you locate the nearest emergency facility. What type of facility do you need?",
        "Please stay calm and provide me with more details about your situation.",
        "Would you like me to guide you through emergency procedures?",
      ];
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-4 sm:right-4 w-full sm:w-[400px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      <div className="p-4 border-b flex justify-between items-center bg-red-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h2 className="text-xl font-semibold">HELP</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-red-700 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div 
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSend}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatingChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
    >
      <HelpCircle className="w-6 h-6" />
    </button>
  );
}

function FacilityCard({ icon: Icon, title, type, onViewMap }: {
  icon: React.ElementType;
  title: string;
  type: string;
  onViewMap: (facilities: Facility[]) => void;
}) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilities() {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('type', type)
        .limit(3);
      
      if (error) {
        console.error('Error fetching facilities:', error);
      } else {
        setFacilities(data || []);
      }
      setLoading(false);
    }

    fetchFacilities();
  }, [type]);

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => onViewMap(facilities)}
    >
      <div className="flex items-center mb-3 sm:mb-4">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-2 sm:mr-3 flex-shrink-0" />
        <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{title}</h3>
      </div>
      {loading ? (
        <p className="text-sm text-gray-600">Loading facilities...</p>
      ) : facilities.length > 0 ? (
        <div className="space-y-3">
          {facilities.map((facility) => (
            <div key={facility.id} className="border-b border-gray-200 pb-2 last:border-0">
              <p className="font-medium text-sm sm:text-base">{facility.name}</p>
              <p className="text-xs sm:text-sm text-gray-600">{facility.address}</p>
              <p className="text-xs sm:text-sm text-blue-600">{facility.phone}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No facilities found</p>
      )}
    </div>
  );
}

function MapView({ facilities, onClose }: { facilities: Facility[], onClose: () => void }) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [viewport, setViewport] = useState({
    latitude: facilities[0]?.latitude || 37.5665,
    longitude: facilities[0]?.longitude || 126.9780,
    zoom: 12
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Facility Locations</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 min-h-[500px]">
          <Map
            {...viewport}
            onMove={evt => setViewport(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
          >
            {facilities.map((facility) => (
              <Marker
                key={facility.id}
                longitude={facility.longitude}
                latitude={facility.latitude}
                onClick={() => setSelectedFacility(facility)}
              >
                <MapPin className="w-6 h-6 text-red-600 cursor-pointer" />
              </Marker>
            ))}
            {selectedFacility && (
              <Popup
                longitude={selectedFacility.longitude}
                latitude={selectedFacility.latitude}
                onClose={() => setSelectedFacility(null)}
                offset={25}
              >
                <div className="p-2">
                  <h3 className="font-bold">{selectedFacility.name}</h3>
                  <p className="text-sm">{selectedFacility.address}</p>
                  <p className="text-sm text-blue-600">{selectedFacility.phone}</p>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) alert(error.message);
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) alert(error.message);
    else alert('Check your email for verification link');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Emergency Response Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full border border-red-600 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[] | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white py-6 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Korea Emergency Response</h1>
              <p className="text-base sm:text-xl opacity-90">24/7 Emergency Assistance & Support</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex gap-4">
                <button className="bg-white text-red-600 px-4 sm:px-6 py-2 rounded-md font-semibold hover:bg-red-50 transition-colors text-sm sm:text-base">
                  119
                </button>
                <button className="border-2 border-white px-4 sm:px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base">
                  112
                </button>
              </div>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 hover:bg-red-700 rounded-md transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <button 
                onClick={() => supabase.auth.signOut()} 
                className="hidden sm:block bg-red-700 text-white px-4 sm:px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="sm:hidden mt-4 py-4 border-t border-red-500">
              <div className="flex flex-col gap-3">
                <button className="bg-white text-red-600 px-4 py-2 rounded-md font-semibold hover:bg-red-50 transition-colors text-sm">
                  119
                </button>
                <button className="border-2 border-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors text-sm">
                  112
                </button>
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="bg-red-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <FacilityCard
            icon={Building2}
            title="Civil Defense Shelters"
            type="shelter"
            onViewMap={setSelectedFacilities}
          />
          <FacilityCard
            icon={Hospital}
            title="Emergency Medical Centers"
            type="medical"
            onViewMap={setSelectedFacilities}
          />
          <FacilityCard
            icon={Shield}
            title="Police Stations"
            type="police"
            onViewMap={setSelectedFacilities}
          />
          <FacilityCard
            icon={Building}
            title="Fire Stations"
            type="fire"
            onViewMap={setSelectedFacilities}
          />
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3 sm:mb-4">
              <ThermometerSun className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-2 sm:mr-3 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold line-clamp-1">Weather Warnings</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Advanced weather monitoring and early warning system.</p>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base">
              Check Weather
            </button>
          </div>
        </div>
      </main>

      {selectedFacilities && (
        <MapView 
          facilities={selectedFacilities} 
          onClose={() => setSelectedFacilities(null)} 
        />
      )}

      {!isChatOpen && (
        <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      )}

      {isChatOpen && (
        <ChatBot onClose={() => setIsChatOpen(false)} />
      )}

      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs sm:text-sm opacity-80">© 2025 Korea Emergency Response. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-0">
              <a href="#" className="text-sm hover:text-red-400 transition-colors">Terms</a>
              <a href="#" className="text-sm hover:text-red-400 transition-colors">Privacy</a>
              <a href="#" className="text-sm hover:text-red-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;