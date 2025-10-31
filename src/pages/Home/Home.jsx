import { useNavigate } from 'react-router-dom';
import { MessageSquare, Zap, Shield, Sparkles, ArrowRight, Github, Twitter } from 'lucide-react';
import { useTheme } from '@context';
import { SITE_CONFIG } from '@config/constants';

function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Iconos para las características
  const featureIcons = {
    'Chat Inteligente': MessageSquare,
    'Respuestas Rápidas': Zap,
    'Seguro y Privado': Shield,
    'Multimodal': Sparkles,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 transition-colors">
            <Sparkles className="w-4 h-4" />
            {SITE_CONFIG.home.badge}
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            {SITE_CONFIG.home.hero.title}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {' '}{SITE_CONFIG.home.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 transition-colors">
            {SITE_CONFIG.home.hero.subtitle}
            <br />
            {SITE_CONFIG.home.hero.subtitleSecondary}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate(SITE_CONFIG.routes.register)}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              {SITE_CONFIG.home.hero.ctaPrimary}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate(SITE_CONFIG.routes.login)}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
            >
              {SITE_CONFIG.home.hero.ctaSecondary}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {SITE_CONFIG.home.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            {SITE_CONFIG.home.features.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors">
            {SITE_CONFIG.home.features.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {SITE_CONFIG.home.features.items.map((feature, index) => {
            const Icon = featureIcons[feature.title] || Sparkles;
            return (
              <div
                key={index}
                className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-3xl p-12 shadow-2xl transition-colors">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {SITE_CONFIG.home.cta.title}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {SITE_CONFIG.home.cta.subtitle}
            </p>
            <button
              onClick={() => navigate(SITE_CONFIG.routes.register)}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {SITE_CONFIG.home.cta.button}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 transition-colors">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                {SITE_CONFIG.footer.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                {SITE_CONFIG.footer.subtitle}
              </p>
            </div>

            <div className="flex gap-6">
              <a
                href={SITE_CONFIG.footer.socialLinks.github}
                className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={SITE_CONFIG.footer.socialLinks.twitter}
                className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
            {SITE_CONFIG.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;