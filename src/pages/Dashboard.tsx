import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, User, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  LineChart, 
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const callStats = {
    total: 1254,
    completed: 987,
    failed: 143,
    transferred: 124,
    avgDuration: 3.5,
    successRate: 78.7,
  };
  
  const recentCampaigns = [
    { id: '1', name: 'Q2 Sales Outreach', status: 'active', calls: 432, completion: 67 },
    { id: '2', name: 'Appointment Reminders', status: 'active', calls: 285, completion: 89 },
    { id: '3', name: 'Customer Feedback', status: 'paused', calls: 142, completion: 45 },
    { id: '4', name: 'Event Follow-up', status: 'completed', calls: 654, completion: 100 },
  ];
  
  const dailyCallsData = [
    { name: 'Mon', calls: 45 },
    { name: 'Tue', calls: 63 },
    { name: 'Wed', calls: 58 },
    { name: 'Thu', calls: 72 },
    { name: 'Fri', calls: 53 },
    { name: 'Sat', calls: 24 },
    { name: 'Sun', calls: 18 },
  ];
  
  const weeklyPerformanceData = [
    { name: 'Week 1', success: 65, failed: 12, transferred: 8 },
    { name: 'Week 2', success: 72, failed: 10, transferred: 6 },
    { name: 'Week 3', success: 68, failed: 15, transferred: 9 },
    { name: 'Week 4', success: 75, failed: 11, transferred: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Calls"
          value={callStats.total.toString()}
          icon={<Phone className="h-6 w-6 text-indigo-500" />}
        />
        <StatCard 
          title="Success Rate"
          value={`${callStats.successRate}%`}
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          trend="up"
          trendValue="+5.2%"
        />
        <StatCard 
          title="Avg. Duration"
          value={`${callStats.avgDuration} min`}
          icon={<Clock className="h-6 w-6 text-amber-500" />}
        />
        <StatCard 
          title="Failed Calls"
          value={callStats.failed.toString()}
          icon={<TrendingDown className="h-6 w-6 text-red-500" />}
          trend="down"
          trendValue="-2.1%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Calls Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Call Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={dailyCallsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Weekly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="success" stroke="#4f46e5" strokeWidth={2} />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="transferred" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign Name</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Calls</th>
                  <th className="text-left py-3 px-4">Completion</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{campaign.calls}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${campaign.completion}%` }}
                          ></div>
                        </div>
                        <span>{campaign.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const StatCard = ({ title, value, icon, trend, trendValue }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-xs font-medium flex items-center mt-2 ${
                trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend === 'up' ? 
                  <TrendingUp className="h-3 w-3 mr-1" /> : 
                  <TrendingDown className="h-3 w-3 mr-1" />
                }
                {trendValue} from last month
              </p>
            )}
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;