import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProperties } from '@/lib/supabaseUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home as HomeIcon, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  CarFront, 
  Maximize,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Shield,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  Award,
  Heart,
  Building2,
  TreePalm,
  Waves,
  Sun,
  PalmTree
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        setLoading(true);
        const allProperties = await getProperties();
        // Show the 3 most recent properties as featured
        const featured = allProperties.slice(0, 3);
        setFeaturedProperties(featured);
      } catch (error) {
        console.error('Error loading featured properties:', error);
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'house':
      case 'villa':
        return <HomeIcon className="w-4 h-4" />;
      case 'apartment':
      case 'condo':
        return <Building2 className="w-4 h-4" />;
      case 'commercial':
        return <Building2 className="w-4 h-4" />;
      case 'land':
        return <TreePalm className="w-4 h-4" />;
      default:
        return <HomeIcon className="w-4 h-4" />;
    }
  };

  const services = [
    {
      title: "Property Sales & Acquisition",
      description: "Expert guidance through every step of buying and selling luxury properties in the Caribbean.",
      icon: <HomeIcon className="w-8 h-8" />,
      href: "/services/property-sales-acquisition",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Vacation Rental Management",
      description: "Maximize your rental income with our comprehensive property management services.",
      icon: <Calendar className="w-8 h-8" />,
      href: "/services/vacation-rental",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Land Development",
      description: "Transform raw land into profitable investments with our development expertise.",
      icon: <TreePalm className="w-8 h-8" />,
      href: "/services/land-development",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Commercial Real Estate",
      description: "Strategic commercial property investments for businesses and investors.",
      icon: <Building2 className="w-8 h-8" />,
      href: "/services/commercial-real-estate",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Relocation Assistance",
      description: "Smooth transition services for individuals and families moving to the Caribbean.",
      icon: <Users className="w-8 h-8" />,
      href: "/services/relocation-assistance",
      color: "bg-pink-500 hover:bg-pink-600"
    },
    {
      title: "Legal Assistance",
      description: "Expert legal guidance for all your real estate transactions and investments.",
      icon: <Shield className="w-8 h-8" />,
      href: "/services/legal-assistance",
      color: "bg-indigo-500 hover:bg-indigo-600"
    }
  ];

  const stats = [
    { label: "Properties Sold", value: "150+", icon: <HomeIcon className="w-6 h-6" /> },
    { label: "Happy Clients", value: "200+", icon: <Heart className="w-6 h-6" /> },
    { label: "Years Experience", value: "15+", icon: <Award className="w-6 h-6" /> },
    { label: "Islands Covered", value: "8+", icon: <Globe className="w-6 h-6" /> }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 text-6xl opacity-10">🌴</div>
          <div className="absolute top-40 right-20 text-4xl opacity-10">🌊</div>
          <div className="absolute bottom-20 left-1/4 text-5xl opacity-10">🏖️</div>
          <div className="absolute bottom-40 right-10 text-3xl opacity-10">☀️</div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeIn} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
              Caribbean
              <span className="block text-6xl md:text-8xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Lux Realty
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your gateway to luxury real estate in the most beautiful islands of the Caribbean. 
              From pristine beaches to exclusive properties, we make your dreams come true.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg py-6 px-8">
              <Link to="/properties">
                <HomeIcon className="w-5 h-5 mr-2" />
                View Properties
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg py-6 px-8">
              <Link to="/contact">
                <MessageSquare className="w-5 h-5 mr-2" />
                Get in Touch
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeIn}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Properties */}
      {!loading && featuredProperties.length > 0 && (
        <motion.section 
          className="container mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Featured Properties</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of the most exclusive properties in the Caribbean
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={fadeIn}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.image || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        {getPropertyTypeIcon(property.type)}
                        <span className="text-xs font-medium text-gray-700">
                          {property.type || 'Property'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-xl text-primary">
                        {formatPrice(property.price)}
                      </span>
                      {property.beds && property.baths && (
                        <div className="text-sm text-gray-600">
                          {property.beds} bed • {property.baths} bath
                        </div>
                      )}
                    </div>
                    
                    {property.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {property.description}
                      </p>
                    )}
                    
                    <Button asChild className="w-full">
                      <Link to={`/properties/${property.id}`}>
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/properties">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.section>
      )}

      {/* Services Section */}
      <motion.section 
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive real estate services tailored to your needs in the Caribbean
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={fadeIn}
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-lg ${service.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to={service.href}>
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-primary to-primary/80 text-white py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let us help you discover the perfect Caribbean paradise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg py-6 px-8">
              <Link to="/contact">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg py-6 px-8 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/submit-property">
                <HomeIcon className="w-5 h-5 mr-2" />
                Submit Property
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;