// src/pages/Home.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Lock, 
  Grid3x3, 
  Shuffle, 
  ArrowRight, 
  Zap, 
  Shield, 
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Play,
  ChevronRight,
  Sparkles,
  Code,
  Brain,
  Target
} from 'lucide-react';
import { Card, Badge, Button } from '../components/atoms';
import { StatCard } from '../components/molecules';
import { ALL_CIPHERS, CIPHER_CATEGORIES } from '../constants/cipherTypes';

/**
 * Home Page Component - Modern Redesign
 * Landing page with cipher overview and quick access
 */

// Animated gradient background component
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
  </div>
);

const ModernCipherCard = ({ cipher }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Updated mappings to match actual data format
  const difficultyBgColors = {
    'easy': 'bg-green-500/30 dark:bg-green-500/20',
    'medium': 'bg-yellow-500/30 dark:bg-yellow-500/20',
    'hard': 'bg-red-500/30 dark:bg-red-500/20'
  };

  const difficultyTextColors = {
    'easy': 'text-green-700 dark:text-green-200',
    'medium': 'text-yellow-700 dark:text-yellow-200',
    'hard': 'text-red-700 dark:text-red-200'
  };

  const difficultyBorderColors = {
    'easy': 'border-green-400/30',
    'medium': 'border-yellow-400/30',
    'hard': 'border-red-400/30'
  };

  const securityBgColors = {
    'low': 'bg-red-500/30 dark:bg-red-500/20',
    'medium': 'bg-yellow-500/30 dark:bg-yellow-500/20',
    'high': 'bg-green-500/30 dark:bg-green-500/20'
  };

  const securityTextColors = {
    'low': 'text-red-700 dark:text-red-200',
    'medium': 'text-yellow-700 dark:text-yellow-200',
    'high': 'text-green-700 dark:text-green-200'
  };

  const securityBorderColors = {
    'low': 'border-red-400/30',
    'medium': 'border-yellow-400/30',
    'high': 'border-green-400/30'
  };

  // Display labels mapping
  const difficultyLabels = {
    'easy': 'Beginner',
    'medium': 'Intermediate',
    'hard': 'Advanced'
  };

  const securityLabels = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High'
  };

  return (
    <div 
      className={`group relative bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 dark:border-slate-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 ${isHovered ? 'transform -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {cipher.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {cipher.category}
              </p>
            </div>
          </div>
          <ArrowRight className={`w-5 h-5 text-gray-400 transition-all duration-300 ${isHovered ? 'translate-x-1 text-primary-500' : ''}`} />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 dark:text-gray-300 mb-4 line-clamp-2">
          {cipher.description}
        </p>

        {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${difficultyBgColors[cipher.difficulty]} ${difficultyTextColors[cipher.difficulty]} border ${difficultyBorderColors[cipher.difficulty]}`}>
          {difficultyLabels[cipher.difficulty]}
        </span>
        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${securityBgColors[cipher.security]} ${securityTextColors[cipher.security]} border ${securityBorderColors[cipher.security]}`}>
          {securityLabels[cipher.security]} Security
        </span>
      </div>


        {/* Hover effect - Try now button */}
      <div className={`mt-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
       <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Play className="w-4 h-4 text-white" />
         <span>Try it now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ModernCipherCard.propTypes = {
  cipher: PropTypes.object.isRequired,
};

// Enhanced Category Card
const EnhancedCategoryCard = ({ category, ciphers, icon: Icon, gradient }) => {
  const navigate = useNavigate();

  return (
  <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Animated background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
    
    {/* Decorative elements */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl" />
    
    <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="px-4 py-2 bg-gray-800 dark:bg-gray-700 rounded-full border border-gray-700 dark:border-gray-600 shadow-md">
          <span className="text-sm font-bold text-white">
            {ciphers.length} algorithms
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {category}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-300 mb-6">
        Explore {ciphers.length} different cipher techniques in this category
      </p>

        {/* Cipher list */}
        <div className="space-y-3 mb-6">
          {ciphers.slice(0, 4).map((cipher, index) => (
            <Link
              key={cipher.id}
              to={cipher.path}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group/item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                  {cipher.shortName || cipher.name}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover/item:text-primary-500 group-hover/item:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* View all button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700/50 hover:bg-primary-500 dark:hover:bg-primary-600 text-gray-700 dark:text-gray-200 hover:text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-gray-200 dark:border-gray-600"
        >
          <span>Explore All</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

EnhancedCategoryCard.propTypes = {
  category: PropTypes.string.isRequired,
  ciphers: PropTypes.array.isRequired,
  icon: PropTypes.elementType.isRequired,
  gradient: PropTypes.string.isRequired,
};

// Enhanced Feature Card
const EnhancedFeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Hover effect background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    
    <div className="relative z-10">
      <div className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-200 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

EnhancedFeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  gradient: PropTypes.string.isRequired,
};

// Main Home Component
const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCiphers: 0,
    categories: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      const ciphers = Object.keys(ALL_CIPHERS);
      const categories = Object.keys(CIPHER_CATEGORIES);
      const history = JSON.parse(localStorage.getItem('cryptoMetrics') || '[]');
      
      setStats({
        totalCiphers: ciphers.length,
        categories: categories.length,
        recentActivity: history.length,
      });
    };

    loadStats();
  }, []);

  const substitutionCiphers = Object.values(ALL_CIPHERS).filter(
    c => c.category === CIPHER_CATEGORIES.SUBSTITUTION
  );
  const polygramCiphers = Object.values(ALL_CIPHERS).filter(
    c => c.category === CIPHER_CATEGORIES.POLYGRAM
  );
  const transpositionCiphers = Object.values(ALL_CIPHERS).filter(
    c => c.category === CIPHER_CATEGORIES.TRANSPOSITION
  );

  const allCiphers = Object.values(ALL_CIPHERS);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Modernized */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <AnimatedBackground />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Badge with animation */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interactive Cryptography Learning Platform
                </span>
              </div>
            </div>
            
                    {/* Main heading with gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-6 animate-fade-in-up">
            <span className="block text-gray-900 dark:text-white mb-2">
              Master 
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient pb-2 leading-tight" style={{lineHeight: '1.2'}}>
              Cryptography
            </span>
          </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 text-center mt-10 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
          Learn, explore, and master 10+ classical cipher algorithms with 
          <span className="font-semibold text-primary-600 dark:text-primary-400"> interactive visualizations</span>, 
          real-time analytics, and comprehensive guides.
        </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-400">
              <button
                onClick={() => navigate('/caesar')}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Zap className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 border border-gray-200 dark:border-gray-700"
              >
                <TrendingUp className="w-5 h-5" />
                <span>View Dashboard</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalCiphers}+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Algorithms
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Grid3x3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.categories}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Categories
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      100%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Interactive
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 dark:bg-blue-400/10 rounded-full mb-4 border border-blue-200 dark:border-blue-500/30">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              <span className="text-sm font-semibold text-blue-700 dark:text-white">
                Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make cryptography learning engaging and effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <EnhancedFeatureCard
              icon={Brain}
              title="Interactive Learning"
              description="Step-by-step visualizations and real-time feedback for deep understanding"
              gradient="from-blue-500 to-blue-600"
            />
            <EnhancedFeatureCard
              icon={TrendingUp}
              title="Performance Analytics"
              description="Track your progress with detailed metrics and performance insights"
              gradient="from-green-500 to-green-600"
            />
            <EnhancedFeatureCard
              icon={Shield}
              title="Security Analysis"
              description="Understand cipher strengths, weaknesses, and cryptanalysis techniques"
              gradient="from-purple-500 to-purple-600"
            />
            <EnhancedFeatureCard
              icon={Code}
              title="Complete Documentation"
              description="Comprehensive guides covering theory, history, and implementation"
              gradient="from-orange-500 to-orange-600"
            />
          </div>
        </div>
      </section>

      {/* Cipher Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 dark:bg-purple-400/10 rounded-full mb-4 border border-purple-200 dark:border-purple-500/30">
              <Grid3x3 className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span className="text-sm font-semibold text-purple-700 dark:text-white">
                Three Main Categories
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Cipher Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from substitution, polygram, or transposition ciphers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <EnhancedCategoryCard
              category="Substitution Ciphers"
              ciphers={substitutionCiphers}
              icon={Lock}
              gradient="from-blue-500 to-blue-600"
            />
            <EnhancedCategoryCard
              category="Polygram Ciphers"
              ciphers={polygramCiphers}
              icon={Grid3x3}
              gradient="from-purple-500 to-purple-600"
            />
            <EnhancedCategoryCard
              category="Transposition Ciphers"
              ciphers={transpositionCiphers}
              icon={Shuffle}
              gradient="from-green-500 to-green-600"
            />
          </div>
        </div>
      </section>

      {/* Popular Ciphers Grid */}
       <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 dark:bg-blue-400/10 rounded-full mb-4 border border-blue-200 dark:border-blue-500/30">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              <span className="text-sm font-semibold text-blue-700 dark:text-white">
                Popular Algorithms
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Start with These Ciphers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Most popular classical cryptography algorithms to begin your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {allCiphers.slice(0, 8).map((cipher) => (
              <ModernCipherCard key={cipher.id} cipher={cipher} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <span>View All Algorithms</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <AnimatedBackground />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of students learning classical cryptography through interactive, 
              hands-on experience. Start for free today!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/caesar')}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                <span>Start Learning Now</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
              >
                <TrendingUp className="w-5 h-5" />
                <span>View Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Add custom animations to global CSS */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

Home.propTypes = {};

export default Home;