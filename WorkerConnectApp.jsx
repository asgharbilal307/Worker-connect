import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Star, Clock, User, Briefcase, MessageSquare, Plus } from 'lucide-react';

const WorkerConnectApp = () => {
  const [userRole, setUserRole] = useState(null); // 'customer', 'worker', 'admin'
  const [activeTab, setActiveTab] = useState('browse');
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Fix Electrical Wiring', category: 'Electrician', location: 'Karachi', budget: 2000, deadline: '2024-12-01', bids: 5, description: 'Need experienced electrician to fix house wiring issues' },
    { id: 2, title: 'Carpenter for Furniture', category: 'Carpenter', location: 'Lahore', budget: 5000, deadline: '2024-12-05', bids: 3, description: 'Custom furniture work needed' },
    { id: 3, title: 'Plumbing Repair', category: 'Plumber', location: 'Islamabad', budget: 1500, deadline: '2024-11-28', bids: 7, description: 'Kitchen sink and bathroom plumbing needs fixing' }
  ]);
  
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Ahmed Khan', specialty: 'Electrician', rating: 4.8, reviews: 45, rate: 1500, experience: '8 years', available: true },
    { id: 2, name: 'Bilal Hussain', specialty: 'Carpenter', rating: 4.9, reviews: 62, rate: 2000, experience: '10 years', available: true },
    { id: 3, name: 'Farhan Ali', specialty: 'Plumber', rating: 4.6, reviews: 38, rate: 1200, experience: '5 years', available: false }
  ]);

  const [showJobModal, setShowJobModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Landing Page
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">WorkerConnect</h1>
            <p className="text-xl text-gray-600">Connect with Skilled Workers or Find Your Next Job</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div 
              onClick={() => setUserRole('customer')}
              className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h2 className="text-2xl font-bold mb-4">I'm a Customer</h2>
                <p className="text-gray-600 mb-4">Post jobs or browse skilled workers</p>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>✓ Post custom jobs with budget</li>
                  <li>✓ Receive competitive bids</li>
                  <li>✓ Browse verified workers</li>
                  <li>✓ Rate and review services</li>
                </ul>
              </div>
            </div>
            
            <div 
              onClick={() => setUserRole('worker')}
              className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-center">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h2 className="text-2xl font-bold mb-4">I'm a Worker</h2>
                <p className="text-gray-600 mb-4">Find jobs and grow your business</p>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>✓ Browse available jobs</li>
                  <li>✓ Place competitive bids</li>
                  <li>✓ Build your profile</li>
                  <li>✓ Get consistent work</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer Dashboard
  if (userRole === 'customer') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">WorkerConnect</h1>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-800">Notifications</button>
              <button className="text-gray-600 hover:text-gray-800">Profile</button>
              <button onClick={() => setUserRole(null)} className="text-red-600 hover:text-red-800">Logout</button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`py-4 px-2 border-b-2 ${activeTab === 'browse' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
              >
                Browse Workers
              </button>
              <button 
                onClick={() => setActiveTab('post')}
                className={`py-4 px-2 border-b-2 ${activeTab === 'post' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
              >
                Post a Job
              </button>
              <button 
                onClick={() => setActiveTab('myjobs')}
                className={`py-4 px-2 border-b-2 ${activeTab === 'myjobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
              >
                My Jobs
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Browse Workers Tab */}
          {activeTab === 'browse' && (
            <div>
              <div className="mb-6 flex gap-4">
                <input 
                  type="text" 
                  placeholder="Search by specialty or name..."
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <select className="px-4 py-2 border rounded-lg">
                  <option>All Categories</option>
                  <option>Electrician</option>
                  <option>Carpenter</option>
                  <option>Plumber</option>
                  <option>Painter</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.map(worker => (
                  <div key={worker.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{worker.name}</h3>
                        <p className="text-gray-600">{worker.specialty}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-sm ${worker.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {worker.available ? 'Available' : 'Busy'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">{worker.rating}</span>
                      <span className="text-gray-600">({worker.reviews} reviews)</span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">Experience: {worker.experience}</p>
                    <p className="text-gray-800 font-semibold mb-4">Rate: PKR {worker.rate}/hour</p>
                    
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Job Tab */}
          {activeTab === 'post' && (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Job Title</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Fix Electrical Wiring" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Select category</option>
                    <option>Electrician</option>
                    <option>Carpenter</option>
                    <option>Plumber</option>
                    <option>Painter</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea className="w-full px-4 py-2 border rounded-lg" rows="4" placeholder="Describe your job requirements..."></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Budget (PKR)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="2000" />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Deadline</label>
                    <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Location</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Karachi" />
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                  Post Job
                </button>
              </div>
            </div>
          )}

          {/* My Jobs Tab */}
          {activeTab === 'myjobs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Posted Jobs</h2>
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <p className="text-gray-600">{job.category}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Active</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="flex gap-6 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        PKR {job.budget}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {job.deadline}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">{job.bids} bids received</span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        View Bids
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Worker Dashboard
  if (userRole === 'worker') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">WorkerConnect</h1>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-800">Notifications</button>
              <button className="text-gray-600 hover:text-gray-800">My Profile</button>
              <button onClick={() => setUserRole(null)} className="text-red-600 hover:text-red-800">Logout</button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-2 border-b-2 ${activeTab === 'jobs' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}
              >
                Available Jobs
              </button>
              <button 
                onClick={() => setActiveTab('mybids')}
                className={`py-4 px-2 border-b-2 ${activeTab === 'mybids' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}
              >
                My Bids
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-2 border-b-2 ${activeTab === 'profile' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}
              >
                Profile
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Available Jobs Tab */}
          {activeTab === 'jobs' && (
            <div>
              <div className="mb-6 flex gap-4">
                <input 
                  type="text" 
                  placeholder="Search jobs..."
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <select className="px-4 py-2 border rounded-lg">
                  <option>All Categories</option>
                  <option>Electrician</option>
                  <option>Carpenter</option>
                  <option>Plumber</option>
                  <option>Painter</option>
                </select>
              </div>

              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mt-2">
                          {job.category}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">PKR {job.budget}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="flex gap-6 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Deadline: {job.deadline}
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {job.bids} bids
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setSelectedJob(job);
                        setShowBidModal(true);
                      }}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      Place Bid
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Bids Tab */}
          {activeTab === 'mybids' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Active Bids</h2>
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>You haven't placed any bids yet.</p>
                <p className="mt-2">Start browsing available jobs to place your first bid!</p>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">My Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Your name" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Specialty</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Select specialty</option>
                    <option>Electrician</option>
                    <option>Carpenter</option>
                    <option>Plumber</option>
                    <option>Painter</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Experience (years)</label>
                  <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="5" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Hourly Rate (PKR)</label>
                  <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="1500" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Bio</label>
                  <textarea className="w-full px-4 py-2 border rounded-lg" rows="4" placeholder="Tell customers about your skills and experience..."></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Location</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Karachi" />
                </div>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
                  Update Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bid Modal */}
        {showBidModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Place Your Bid</h3>
              <p className="text-gray-600 mb-4">Job: {selectedJob?.title}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Your Bid Amount (PKR)</label>
                  <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter your bid" />
                  <p className="text-sm text-gray-500 mt-1">Customer's budget: PKR {selectedJob?.budget}</p>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Proposal</label>
                  <textarea className="w-full px-4 py-2 border rounded-lg" rows="3" placeholder="Explain why you're the best fit for this job..."></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Estimated Completion Time</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 2 days" />
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowBidModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setShowBidModal(false)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Submit Bid
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default WorkerConnectApp;