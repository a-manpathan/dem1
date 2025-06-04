
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart, Pie, Cell, Sector } from 'recharts';
import { useTheme } from '@/hooks/useTheme';

const Analytics = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sample data for the line chart
  const appointmentTrends = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 180 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 100 },
    { name: 'May', value: 140 },
    { name: 'Jun', value: 220 },
    { name: 'Jul', value: 190 },
    { name: 'Aug', value: 120 },
    { name: 'Sep', value: 180 },
    { name: 'Oct', value: 150 },
    { name: 'Nov', value: 100 },
    { name: 'Dec', value: 140 },
  ];

  // Sample data for the pie chart
  const patientData = [
    { name: 'Male', value: 34, color: '#00A1D6' },
    { name: 'Female', value: 34, color: '#FF6B8B' },
    { name: 'Children', value: 34, color: '#7BE495' },
  ];

  // Stats data
  const statsData = [
    { title: 'Total Appointments', value: '1580', change: '+8.7%', color: 'text-blue-400' },
    { title: 'Completed', value: '1268', change: '+8.7%', color: 'text-green-400' },
    { title: 'Cancelled', value: '34', change: '+8.7%', color: 'text-red-400' },
    { title: 'New Patient', value: '564', change: '-3.2%', color: 'text-purple-400' },
    { title: 'Return Patients', value: '1016', change: '+8.7%', color: 'text-orange-400' },
    { title: 'Follow Ups', value: '820', change: '+8.7%', color: 'text-cyan-400' },
  ];

  // Get background and text colors based on theme
  const getBgColor = () => isDarkMode ? 'bg-gray-800' : 'bg-white';
  const getBorderColor = () => isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const getTextColor = () => isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const getSecondaryTextColor = () => isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const getChartGridColor = () => isDarkMode ? '#374151' : '#e5e7eb';
  const getTooltipBgColor = () => isDarkMode ? '#1F2937' : '#ffffff';
  const getTooltipTextColor = () => isDarkMode ? '#E5E7EB' : '#1F2937';

  // Active shape for pie chart
  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-midAngle * Math.PI / 180);
    const cos = Math.cos(-midAngle * Math.PI / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={isDarkMode ? "#E5E7EB" : "#1F2937"} fontSize={12}>{`${payload.name}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={12}>
          {`${value} patients (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="space-y-6">
      {/* Doctor info */}
      <div>
        <h2 className="text-xl font-bold">Dr. Abhinand Choudry</h2>
        <p className="text-sm text-gray-400 dark:text-gray-400">Endocrinologist</p>
      </div>

      {/* Filter controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Select defaultValue="monthly">
            <SelectTrigger className={`w-32 ${getBgColor()} border ${getBorderColor()}`}>
              <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className={`${getBgColor()} border ${getBorderColor()}`}>
            <Calendar className="w-4 h-4 mr-2" />
            Start date
          </Button>
          <Button variant="outline" className={`${getBgColor()} border ${getBorderColor()}`}>
            <Calendar className="w-4 h-4 mr-2" />
            End date
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-6 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className={`${getBgColor()} border ${getBorderColor()} rounded-lg p-4`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${getSecondaryTextColor()}`}>{stat.title}</span>
              <span className={`text-xs ${stat.color}`}>{stat.change}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Line chart */}
        <div className={`${getBgColor()} border ${getBorderColor()} rounded-lg p-4`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-medium ${getTextColor()}`}>Trend in Total Appointments</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className={`h-8 w-8 ${getSecondaryTextColor()}`}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className={`h-8 w-8 ${getSecondaryTextColor()}`}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentTrends}>
                <CartesianGrid stroke={getChartGridColor()} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  stroke={isDarkMode ? "#6B7280" : "#6B7280"} 
                  tick={{ fill: isDarkMode ? "#9CA3AF" : "#4B5563" }}
                />
                <YAxis 
                  stroke={isDarkMode ? "#6B7280" : "#6B7280"}
                  tick={{ fill: isDarkMode ? "#9CA3AF" : "#4B5563" }}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: getTooltipBgColor(), 
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: '0.375rem'
                  }}
                  itemStyle={{ color: getTooltipTextColor() }}
                  labelStyle={{ color: getTooltipTextColor() }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00A1D6" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#00A1D6' }}
                  activeDot={{ r: 6, fill: '#00A1D6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className={`${getBgColor()} border ${getBorderColor()} rounded-lg p-4`}>
          <h3 className={`font-medium mb-4 ${getTextColor()}`}>Patient Statistics</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={patientData.map(item => ({
                    ...item,
                    value: Math.round(1580 * (item.value / 100)) // Convert percentage to actual value
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {patientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-xs ${getSecondaryTextColor()}`}
                  fill={isDarkMode ? "#9CA3AF" : "#6B7280"}
                >
                  TOTAL
                </text>
                <text
                  x="50%"
                  y="50%"
                  dy={16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-xl font-bold ${getTextColor()}`}
                  fill={isDarkMode ? "#E5E7EB" : "#1F2937"}
                >
                  1580
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
