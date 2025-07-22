import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Download,
  RefreshCw,
  TrendingUp,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    total_registrations: 0,
    available_seats: 100,
    referral_breakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      
      // Fetch registrations
      const registrationsResponse = await fetch(`${backendUrl}/api/webinar-registrations`);
      if (registrationsResponse.ok) {
        const regData = await registrationsResponse.json();
        setRegistrations(regData);
      }
      
      // Fetch stats
      const statsResponse = await fetch(`${backendUrl}/api/webinar-stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const exportToCSV = () => {
    const headers = ['Full Name', 'Email', 'WhatsApp', 'Referral Source', 'Registration Date'];
    const csvData = [
      headers.join(','),
      ...registrations.map(reg => [
        reg.fullName,
        reg.email,
        reg.whatsapp,
        reg.referralSource || 'Not specified',
        new Date(reg.timestamp).toLocaleDateString('en-IN')
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webinar-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getReferralColor = (source) => {
    const colors = {
      'LinkedIn': 'bg-blue-500',
      'Google Search': 'bg-red-500', 
      'Facebook': 'bg-blue-600',
      'Instagram': 'bg-pink-500',
      'Twitter': 'bg-sky-500',
      'WhatsApp': 'bg-green-500',
      'YouTube': 'bg-red-600',
      'Other': 'bg-gray-500'
    };
    return colors[source] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-accent-primary mb-2">
              Webinar Admin Dashboard
            </h1>
            <p className="text-gray-400">TransformBuddy.AI Registrations</p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">Last updated: {lastUpdated}</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={fetchData} 
              disabled={loading}
              className="bg-accent-primary text-black hover:bg-accent-hover"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={exportToCSV}
              disabled={registrations.length === 0}
              variant="outline"
              className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-accent-primary flex items-center gap-2">
                <Users className="w-5 h-5" />
                Total Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_registrations}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Available Seats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats.available_seats}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Referral Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{stats.referral_breakdown.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Breakdown */}
        {stats.referral_breakdown.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle>Referral Source Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {stats.referral_breakdown.map((source, index) => (
                  <Badge 
                    key={index} 
                    className={`${getReferralColor(source._id)} text-white px-3 py-1`}
                  >
                    {source._id || 'Not specified'}: {source.count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registrations Table */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Registrations ({registrations.length})
            </CardTitle>
            <CardDescription>
              Complete list of webinar registrations with contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-primary" />
                <p className="text-gray-400">Loading registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No registrations yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 font-semibold text-accent-primary">Name</th>
                      <th className="text-left py-3 px-2 font-semibold text-accent-primary">Email</th>
                      <th className="text-left py-3 px-2 font-semibold text-accent-primary">WhatsApp</th>
                      <th className="text-left py-3 px-2 font-semibold text-accent-primary">Source</th>
                      <th className="text-left py-3 px-2 font-semibold text-accent-primary">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration, index) => (
                      <tr key={registration.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-4 px-2">
                          <div className="font-medium">{registration.fullName}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a href={`mailto:${registration.email}`} className="text-blue-400 hover:underline">
                              {registration.email}
                            </a>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${registration.whatsapp}`} className="text-green-400 hover:underline">
                              {registration.whatsapp}
                            </a>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <Badge className={`${getReferralColor(registration.referralSource)} text-white`}>
                            {registration.referralSource || 'Not specified'}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="w-4 h-4" />
                            {new Date(registration.timestamp).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;