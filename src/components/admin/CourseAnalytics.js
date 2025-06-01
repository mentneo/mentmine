import React from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

function CourseAnalytics({ analyticsData }) {
  // Prepare data for charts
  const courseEnrollmentData = {
    labels: ['Full-Stack', 'Front-End', 'Back-End', 'Mobile App', 'Cloud Computing'],
    datasets: [
      {
        label: 'Number of Students',
        data: [65, 42, 38, 27, 18],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(16, 185, 129, 0.7)', // Green
          'rgba(139, 92, 246, 0.7)', // Purple
          'rgba(245, 158, 11, 0.7)', // Orange
          'rgba(239, 68, 68, 0.7)'   // Red
        ],
        borderWidth: 0
      }
    ]
  };

  const completionRateData = {
    labels: ['Full-Stack', 'Front-End', 'Back-End', 'Mobile App', 'Cloud Computing'],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: [78, 82, 75, 70, 65],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  const satisfactionScoreData = {
    labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
    datasets: [
      {
        data: [45, 30, 15, 7, 3],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)', // Green
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(245, 158, 11, 0.7)', // Orange
          'rgba(239, 68, 68, 0.7)',  // Red
          'rgba(220, 38, 38, 0.7)'   // Dark Red
        ],
        borderWidth: 0
      }
    ]
  };

  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [58000, 65000, 72000, 75000, 82000, 90000, 92000, 98000, 105000, 112000, 120000, 135000],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const ageDistributionData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
    datasets: [
      {
        data: [40, 35, 15, 7, 3],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(16, 185, 129, 0.7)', // Green
          'rgba(139, 92, 246, 0.7)', // Purple
          'rgba(245, 158, 11, 0.7)', // Orange
          'rgba(239, 68, 68, 0.7)'   // Red
        ],
        borderWidth: 0
      }
    ]
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Course Analytics</h1>
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-2xl font-semibold">820</p>
          <p className="text-sm text-green-500">+12.5% <span className="text-gray-500">from last month</span></p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Avg. Completion Rate</h3>
          <p className="text-2xl font-semibold">76%</p>
          <p className="text-sm text-green-500">+3.2% <span className="text-gray-500">from last month</span></p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Avg. Course Rating</h3>
          <div className="flex">
            <p className="text-2xl font-semibold">4.7</p>
            <div className="ml-2 flex text-yellow-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-500">+0.3 <span className="text-gray-500">from last month</span></p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-semibold">₹12.8L</p>
          <p className="text-sm text-green-500">+25.6% <span className="text-gray-500">from last month</span></p>
        </div>
      </div>
      
      {/* Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Course Enrollment</h2>
          <Bar data={courseEnrollmentData} options={{ 
            maintainAspectRatio: false,
            plugins: { 
              legend: { 
                display: false 
              } 
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }} height={300} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Completion Rates</h2>
          <Line data={completionRateData} options={{ 
            maintainAspectRatio: false,
            plugins: { 
              legend: { 
                display: false 
              } 
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }} height={300} />
        </div>
      </div>
      
      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Student Satisfaction</h2>
          <div className="flex justify-center" style={{ height: '300px' }}>
            <div style={{ width: '70%' }}>
              <Doughnut data={satisfactionScoreData} options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  }
                }
              }} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <Line data={monthlyRevenueData} options={{ 
            maintainAspectRatio: false,
            plugins: { 
              legend: { 
                display: false 
              } 
            }
          }} height={300} />
        </div>
      </div>
      
      {/* Student Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
          <Pie data={ageDistributionData} options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }} height={300} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Top Performing Courses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-2 px-4">Course Name</th>
                  <th className="py-2 px-4">Students</th>
                  <th className="py-2 px-4">Completion</th>
                  <th className="py-2 px-4">Rating</th>
                  <th className="py-2 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-3 px-4">Full-Stack Web Development</td>
                  <td className="py-3 px-4">65</td>
                  <td className="py-3 px-4">78%</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">4.8</span>
                      <div className="flex text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">₹3.9L</td>
                </tr>
                <tr className="border-t">
                  <td className="py-3 px-4">Front-End Development</td>
                  <td className="py-3 px-4">42</td>
                  <td className="py-3 px-4">82%</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">4.6</span>
                      <div className="flex text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">₹2.5L</td>
                </tr>
                <tr className="border-t">
                  <td className="py-3 px-4">Back-End Development</td>
                  <td className="py-3 px-4">38</td>
                  <td className="py-3 px-4">75%</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">4.5</span>
                      <div className="flex text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">₹2.3L</td>
                </tr>
                <tr className="border-t">
                  <td className="py-3 px-4">Mobile App Development</td>
                  <td className="py-3 px-4">27</td>
                  <td className="py-3 px-4">70%</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">4.7</span>
                      <div className="flex text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">₹1.6L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseAnalytics;
