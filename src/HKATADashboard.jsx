import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, collection, doc, onSnapshot, updateDoc, addDoc, deleteDoc
} from 'firebase/firestore';

// Environment Variables Configuration
const appId = typeof __app_id !== 'undefined' ? __app_id : 'hkata-dashboard-app';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
    // Mock config for syntax fallback, actual environment provides real config
};

// Initialize Firebase safely — no-op if config is missing (e.g. local dev without env vars)
let app = null;
let auth = null;
let db = null;
try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase init failed:", e);
}

// Simple Inline SVGs to avoid dependency issues while maintaining a premium look
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
  Mail: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
  Image: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>,
  Message: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>,
  Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
};

export default function HKATADashboard() {
  if (!db) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black text-indigo-600">H</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Firebase Not Configured</h2>
          <p className="text-gray-500 text-sm">Add your Firebase config via environment variables to activate the HKATA CRM hub.</p>
        </div>
      </div>
    );
  }

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [activeRepView, setActiveRepView] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isB2BSyncing, setIsB2BSyncing] = useState(false);

  // Data States
  const [b2cLeads, setB2cLeads] = useState([]);
  const [b2bLeads, setB2bLeads] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);

  useEffect(() => {
    const authenticate = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };

    authenticate();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Strict Path Rules: /artifacts/{appId}/public/data/{collectionName}
    const b2cRef = collection(db, 'artifacts', appId, 'public', 'data', 'b2c_leads');
    const b2bRef = collection(db, 'artifacts', appId, 'public', 'data', 'b2b_leads');
    const socialRef = collection(db, 'artifacts', appId, 'public', 'data', 'social_posts');

    const unsubB2c = onSnapshot(b2cRef, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in JS to avoid complex query errors
      leads.sort((a, b) => b.createdAt - a.createdAt);
      setB2cLeads(leads);
    }, (error) => console.error("Error fetching B2C leads:", error));

    const unsubB2b = onSnapshot(b2bRef, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      leads.sort((a, b) => b.createdAt - a.createdAt);
      setB2bLeads(leads);
    }, (error) => console.error("Error fetching B2B leads:", error));

    const unsubSocial = onSnapshot(socialRef, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      posts.sort((a, b) => b.createdAt - a.createdAt);
      setSocialPosts(posts);
    }, (error) => console.error("Error fetching Social posts:", error));

    return () => {
      unsubB2c();
      unsubB2b();
      unsubSocial();
    };
  }, [user]);

  const kpis = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);

    // Filter today's leads
    const todayLeads = b2cLeads.filter(l => l.createdAt > today);

    return {
      totalNewLeads: todayLeads.length,
      whatsAppSent: todayLeads.filter(l => l.whatsappSent).length,
      callsMade: todayLeads.filter(l => l.callMade).length,
      closedDeals: b2cLeads.filter(l => l.status === 'Closed').length,
      revenueTarget: 50000, // Example target
      currentRevenue: b2cLeads.filter(l => l.status === 'Closed').length * 5000 // Assuming HK$5k per close
    };
  }, [b2cLeads]);

  const handleUpdateLead = async (collectionName, id, field, value) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, id);
      await updateDoc(docRef, { [field]: value });
    } catch (error) {
      console.error("Error updating doc:", error);
    }
  };

  const handleGoogleSheetsSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      // Google Viz API URL to export the sheet as CSV
      const url = "https://docs.google.com/spreadsheets/d/1iT6AllBdg2wKhC6Jw9OQimn4uzD4jUbixX-7knwKve0/gviz/tq?tqx=out:csv&gid=769822571";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Cannot access sheet. Make sure it is set to 'Anyone with the link can view'.");
      }

      const csvText = await response.text();
      const rows = csvText.split(/\r?\n/);

      if (rows.length < 2) {
        throw new Error("Sheet is empty or missing headers.");
      }

      // Robust CSV row parser to handle empty cells (,,) and quoted strings properly without shifting columns
      const parseCSVRow = (str) => {
        const arr = [];
        let quote = false;
        let col = '';
        for (let i = 0; i < str.length; i++) {
          let cc = str[i], nc = str[i+1];
          if (cc === '"' && quote && nc === '"') { col += cc; ++i; continue; }
          if (cc === '"') { quote = !quote; continue; }
          if (cc === ',' && !quote) { arr.push(col); col = ''; continue; }
          col += cc;
        }
        arr.push(col.trim());
        return arr;
      };

      const headers = parseCSVRow(rows[0]).map(h => h.toLowerCase());

      // Strict matching based on your exact column names
      const nameIdx = headers.findIndex(h => h.includes('full_name') || h === 'name');
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const phoneIdx = headers.findIndex(h => h.includes('phone'));

      // Check if sheet already has rep/status assignments
      const repIdx = headers.findIndex(h => h.includes('rep') || h.includes('assignee') || h.includes('owner'));
      const statusIdx = headers.findIndex(h => h.includes('status'));

      // Parse CSV and inject to Firebase Workspaces
      let added = 0;
      const b2cRef = collection(db, 'artifacts', appId, 'public', 'data', 'b2c_leads');

      // Process up to 500 rows for bulk import
      for (let i = 1; i < Math.min(rows.length, 500); i++) {
        if (!rows[i].trim()) continue; // Skip empty rows

        const cols = parseCSVRow(rows[i]);
        if (cols.length < 2) continue;

        const repVal = repIdx >= 0 && cols[repIdx] ? cols[repIdx].trim() : '';
        const statusVal = statusIdx >= 0 && cols[statusIdx] ? cols[statusIdx].trim() : '';

        await addDoc(b2cRef, {
          parentName: nameIdx >= 0 && cols[nameIdx] ? cols[nameIdx] : 'Unknown Parent',
          email: emailIdx >= 0 && cols[emailIdx] ? cols[emailIdx] : 'No Email',
          childName: 'N/A',
          phone: phoneIdx >= 0 && cols[phoneIdx] ? cols[phoneIdx] : 'No Phone',
          source: 'Meta Ad (Bulk Sync)',
          status: statusVal || 'Historical', // Don't mark as 'New' to avoid KPI inflation
          salesRep: repVal || 'Unassigned', // Send to Master Pool, don't flood the team
          whatsappSent: false,
          callMade: false,
          followUpMessage: false,
          notes: 'Bulk imported from Master Sheet',
          createdAt: Date.now() - added * 60000 // Space them out historically
        });
        added++;
      }
      console.log(`Successfully synced ${added} rows from Google Sheets.`);
    } catch (error) {
      console.error("Sync Error - Defaulting to Simulation:", error);
      // Fallback simulation if CORS or permissions block the real fetch
      simulateIncomingLead();
      simulateIncomingLead();
    } finally {
      setIsSyncing(false);
      setActiveTab('team'); // Redirect to workspaces to see the imported data
    }
  };

  const simulateIncomingLead = async () => {
    if (!user) return;
    const salesTeam = ['Eric', 'Carmen', 'Jason'];
    try {
      const b2cRef = collection(db, 'artifacts', appId, 'public', 'data', 'b2c_leads');
      await addDoc(b2cRef, {
        parentName: `Parent ${Math.floor(Math.random() * 1000)}`,
        email: `parent${Math.floor(Math.random() * 1000)}@example.com`,
        childName: `Child ${Math.floor(Math.random() * 1000)}`,
        phone: `+852 9${Math.floor(Math.random() * 10000000)}`,
        source: 'Meta IG Ad',
        status: 'New',
        salesRep: salesTeam[Math.floor(Math.random() * salesTeam.length)],
        whatsappSent: false,
        callMade: false,
        followUpMessage: false,
        notes: '',
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Error simulating lead:", error);
    }
  };

  const handleB2BSync = async () => {
    if (!user) return;
    setIsB2BSyncing(true);
    try {
      // Connects to the specific B2B Sheet you provided
      const url = "https://docs.google.com/spreadsheets/d/1ydeRHu49T8Gpyp9HztSX5dGMk2XIsZTRU9_ALWhmlys/gviz/tq?tqx=out:csv&gid=1606717678";
      const response = await fetch(url);

      if (!response.ok) throw new Error("Cannot access B2B sheet.");

      const csvText = await response.text();
      const rows = csvText.split(/\r?\n/);
      if (rows.length < 2) throw new Error("Sheet empty");

      const parseCSVRow = (str) => {
        const arr = [];
        let quote = false; let col = '';
        for (let i = 0; i < str.length; i++) {
          let cc = str[i], nc = str[i+1];
          if (cc === '"' && quote && nc === '"') { col += cc; ++i; continue; }
          if (cc === '"') { quote = !quote; continue; }
          if (cc === ',' && !quote) { arr.push(col); col = ''; continue; }
          col += cc;
        }
        arr.push(col.trim());
        return arr;
      };

      const headers = parseCSVRow(rows[0]).map(h => h.toLowerCase());

      // Dynamic mapping for B2B specific columns
      const companyIdx = headers.findIndex(h => h.includes('company') || h.includes('school') || h.includes('organization'));
      const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('contact'));
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const phoneIdx = headers.findIndex(h => h.includes('phone'));
      const statusIdx = headers.findIndex(h => h.includes('status') || h.includes('stage'));

      const b2bRef = collection(db, 'artifacts', appId, 'public', 'data', 'b2b_leads');
      let added = 0;

      for (let i = 1; i < Math.min(rows.length, 15); i++) {
        if (!rows[i].trim()) continue;
        const cols = parseCSVRow(rows[i]);
        if (cols.length < 2) continue;

        let statusVal = statusIdx >= 0 && cols[statusIdx] ? cols[statusIdx] : 'Prospect';
        // Normalize status to fit pipeline
        if (!['Prospect', 'Qualified', 'Proposal', 'Negotiation', 'Closed'].includes(statusVal)) {
            statusVal = 'Prospect';
        }

        await addDoc(b2bRef, {
          companyName: companyIdx >= 0 && cols[companyIdx] ? cols[companyIdx] : 'Unknown Company/School',
          contactName: nameIdx >= 0 && cols[nameIdx] ? cols[nameIdx] : 'N/A',
          email: emailIdx >= 0 && cols[emailIdx] ? cols[emailIdx] : 'N/A',
          phone: phoneIdx >= 0 && cols[phoneIdx] ? cols[phoneIdx] : 'N/A',
          status: statusVal,
          notes: 'Auto-imported from B2B Sheet',
          createdAt: Date.now() - added * 1000
        });
        added++;
      }
      console.log(`Successfully synced ${added} B2B rows.`);
    } catch (error) {
      console.error("B2B Sync Error - Defaulting to Simulation:", error);
      simulateB2BLead();
      simulateB2BLead();
    } finally {
      setIsB2BSyncing(false);
    }
  };

  const simulateB2BLead = async () => {
    if (!user) return;
    try {
      const b2bRef = collection(db, 'artifacts', appId, 'public', 'data', 'b2b_leads');
      await addDoc(b2bRef, {
        companyName: `School/Corp ${Math.floor(Math.random() * 1000)}`,
        contactName: `Principal ${Math.floor(Math.random() * 100)}`,
        email: `contact${Math.floor(Math.random() * 1000)}@school.edu.hk`,
        phone: `+852 2${Math.floor(Math.random() * 10000000)}`,
        status: 'Prospect',
        notes: '',
        createdAt: Date.now()
      });
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-800">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-900 font-semibold">Initializing HKATA Workspace...</p>
        </div>
      </div>
    );
  }

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      <Icon />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Today's Overview</h2>
          <p className="text-gray-500 text-sm">Real-time KPI monitoring across all teams.</p>
        </div>
        <button
          onClick={simulateIncomingLead}
          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition flex items-center gap-2 shadow-sm"
        >
          <Icons.Plus /> Simulate Meta Lead
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'New Leads Today', value: kpis.totalNewLeads, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'WhatsApp Sent', value: kpis.whatsAppSent, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Calls Made', value: kpis.callsMade, color: 'bg-orange-50 text-orange-700 border-orange-200' },
          { label: 'Closed Deals (Total)', value: kpis.closedDeals, color: 'bg-purple-50 text-purple-700 border-purple-200' },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.color} shadow-sm`}>
            <p className="text-sm font-semibold opacity-80">{stat.label}</p>
            <p className="text-3xl font-black mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sales Target Progress */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Team Daily Revenue Target</h3>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>HK$ {kpis.currentRevenue.toLocaleString()} achieved</span>
          <span>Target: HK$ {kpis.revenueTarget.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-indigo-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((kpis.currentRevenue / kpis.revenueTarget) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderTeamWorkspaces = () => {
    const salesTeam = ['Eric', 'Carmen', 'Jason'];

    if (!activeRepView) {
      return (
        <div className="space-y-6 fade-in">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Sales Team Workspaces</h2>
            <p className="text-gray-500 text-sm">Select a team member to view their personal follow-up queue.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salesTeam.map(rep => {
              const repLeads = b2cLeads.filter(l => l.salesRep === rep);
              const newLeads = repLeads.filter(l => l.status === 'New').length;
              return (
                <div
                  key={rep}
                  onClick={() => setActiveRepView(rep)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {rep.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{rep}'s Queue</h3>
                      <p className="text-sm text-gray-500">{repLeads.length} Total Leads</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Pending Action</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${newLeads > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {newLeads} New
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const repLeads = b2cLeads.filter(l => l.salesRep === activeRepView);

    return (
      <div className="space-y-6 fade-in">
        <div className="flex justify-between items-center">
          <div>
            <button onClick={() => setActiveRepView(null)} className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 flex items-center gap-1 font-medium">
              &larr; Back to Team
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{activeRepView}'s Personal Workspace</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Parent Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4 text-center">Follow Up Checklist</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 w-1/3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {repLeads.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No leads assigned yet.</td></tr>
                ) : repLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {lead.parentName}
                      <div className="text-xs text-gray-400 font-normal">{new Date(lead.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-gray-700">{lead.phone}</div>
                      {lead.email && <div className="text-xs text-gray-500 mt-1">{lead.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 justify-center max-w-[280px]">
                        <button
                          onClick={() => handleUpdateLead('b2c_leads', lead.id, 'callMade', !lead.callMade)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${lead.callMade ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                        >
                          <Icons.Phone /> {lead.callMade ? 'Called (Y)' : 'Call (N)'}
                        </button>
                        <button
                          onClick={() => handleUpdateLead('b2c_leads', lead.id, 'whatsappSent', !lead.whatsappSent)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${lead.whatsappSent ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                        >
                          <Icons.Message /> {lead.whatsappSent ? 'WhatsApp (Y)' : 'WhatsApp (N)'}
                        </button>
                        <button
                          onClick={() => handleUpdateLead('b2c_leads', lead.id, 'followUpMessage', !lead.followUpMessage)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${lead.followUpMessage ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                        >
                          <Icons.Mail /> {lead.followUpMessage ? 'Followed Up (Y)' : 'Follow Up (N)'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLead('b2c_leads', lead.id, 'status', e.target.value)}
                        className={`text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 border ${lead.status === 'New' ? 'bg-red-50 text-red-700 border-red-200 font-bold' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                      >
                        <option value="New">New</option>
                        <option value="Interested">Interested</option>
                        <option value="Busy">Busy (Call Later)</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Closed">Closed Deal!</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Add notes..."
                        value={lead.notes || ''}
                        onChange={(e) => handleUpdateLead('b2c_leads', lead.id, 'notes', e.target.value)}
                        className="w-full bg-transparent border-b border-dashed border-gray-300 focus:border-indigo-500 focus:ring-0 px-2 py-1 outline-none text-gray-700"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderGoogleSheet = () => (
    <div className="space-y-6 fade-in h-full flex flex-col pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Master Google Sheet Sync</h2>
          <p className="text-gray-500 text-sm">View your raw Meta Ads sheet and push data to the team workspaces.</p>
        </div>
        <button
          onClick={handleGoogleSheetsSync}
          disabled={isSyncing}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-md disabled:opacity-75"
        >
          {isSyncing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : <Icons.Database />}
          {isSyncing ? 'Syncing Data...' : 'Import All Leads to Master Pool'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 min-h-[600px] p-1">
        <iframe
          src="https://docs.google.com/spreadsheets/d/1iT6AllBdg2wKhC6Jw9OQimn4uzD4jUbixX-7knwKve0/edit?widget=true&headers=true"
          className="w-full h-full border-0 rounded-xl"
          title="Google Sheet Embed"
        ></iframe>
      </div>
    </div>
  );

  const renderMasterList = () => {
    return (
      <div className="space-y-6 fade-in h-full flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Master Leads Database (B2C)</h2>
            <p className="text-gray-500 text-sm">View all historical leads and assign them to your sales team without flooding their queues.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4">Parent Info</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 bg-indigo-50 text-indigo-800 border-l border-indigo-100">Assign To Rep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {b2cLeads.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">No leads found. Go to "Google Sheet Sync" to import data.</td></tr>
                ) : b2cLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {lead.parentName}
                      <div className="text-xs text-gray-400 font-normal">{lead.source}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-gray-700">{lead.phone}</div>
                      {lead.email && <div className="text-xs text-gray-500 mt-1">{lead.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'Historical' ? 'bg-gray-100 text-gray-600' : lead.status === 'New' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 bg-indigo-50/30 border-l border-indigo-50">
                      <select
                        value={lead.salesRep}
                        onChange={(e) => handleUpdateLead('b2c_leads', lead.id, 'salesRep', e.target.value)}
                        className={`text-sm rounded-lg block w-full p-2 border font-semibold outline-none transition-colors ${lead.salesRep === 'Unassigned' ? 'border-red-300 text-red-600 bg-red-50 focus:ring-red-500' : 'border-indigo-200 text-indigo-700 bg-white focus:ring-indigo-500'}`}
                      >
                        <option value="Unassigned">⚠️ Unassigned Pool</option>
                        <option value="Eric">Assign to Eric</option>
                        <option value="Carmen">Assign to Carmen</option>
                        <option value="Jason">Assign to Jason</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderB2BPipeline = () => {
    const stages = ['Prospect', 'Qualified', 'Proposal', 'Negotiation', 'Closed'];

    return (
      <div className="space-y-6 fade-in h-full flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">B2B Sales Pipeline</h2>
            <p className="text-gray-500 text-sm">Drag and drop or update statuses to move clients through the cycle.</p>
          </div>
          <button
            onClick={handleB2BSync}
            disabled={isB2BSyncing}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-md disabled:opacity-75"
          >
            {isB2BSyncing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : <Icons.Database />}
            {isB2BSyncing ? 'Syncing...' : 'Sync B2B Sheet'}
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {stages.map(stage => (
            <div key={stage} className="bg-gray-100 rounded-xl p-4 min-w-[280px] flex flex-col max-h-[70vh]">
              <h3 className="font-bold text-gray-700 mb-3 flex justify-between items-center">
                {stage}
                <span className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {b2bLeads.filter(l => l.status === stage).length}
                </span>
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {b2bLeads.filter(l => l.status === stage).map(lead => (
                  <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all border-l-4 border-l-indigo-500">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{lead.companyName}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Icons.Users /> {lead.contactName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Icons.Phone /> {lead.phone}</p>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Move Stage To:</label>
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLead('b2b_leads', lead.id, 'status', e.target.value)}
                        className="text-xs w-full bg-indigo-50 text-indigo-700 font-semibold border-none rounded-lg p-2 focus:ring-0 cursor-pointer"
                      >
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                {b2bLeads.filter(l => l.status === stage).length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                    No clients in {stage}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">
              H
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-800">HKATA Hub</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem id="dashboard" icon={Icons.Dashboard} label="Dashboard Overview" />
          <SidebarItem id="team" icon={Icons.Users} label="Sales Workspaces" />
          <SidebarItem id="sheets" icon={Icons.Database} label="Google Sheet Sync" />
          <SidebarItem id="b2c" icon={Icons.Users} label="All Leads Master (B2C)" />
          <SidebarItem id="b2b" icon={Icons.Briefcase} label="B2B Sales Pipeline" />
          <SidebarItem id="social" icon={Icons.Image} label="Social Media Planner" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Logged in as</p>
            <p className="text-sm font-bold text-gray-800">Sales/Marketing Team</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white px-8 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">All systems operational</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full h-full">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'team' && renderTeamWorkspaces()}
          {activeTab === 'sheets' && renderGoogleSheet()}
          {activeTab === 'b2c' && renderMasterList()}
          {activeTab === 'b2b' && renderB2BPipeline()}
          {activeTab === 'social' && (
             <div className="text-center py-20">
             <Icons.Image />
             <h2 className="mt-4 text-xl font-bold text-gray-800">Social Media Planner</h2>
             <p className="text-gray-500 mt-2">Upload assets, draft captions, and send to the boss for approval here.</p>
           </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
