import React, { useEffect, useState } from 'react';
import { Search, MapPin, DollarSign, Star, Clock, User, Briefcase, MessageSquare, Plus } from 'lucide-react';

// Single-file React app (export default) — ready to drop into a Vite/CRA project.
// Uses Tailwind classes for styling. Persists data to localStorage so actions survive reloads.

const uid = () => Math.random().toString(36).slice(2, 9);

const STORAGE_KEY = 'workerconnect_data_v1';

const defaultData = {
  userRole: null, // 'customer' | 'worker'
  currentUser: null, // { id, name, role }
  jobs: [
    { id: 'j1', title: 'Fix Electrical Wiring', category: 'Electrician', location: 'Karachi', budget: 2000, deadline: '2024-12-01', bids: [], description: 'Need experienced electrician to fix house wiring issues', status: 'open' },
    { id: 'j2', title: 'Carpenter for Furniture', category: 'Carpenter', location: 'Lahore', budget: 5000, deadline: '2024-12-05', bids: [], description: 'Custom furniture work needed', status: 'open' },
    { id: 'j3', title: 'Plumbing Repair', category: 'Plumber', location: 'Islamabad', budget: 1500, deadline: '2024-11-28', bids: [], description: 'Kitchen sink and bathroom plumbing needs fixing', status: 'open' }
  ],
  workers: [
    { id: 'w1', name: 'Ahmed Khan', specialty: 'Electrician', rating: 4.8, reviews: 45, rate: 1500, experience: '8 years', available: true, bio: 'Experienced electrician for residential jobs.' },
    { id: 'w2', name: 'Bilal Hussain', specialty: 'Carpenter', rating: 4.9, reviews: 62, rate: 2000, experience: '10 years', available: true, bio: 'Custom furniture & woodwork specialist.' },
    { id: 'w3', name: 'Farhan Ali', specialty: 'Plumber', rating: 4.6, reviews: 38, rate: 1200, experience: '5 years', available: false, bio: 'Plumbing repairs and installations.' }
  ]
};

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return defaultData;
  });

  const [activeTab, setActiveTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // UI state
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', category: '', description: '', budget: '', deadline: '', location: '' });

  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedJobForBid, setSelectedJobForBid] = useState(null);
  const [bidForm, setBidForm] = useState({ amount: '', proposal: '', eta: '' });

  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [profileForm, setProfileForm] = useState({ name: '', specialty: '', experience: '', rate: '', bio: '', location: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    // when role or currentUser changes, prefill profile if worker
    if (data.currentUser && data.currentUser.role === 'worker') {
      const w = data.workers.find(x => x.id === data.currentUser.id);
      if (w) setProfileForm({ name: w.name, specialty: w.specialty, experience: w.experience.replace(' years', ''), rate: w.rate, bio: w.bio, location: w.location || '' });
    }
  }, [data.currentUser]);

  // Helpers to update top-level data
  const setDataAndSave = (updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  // Auth simulation
  const signInAs = (role) => {
    const id = role === 'worker' ? (data.workers[0]?.id || 'w' + uid()) : 'c_' + uid();
    const user = role === 'worker'
      ? { id: id, name: data.workers[0]?.name || 'Worker', role: 'worker' }
      : { id: id, name: 'Customer ' + id.slice(0,4), role: 'customer' };

    setDataAndSave(d => ({ ...d, userRole: role, currentUser: user }));
    setActiveTab(role === 'customer' ? 'browse' : 'jobs');
  };

  const signOut = () => {
    setDataAndSave(d => ({ ...d, userRole: null, currentUser: null }));
    setActiveTab('browse');
  };

  // Posting job (customer)
  const handleOpenPost = () => {
    setPostForm({ title: '', category: '', description: '', budget: '', deadline: '', location: '' });
    setShowPostModal(true);
  };

  const handlePostJob = (e) => {
    e?.preventDefault();
    const newJob = {
      id: 'j_' + uid(),
      title: postForm.title || 'Untitled',
      category: postForm.category || 'General',
      description: postForm.description || '',
      budget: Number(postForm.budget) || 0,
      deadline: postForm.deadline || '',
      location: postForm.location || '',
      bids: [],
      status: 'open',
      ownerId: data.currentUser?.id || null
    };

    setDataAndSave(d => ({ ...d, jobs: [newJob, ...d.jobs] }));
    setShowPostModal(false);
    setActiveTab('myjobs');
  };

  // Viewing job details
  const openJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  // Worker places bid
  const openBidModal = (job) => {
    setSelectedJobForBid(job);
    setBidForm({ amount: '', proposal: '', eta: '' });
    setShowBidModal(true);
  };

  const submitBid = (e) => {
    e?.preventDefault();
    if (!data.currentUser) return alert('Sign in as a worker first');
    const bid = {
      id: 'b_' + uid(),
      workerId: data.currentUser.id,
      workerName: data.currentUser.name || 'Worker',
      amount: Number(bidForm.amount) || 0,
      proposal: bidForm.proposal || '',
      eta: bidForm.eta || '',
      createdAt: new Date().toISOString()
    };

    setDataAndSave(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id === selectedJobForBid.id ? { ...j, bids: [bid, ...j.bids] } : j)
    }));

    setShowBidModal(false);
    setActiveTab('mybids');
  };

  // Customer views bids for a job
  const viewBids = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
    setActiveTab('myjobs');
  };

  // Customer hires a bid
  const hireBid = (jobId, bidId) => {
    setDataAndSave(d => ({
      ...d,
      jobs: d.jobs.map(j => {
        if (j.id !== jobId) return j;
        const chosen = j.bids.find(b => b.id === bidId);
        return { ...j, status: 'hired', hiredBid: chosen };
      })
    }));
    alert('Worker hired!');
  };

  // Customer can book a worker directly
  const bookWorker = (worker) => {
    const booking = {
      id: 'bk_' + uid(),
      workerId: worker.id,
      workerName: worker.name,
      customerId: data.currentUser?.id || null,
      status: 'booked',
      createdAt: new Date().toISOString()
    };
    // For demo, we'll store bookings in localStorage root under data.bookings
    setDataAndSave(d => ({ ...d, bookings: [booking].concat(d.bookings || []) }));
    alert('Worker booked — check bookings in localStorage!');
  };

  // Worker profile update
  const saveProfile = (e) => {
    e?.preventDefault();
    if (!data.currentUser) return;
    const workerId = data.currentUser.id;
    const w = { id: workerId, name: profileForm.name || 'Worker', specialty: profileForm.specialty || '', rating: 5, reviews: 0, rate: Number(profileForm.rate) || 0, experience: (profileForm.experience || '') + ' years', available: true, bio: profileForm.bio || '', location: profileForm.location || '' };

    setDataAndSave(d => {
      // if worker exists, update; else add
      const exists = d.workers.some(x => x.id === workerId);
      return {
        ...d,
        workers: exists ? d.workers.map(x => x.id === workerId ? { ...x, ...w } : x) : [w, ...d.workers]
      };
    });

    alert('Profile saved');
  };

  // Simple search + filter
  const visibleWorkers = data.workers.filter(w => {
    const s = search.trim().toLowerCase();
    if (filterCategory !== 'All' && filterCategory !== 'All Categories' && w.specialty !== filterCategory) return false;
    if (!s) return true;
    return (w.name + ' ' + w.specialty + ' ' + (w.bio || '')).toLowerCase().includes(s);
  });

  const visibleJobs = data.jobs.filter(j => {
    const s = search.trim().toLowerCase();
    if (filterCategory !== 'All' && filterCategory !== 'All Categories' && j.category !== filterCategory) return false;
    if (!s) return true;
    return (j.title + ' ' + j.description + ' ' + j.location).toLowerCase().includes(s);
  });

  // UI pieces
  const RoleSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">WorkerConnect</h1>
          <p className="text-xl text-gray-600">Connect with Skilled Workers or Find Your Next Job</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div onClick={() => signInAs('customer')} className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:scale-105">
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

          <div onClick={() => signInAs('worker')} className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:scale-105">
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

  const Header = () => (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${data.userRole === 'worker' ? 'text-green-600' : 'text-blue-600'}`}>WorkerConnect</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">{data.currentUser?.name || ''}</div>
          <button className="text-gray-600 hover:text-gray-800" onClick={() => alert('Notifications (demo)')}>Notifications</button>
          <button className="text-gray-600 hover:text-gray-800" onClick={() => alert('Profile (top-right)')}>Profile</button>
          <button onClick={signOut} className="text-red-600 hover:text-red-800">Logout</button>
        </div>
      </div>
    </header>
  );

  // Main renders
  if (!data.userRole) return <RoleSelection />;

  if (data.userRole === 'customer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              <button onClick={() => setActiveTab('browse')} className={`py-4 px-2 border-b-2 ${activeTab === 'browse' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Browse Workers</button>
              <button onClick={() => setActiveTab('post')} className={`py-4 px-2 border-b-2 ${activeTab === 'post' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Post a Job</button>
              <button onClick={() => setActiveTab('myjobs')} className={`py-4 px-2 border-b-2 ${activeTab === 'myjobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>My Jobs</button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {activeTab === 'browse' && (
            <div>
              <div className="mb-6 flex gap-4">
                <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search by specialty or name..." className="flex-1 px-4 py-2 border rounded-lg" />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-4 py-2 border rounded-lg">
                  <option>All</option>
                  <option>Electrician</option>
                  <option>Carpenter</option>
                  <option>Plumber</option>
                  <option>Painter</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleWorkers.map(worker => (
                  <div key={worker.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{worker.name}</h3>
                        <p className="text-gray-600">{worker.specialty}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-sm ${worker.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{worker.available ? 'Available' : 'Busy'}</div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">{worker.rating}</span>
                      <span className="text-gray-600">({worker.reviews} reviews)</span>
                    </div>

                    <p className="text-gray-600 mb-2">Experience: {worker.experience}</p>
                    <p className="text-gray-800 font-semibold mb-4">Rate: PKR {worker.rate}/hour</p>

                    <div className="flex gap-2">
                      <button onClick={() => bookWorker(worker)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Book Now</button>
                      <button onClick={() => { setProfileForm({ name: worker.name, specialty: worker.specialty, experience: worker.experience.replace(' years', ''), rate: worker.rate, bio: worker.bio || '', location: worker.location || '' }); setActiveTab('myjobs'); openJobDetails({ title: 'Worker Profile', description: worker.bio || 'No bio' }); }} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'post' && (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Job Title</label>
                  <input value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Fix Electrical Wiring" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Select category</option>
                    <option>Electrician</option>
                    <option>Carpenter</option>
                    <option>Plumber</option>
                    <option>Painter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows="4" placeholder="Describe your job requirements..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Budget (PKR)</label>
                    <input value={postForm.budget} onChange={e => setPostForm({ ...postForm, budget: e.target.value })} type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="2000" />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Deadline</label>
                    <input value={postForm.deadline} onChange={e => setPostForm({ ...postForm, deadline: e.target.value })} type="date" className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Location</label>
                  <input value={postForm.location} onChange={e => setPostForm({ ...postForm, location: e.target.value })} type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Karachi" />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">Post Job</button>
              </form>
            </div>
          )}

          {activeTab === 'myjobs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Posted Jobs</h2>
              <div className="space-y-4">
                {data.jobs.filter(j => !j.ownerId || j.ownerId === data.currentUser?.id).map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <p className="text-gray-600">{job.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{job.status === 'open' ? 'Active' : job.status}</span>
                    </div>

                    <p className="text-gray-700 mb-4">{job.description}</p>

                    <div className="flex gap-6 text-gray-600 mb-4">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</div>
                      <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" />PKR {job.budget}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{job.deadline}</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">{job.bids.length} bids received</span>
                      <div className="flex gap-2">
                        <button onClick={() => viewBids(job)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">View Bids</button>
                        <button onClick={() => openJobDetails(job)} className="border border-gray-300 px-4 py-2 rounded-lg">Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Job Details Modal */}
        {showJobDetails && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full overflow-auto max-h-[80vh]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedJob.title}</h3>
                  <p className="text-gray-600">{selectedJob.category}</p>
                </div>
                <button onClick={() => { setShowJobDetails(false); setSelectedJob(null); }} className="text-gray-500">Close</button>
              </div>

              <p className="text-gray-700 mb-4">{selectedJob.description}</p>

              <div className="mb-4 text-gray-600">
                <div className="flex gap-4"><MapPin className="w-4 h-4" />{selectedJob.location}</div>
                <div className="flex gap-4"><DollarSign className="w-4 h-4" />PKR {selectedJob.budget}</div>
                <div className="flex gap-4"><Clock className="w-4 h-4" />{selectedJob.deadline}</div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Bids</h4>
                {selectedJob.bids && selectedJob.bids.length ? (
                  <div className="space-y-3">
                    {selectedJob.bids.map(b => (
                      <div key={b.id} className="p-3 border rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{b.workerName}</div>
                            <div className="text-sm text-gray-600">PKR {b.amount} • ETA: {b.eta}</div>
                          </div>
                          <div className="flex gap-2">
                            {data.currentUser?.role === 'customer' && <button onClick={() => hireBid(selectedJob.id, b.id)} className="bg-green-600 text-white px-3 py-1 rounded">Hire</button>}
                            <button className="border px-3 py-1 rounded" onClick={() => alert('Message sent (demo)')}>Message</button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 mt-2">{b.proposal}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">No bids yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bid Modal (for workers) */}
        {showBidModal && selectedJobForBid && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-2">Place Your Bid</h3>
              <p className="text-gray-600 mb-4">Job: {selectedJobForBid.title}</p>

              <form onSubmit={submitBid} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Your Bid Amount (PKR)</label>
                  <input value={bidForm.amount} onChange={e => setBidForm({ ...bidForm, amount: e.target.value })} type="number" className="w-full px-3 py-2 border rounded" placeholder={`Customer budget: PKR ${selectedJobForBid.budget}`} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Proposal</label>
                  <textarea value={bidForm.proposal} onChange={e => setBidForm({ ...bidForm, proposal: e.target.value })} className="w-full px-3 py-2 border rounded" rows={3} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Estimated Completion Time</label>
                  <input value={bidForm.eta} onChange={e => setBidForm({ ...bidForm, eta: e.target.value })} type="text" className="w-full px-3 py-2 border rounded" placeholder="e.g., 2 days" />
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowBidModal(false)} className="flex-1 border border-gray-300 py-2 rounded">Cancel</button>
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">Submit Bid</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Worker view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button onClick={() => setActiveTab('jobs')} className={`py-4 px-2 border-b-2 ${activeTab === 'jobs' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}>Available Jobs</button>
            <button onClick={() => setActiveTab('mybids')} className={`py-4 px-2 border-b-2 ${activeTab === 'mybids' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}>My Bids</button>
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-2 border-b-2 ${activeTab === 'profile' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}>Profile</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'jobs' && (
          <div>
            <div className="mb-6 flex gap-4">
              <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search jobs..." className="flex-1 px-4 py-2 border rounded-lg" />
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-4 py-2 border rounded-lg">
                <option>All</option>
                <option>Electrician</option>
                <option>Carpenter</option>
                <option>Plumber</option>
                <option>Painter</option>
              </select>
            </div>

            <div className="space-y-4">
              {visibleJobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mt-2">{job.category}</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">PKR {job.budget}</span>
                  </div>

                  <p className="text-gray-700 mb-4">{job.description}</p>

                  <div className="flex gap-6 text-gray-600 mb-4">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" />Deadline: {job.deadline}</div>
                    <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" />{job.bids?.length || 0} bids</div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => openBidModal(job)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Place Bid</button>
                    <button onClick={() => openJobDetails(job)} className="border border-gray-300 px-4 py-2 rounded-lg">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mybids' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Active Bids</h2>
            <div className="space-y-4">
              {data.jobs.flatMap(j => j.bids.map(b => ({ ...b, job: j }))).filter(b => b.workerId === data.currentUser?.id).map(b => (
                <div key={b.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{b.job.title}</h3>
                      <p className="text-gray-600">{b.job.category}</p>
                    </div>
                    <div className="text-green-600 font-semibold">PKR {b.amount}</div>
                  </div>

                  <div className="text-gray-700 mb-2">{b.proposal}</div>
                  <div className="flex gap-2">
                    <button onClick={() => alert('Message customer (demo)')} className="border px-4 py-2 rounded">Message</button>
                    <button onClick={() => alert('Bid withdrawn (demo)')} className="border px-4 py-2 rounded">Withdraw</button>
                  </div>
                </div>
              ))}

              {data.jobs.flatMap(j => j.bids).filter(b => b.workerId === data.currentUser?.id).length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">You haven't placed any bids yet. Start browsing jobs to place a bid!</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>

            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Your name" />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Specialty</label>
                <select value={profileForm.specialty} onChange={e => setProfileForm({ ...profileForm, specialty: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select specialty</option>
                  <option>Electrician</option>
                  <option>Carpenter</option>
                  <option>Plumber</option>
                  <option>Painter</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Experience (years)</label>
                <input value={profileForm.experience} onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })} type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="5" />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Hourly Rate (PKR)</label>
                <input value={profileForm.rate} onChange={e => setProfileForm({ ...profileForm, rate: e.target.value })} type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="1500" />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows="4" placeholder="Tell customers about your skills and experience..."></textarea>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input value={profileForm.location} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })} type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Karachi" />
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">Update Profile</button>
            </form>
          </div>
        )}

        {/* Reuse job details modal in worker view */}
        {showJobDetails && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full overflow-auto max-h-[80vh]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedJob.title}</h3>
                  <p className="text-gray-600">{selectedJob.category}</p>
                </div>
                <button onClick={() => { setShowJobDetails(false); setSelectedJob(null); }} className="text-gray-500">Close</button>
              </div>

              <p className="text-gray-700 mb-4">{selectedJob.description}</p>

              <div className="mb-4 text-gray-600">
                <div className="flex gap-4"><MapPin className="w-4 h-4" />{selectedJob.location}</div>
                <div className="flex gap-4"><DollarSign className="w-4 h-4" />PKR {selectedJob.budget}</div>
                <div className="flex gap-4"><Clock className="w-4 h-4" />{selectedJob.deadline}</div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { openBidModal(selectedJob); setShowJobDetails(false); }} className="bg-green-600 text-white px-4 py-2 rounded">Place Bid</button>
                <button onClick={() => setShowJobDetails(false)} className="border px-4 py-2 rounded">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Bid modal for worker (shared) */}
        {showBidModal && selectedJobForBid && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-2">Place Your Bid</h3>
              <p className="text-gray-600 mb-4">Job: {selectedJobForBid.title}</p>

              <form onSubmit={submitBid} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Your Bid Amount (PKR)</label>
                  <input value={bidForm.amount} onChange={e => setBidForm({ ...bidForm, amount: e.target.value })} type="number" className="w-full px-3 py-2 border rounded" placeholder={`Customer budget: PKR ${selectedJobForBid.budget}`} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Proposal</label>
                  <textarea value={bidForm.proposal} onChange={e => setBidForm({ ...bidForm, proposal: e.target.value })} className="w-full px-3 py-2 border rounded" rows={3} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Estimated Completion Time</label>
                  <input value={bidForm.eta} onChange={e => setBidForm({ ...bidForm, eta: e.target.value })} type="text" className="w-full px-3 py-2 border rounded" placeholder="e.g., 2 days" />
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowBidModal(false)} className="flex-1 border border-gray-300 py-2 rounded">Cancel</button>
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">Submit Bid</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
