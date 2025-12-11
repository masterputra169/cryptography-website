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
  Clock
} from 'lucide-react';
import { Card, Badge, Button } from '../components/atoms';
import { StatCard } from '../components/molecules';
import { ALL_CIPHERS, CIPHER_CATEGORIES } from '../constants/cipherTypes';

/**
 * Home Page Component
 * Landing page with cipher overview and quick access
 */

// PropTypes for cipher card
const CipherCardPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
  security: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
});

// Cipher Category Card Component
const CategoryCard = ({ category, ciphers, icon: Icon, color }) => {
  const navigate = useNavigate();

  return (
    <Card
      variant="elevated"
      hover
      className="group transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-start gap-4">
        <div className={`p-4 bg-gradient-to-br from-${color}-100 to-${color}-200 dark:from-${color}-900/30 dark:to-${color}-800/30 rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {category}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {ciphers.length} algorithms available
          </p>

          <div className="space-y-2">
            {ciphers.slice(0, 3).map(cipher => (
              <Link
                key={cipher.id}
                to={cipher.path}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/item"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400">
                      {cipher.shortName || cipher.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cipher.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors" />
              </Link>
            ))}
          </div>

          {ciphers.length > 3 && (
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all {ciphers.length} algorithms →
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.string.isRequired,
  ciphers: PropTypes.arrayOf(CipherCardPropTypes).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color = 'blue' }) => (
  <Card className="text-center group hover:shadow-xl transition-all duration-300">
    <div className={`inline-flex p-4 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {description}
    </p>
  </Card>
);

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string,
};

// Quick Action Card Component
const QuickActionCard = ({ title, description, path, icon: Icon, color = 'primary' }) => {
  const navigate = useNavigate();

  return (
    <Card
      hover
      onClick={() => navigate(path)}
      className="cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
      </div>
    </Card>
  );
};

QuickActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string,
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
    // Load statistics
    const loadStats = () => {
      const ciphers = Object.keys(ALL_CIPHERS);
      const categories = Object.keys(CIPHER_CATEGORIES);
      
      // Get recent activity from localStorage
      const history = JSON.parse(localStorage.getItem('cryptoMetrics') || '[]');
      
      setStats({
        totalCiphers: ciphers.length,
        categories: categories.length,
        recentActivity: history.length,
      });
    };

    loadStats();
  }, []);

  // Group ciphers by category
  const substitutionCiphers = Object.values(ALL_CIPHERS).filter(
    c => c.category === CIPHER_CATEGORIES.SUBSTITUTION
  );
  const polygramCiphers = Object.values(ALL_CIPHERS).filter(
    c => c.category === CIPHER_CATEGORIES.POLYGRAM
  );
  const transpositionCiphers = Object.values(ALL_CIPHERS).filter(
    c => c.category === CIPHER_CATEGORIES.TRANSPOSITION
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="primary" className="mb-4">
              🔐 Classical Cryptography Suite
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master Classical
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Cryptography
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Learn and explore 10+ classical cipher algorithms with interactive visualizations, 
              performance analytics, and comprehensive educational resources.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/caesar')}
                icon={<Zap size={20} />}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard')}
                icon={<TrendingUp size={20} />}
              >
                View Dashboard
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              <StatCard
                icon={Lock}
                value={stats.totalCiphers}
                title="Algorithms"
                variant="minimal"
                iconColor="blue"
                size="sm"
              />
              <StatCard
                icon={Grid3x3}
                value={stats.categories}
                title="Categories"
                variant="minimal"
                iconColor="purple"
                size="sm"
              />
              <StatCard
                icon={Clock}
                value={stats.recentActivity}
                title="Operations"
                variant="minimal"
                iconColor="green"
                size="sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to learn and master classical cryptography algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={BookOpen}
              title="Interactive Learning"
              description="Step-by-step visualizations for each algorithm"
              color="blue"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Performance Analytics"
              description="Track and compare algorithm performance"
              color="green"
            />
            <FeatureCard
              icon={Shield}
              title="Security Analysis"
              description="Understand cipher strengths and weaknesses"
              color="purple"
            />
            <FeatureCard
              icon={Award}
              title="Educational"
              description="Comprehensive guides and documentation"
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* Cipher Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Cipher Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose from three main categories of classical ciphers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <CategoryCard
              category="Substitution Ciphers"
              ciphers={substitutionCiphers}
              icon={Lock}
              color="blue"
            />
            <CategoryCard
              category="Polygram Ciphers"
              ciphers={polygramCiphers}
              icon={Grid3x3}
              color="purple"
            />
            <CategoryCard
              category="Transposition Ciphers"
              ciphers={transpositionCiphers}
              icon={Shuffle}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Jump right into what you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <QuickActionCard
              title="Start with Caesar Cipher"
              description="Perfect for beginners - learn the basics"
              path="/caesar"
              icon={Zap}
              color="blue"
            />
            <QuickActionCard
              title="View Analytics"
              description="See your performance statistics"
              path="/dashboard"
              icon={TrendingUp}
              color="green"
            />
            <QuickActionCard
              title="Try Advanced Ciphers"
              description="Explore Hill and Playfair ciphers"
              path="/hill"
              icon={Grid3x3}
              color="purple"
            />
            <QuickActionCard
              title="Read Documentation"
              description="Learn cipher theory and history"
              path="/docs"
              icon={BookOpen}
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Begin your journey into classical cryptography today
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/caesar')}
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            Start Learning Now
          </Button>
        </div>
      </section>
    </div>
  );
};

// PropTypes for Home component
Home.propTypes = {};

export default Home;