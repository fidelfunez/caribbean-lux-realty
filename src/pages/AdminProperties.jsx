import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getProperties, deleteProperty } from '@/lib/supabaseUtils';
import { 
  PlusSquare, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Home,
  Building2,
  Car,
  TreePalm,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminProperties = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, typeFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: "Error Loading Properties",
        description: "Failed to load properties. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(term) ||
        property.location?.toLowerCase().includes(term) ||
        property.description?.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleDeleteProperty = async (propertyId) => {
    const propertyToDelete = properties.find(p => p.id === propertyId);
    if (!propertyToDelete) return;

    const hasImages = propertyToDelete.image || (propertyToDelete.images && propertyToDelete.images.length > 0);
    const imageSize = hasImages ? Math.round((propertyToDelete.image?.length || 0) * 0.75 / 1024) : 0;

    const confirmMessage = hasImages 
      ? `Are you sure you want to delete "${propertyToDelete.title}"? This will also remove the associated images (~${imageSize}KB). This action cannot be undone.`
      : `Are you sure you want to delete "${propertyToDelete.title}"? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeletingId(propertyId);
      const success = await deleteProperty(propertyId);
      
      if (success) {
        setProperties(properties.filter(p => p.id !== propertyId));
        toast({
          title: "Property Deleted! 🗑️",
          description: `${propertyToDelete.title} has been successfully removed from the database.`,
          variant: "default",
        });
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Delete Failed ❌",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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

  const propertyTypes = ['House', 'Villa', 'Apartment', 'Condo', 'Commercial', 'Land'];

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
            <Home className="w-12 h-12 text-primary mr-4" />
            <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl font-extrabold text-primary">Manage Properties</motion.h1>
          </div>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            View, edit, and manage all your property listings. Keep your portfolio organized and up-to-date.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button asChild className="bg-primary hover:bg-primary/90 text-lg py-3 px-8">
              <Link to="/admin/properties/add">
                <PlusSquare className="w-5 h-5 mr-2" />
                Add New Property
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters and Search */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Properties</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by title, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                }}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Properties Grid */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        {filteredProperties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {properties.length === 0 ? 'No Properties Found' : 'No Properties Match Your Filters'}
              </h3>
              <p className="text-gray-500 mb-6">
                {properties.length === 0 
                  ? 'Get started by adding your first property listing.'
                  : 'Try adjusting your search terms or filters.'
                }
              </p>
              {properties.length === 0 && (
                <Button asChild>
                  <Link to="/admin/properties/add">
                    <PlusSquare className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={fadeIn}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.image || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        asChild
                        className="bg-white/90 hover:bg-white text-gray-700"
                      >
                        <Link to={`/properties/${property.id}`}>
                          <Eye className="w-3 h-3" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        asChild
                        className="bg-white/90 hover:bg-white text-gray-700"
                      >
                        <Link to={`/admin/properties/edit/${property.id}`}>
                          <Edit className="w-3 h-3" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProperty(property.id)}
                        disabled={deletingId === property.id}
                        className="bg-red-500/90 hover:bg-red-500 text-white"
                      >
                        {deletingId === property.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getPropertyTypeIcon(property.type)}
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          {property.type || 'Property'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(property.created_at)}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-lg text-primary">
                        {formatPrice(property.price)}
                      </span>
                      {property.beds && property.baths && (
                        <div className="text-sm text-gray-600">
                          {property.beds} bed • {property.baths} bath
                        </div>
                      )}
                    </div>
                    
                    {property.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {property.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1 mr-2"
                      >
                        <Link to={`/admin/properties/edit/${property.id}`}>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1"
                      >
                        <Link to={`/properties/${property.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default AdminProperties; 