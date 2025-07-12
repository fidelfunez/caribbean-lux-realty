import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProperties } from '@/lib/supabaseUtils';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Eye, 
  Users,
  Home,
  Building2,
  Car,
  TreePalm,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Clock,
  Star
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminAnalytics = () => {
  const [properties, setProperties] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalProperties: 0,
    totalValue: 0,
    averagePrice: 0,
    priceRange: { min: 0, max: 0 },
    propertyTypes: {},
    locationStats: {},
    monthlyTrends: {},
    topPerformers: [],
    recentActivity: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, propertyType]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data);
      
      // Calculate analytics
      const filteredProperties = filterProperties(data);
      calculateAnalytics(filteredProperties);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = (data) => {
    let filtered = [...data];

    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(property => {
        const propertyDate = new Date(property.created_at);
        return propertyDate >= cutoffDate;
      });
    }

    // Filter by property type
    if (propertyType !== 'all') {
      filtered = filtered.filter(property => property.type === propertyType);
    }

    return filtered;
  };

  const calculateAnalytics = (filteredProperties) => {
    const totalProperties = filteredProperties.length;
    const totalValue = filteredProperties.reduce((sum, p) => sum + (p.price || 0), 0);
    const averagePrice = totalProperties > 0 ? totalValue / totalProperties : 0;
    
    const prices = filteredProperties.map(p => p.price).filter(p => p > 0);
    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0
    };

    const propertyTypes = filteredProperties.reduce((acc, p) => {
      if (p.type) {
        acc[p.type] = (acc[p.type] || 0) + 1;
      }
      return acc;
    }, {});

    const locationStats = filteredProperties.reduce((acc, p) => {
      if (p.location) {
        acc[p.location] = (acc[p.location] || 0) + 1;
      }
      return acc;
    }, {});

    // Calculate monthly trends
    const monthlyTrends = {};
    filteredProperties.forEach(property => {
      const date = new Date(property.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyTrends[monthYear] = (monthlyTrends[monthYear] || 0) + 1;
    });

    // Top performers (by price)
    const topPerformers = [...filteredProperties]
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 5);

    // Recent activity
    const recentActivity = [...filteredProperties]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    setAnalytics({
      totalProperties,
      totalValue,
      averagePrice,
      priceRange,
      propertyTypes,
      locationStats,
      monthlyTrends,
      topPerformers,
      recentActivity
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPropertyTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'house':
      case 'villa':
        return <Home className="w-4 h-4" />;
      case 'apartment':
      case 'condo':
        return <Building2 className="w-4 h-4" />;
      case 'commercial':
        return <Building2 className="w-4 h-4" />;
      case 'land':
        return <TreePalm className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <motion.section 
        className="text-center py-16 md:py-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-xl"
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-12 h-12 text-primary mr-4" />
            <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl font-extrabold text-primary">Analytics Dashboard</motion.h1>
          </div>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Comprehensive insights into your property portfolio performance and market trends.
          </motion.p>
        </div>
      </motion.section>

      {/* Filters */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <span className="font-medium">Filters:</span>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={loadAnalytics} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </Card>
      </motion.section>

      {/* Key Metrics */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Properties</p>
                  <p className="text-3xl font-bold">{analytics.totalProperties}</p>
                </div>
                <Home className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Value</p>
                  <p className="text-3xl font-bold">{formatCurrency(analytics.totalValue)}</p>
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Average Price</p>
                  <p className="text-3xl font-bold">{formatCurrency(analytics.averagePrice)}</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Property Types</p>
                  <p className="text-3xl font-bold">{Object.keys(analytics.propertyTypes).length}</p>
                </div>
                <MapPin className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Detailed Analytics */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Property Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics.propertyTypes).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(analytics.propertyTypes)
                    .sort(([,a], [,b]) => b - a)
                    .map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPropertyTypeIcon(type)}
                          <span className="font-medium">{type}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{count} properties</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No property types data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Top Performers (by Price)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topPerformers.map((property, index) => (
                    <div key={property.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{property.title}</p>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">{formatCurrency(property.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No top performers data available</p>
              )}
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Price Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Minimum Price</span>
                  <span className="font-bold text-green-600">{formatCurrency(analytics.priceRange.min)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Maximum Price</span>
                  <span className="font-bold text-red-600">{formatCurrency(analytics.priceRange.max)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price Difference</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(analytics.priceRange.max - analytics.priceRange.min)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentActivity.map((property) => (
                    <div key={property.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium line-clamp-1">{property.title}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(property.created_at)}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatCurrency(property.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Export Section */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
};

export default AdminAnalytics; 