import { Link } from 'react-router-dom';
import { Gem, Share2, MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200/60 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Gem size={16} className="text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900">Ornamint</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              India's premium jewelry rental marketplace. Wear magnificence, not the price tag.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-yellow-500 hover:text-white transition-colors">
                <Share2 size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-yellow-500 hover:text-white transition-colors">
                <MessageCircle size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-yellow-500 hover:text-white transition-colors">
                <Globe size={14} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {['Browse Jewelry', 'Wedding Collections', 'Festival Specials', 'How It Works'].map(item => (
                <li key={item}>
                  <Link to="/browse" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">For Owners</h4>
            <ul className="space-y-2.5">
              {['List Your Jewelry', 'Owner Dashboard', 'Pricing Guide', 'Insurance & Safety'].map(item => (
                <li key={item}>
                  <Link to="/signup" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Blog', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 Ornamint. All rights reserved.</p>
          <p className="text-xs text-gray-400">Made with love in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
