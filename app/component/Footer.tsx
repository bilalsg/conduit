import React from 'react';
import { Github, Twitter, Youtube, Mail, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  const navigationLinks = {
    'Learn': ['Roadmaps', 'Best Practices', 'Guides', 'Videos', 'FAQs', 'YouTube'],
    'Practice': ['Projects', 'Challenges', 'Interviews', 'Knowledge Base'],
    'Community': ['GitHub', 'Discord', 'Twitter', 'Newsletter']
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/api/placeholder/40/40" alt="Logo" className="h-8 w-8 rounded" />
              <div>
                <h3 className="text-white font-bold">roadmap</h3>
                <div className="flex items-center text-sm text-gray-400">
                  <span>by</span>
                  <a href="#" className="ml-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-colors">
                    @devteam
                  </a>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Community-driven roadmaps and resources for developers to light up their learning journey.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(navigationLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center group">
                      {link}
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} roadmap.</span>
              <span>·</span>
              <a href="#" className="hover:text-white">Terms</a>
              <span>·</span>
              <a href="#" className="hover:text-white">Privacy</a>
              <span>·</span>
              <a href="#" className="hover:text-white">Advertise</a>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;