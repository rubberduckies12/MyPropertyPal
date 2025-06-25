import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Shared/login';
import Registration from './Shared/registration';
import VerifyEmail from './Shared/verifyemail';
import LandlordDashboard from './landlords/landlord-dash';
import Sidebar from './landlords/Sidebar';
import LandlordMessages from './landlords/landlord-messages';
import LandlordPortfolio from './landlords/landlord-portfolio';
import LandlordIncidentManager from './landlords/landlord-incidentmanager';
import LandlordTenants from './landlords/landlord-Tenants';
import ResetPassword from './Shared/ResetPassword';
import LandlordPayments from './landlords/Landlord-Payments';
import LandlordAccountSettings from './landlords/Landlord-accountsettings';
import AI from './Shared/AI';
import LandlordHomeImprovement from './landlords/Landlord-homeimprovement';
import CalendarPage from './Shared/CalenderPage';
import TenantDashboard from './tenants/tenant-dash';
import TenantMessages from './tenants/tenant-messages';
import { parseISO } from 'date-fns';

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AppRoutes = () => {
  // -------------------- State --------------------
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ name: '', address: '', rent: '' });
  const [assignTenant, setAssignTenant] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [landlordUser, setLandlordUser] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarError, setCalendarError] = useState("");
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // -------------------- Auth & User --------------------
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setAuthLoaded(true);
  }, []);

  // -------------------- Data Fetching --------------------
  // Tenants (landlord)
  useEffect(() => {
    if (!user || !token) return;
    if (user.role === 'landlord') {
      axios.get("http://localhost:5001/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setTenants(res.data))
      .catch(() => setTenants([]));
    } else {
      setTenants([]);
    }
  }, [user, token]);

  // Messages for selected tenant (landlord)
  useEffect(() => {
    if (selectedTenant && user && token) {
      // Fetch messages
      axios.get("http://localhost:5001/api/messages/conversation", {
        params: { userA: user.userId, userB: selectedTenant.userId },
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMessages(msgs => ({ ...msgs, [selectedTenant.userId]: res.data })));
    }
  }, [selectedTenant, user, token]);

  // Properties (landlord/tenant)
  useEffect(() => {
    if (user && user.role === 'landlord' && token) {
      axios.get("http://localhost:5001/api/properties", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProperties(res.data))
      .catch(() => setProperties([]));
    } else if (user && user.role === 'tenant' && token) {
      axios.get("http://localhost:5001/api/properties/tenant", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProperties([res.data]))
      .catch(() => setProperties([]));
    } else {
      setProperties([]);
    }
  }, [user, token]);

  // Incidents (landlord)
  useEffect(() => {
    if (user && user.role === 'landlord' && token) {
      axios.get("http://localhost:5001/api/incidents", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setIncidents(res.data))
      .catch(() => setIncidents([]));
    } else {
      setIncidents([]);
    }
  }, [user, token]);

  // Payments (landlord)
  useEffect(() => {
    if (user && user.role === 'landlord' && token) {
      axios.get("http://localhost:5001/api/payments", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setPayments(res.data))
      .catch(() => setPayments([]));
    } else {
      setPayments([]);
    }
  }, [user, token]);

  // Landlord info (tenant)
  useEffect(() => {
    const fetchLandlord = async () => {
      if (user && user.role === "tenant" && user.linkedLandlordId && token) {
        try {
          const res = await axios.get(
            `http://localhost:5001/api/users/${user.linkedLandlordId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setLandlordUser(res.data);
        } catch {
          setLandlordUser(null);
        }
      } else {
        setLandlordUser(null);
      }
    };
    fetchLandlord();
  }, [user, token]);

  // Messages for tenant-landlord conversation (tenant)
  useEffect(() => {
    if (user && user.role === "tenant" && landlordUser && token) {
      axios.get("http://localhost:5001/api/messages/conversation", {
        params: { userA: user.userId, userB: landlordUser.userId },
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMessages(msgs => ({ ...msgs, [landlordUser.userId]: res.data })));
    }
  }, [user, landlordUser, token]);

  // -------------------- Calendar Logic --------------------
  const fetchCalendarEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/calenderevent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalendarEvents(
        res.data.map((ev) => ({
          id: ev._id,
          title: ev.description,
          start: parseISO(ev.date + "T" + (ev.time || "09:00")),
          end: parseISO(ev.date + "T" + (ev.time || "09:00")),
          allDay: false,
          ...ev,
        }))
      );
    } catch (err) {
      setCalendarError("Could not load calendar events.");
    }
  };

  const saveCalendarEvent = async (modalEvent, user) => {
    try {
      if (modalEvent.isNew) {
        await axios.post(
          "http://localhost:5001/api/calenderevent",
          {
            landlordId:
              user.role === "landlord"
                ? user.userId
                : user.role === "tenant"
                ? user.linkedLandlordId
                : modalEvent.landlordId,
            tenantId: user.role === "tenant" ? user.userId : modalEvent.tenantId,
            description: modalEvent.description,
            date: modalEvent.date,
            time: modalEvent.time,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.patch(
          `http://localhost:5001/api/calenderevent/${modalEvent.id}`,
          {
            description: modalEvent.description,
            date: modalEvent.date,
            time: modalEvent.time,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await fetchCalendarEvents();
      return true;
    } catch (err) {
      setCalendarError("Could not save event.");
      return false;
    }
  };

  const deleteCalendarEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5001/api/calenderevent/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCalendarEvents();
      return true;
    } catch (err) {
      setCalendarError("Could not delete event.");
      return false;
    }
  };

  const fetchCalendarTenants = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      setCalendarError("Could not load tenants.");
      return [];
    }
  };

  // -------------------- Auth Handlers --------------------
  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post("http://localhost:5001/api/users/login", credentials);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.user.role === 'landlord') {
        navigate("/dashboard");
      } else if (response.data.user.role === 'tenant') {
        navigate("/tenant-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleRegister = async (registrationData) => {
    try {
      await axios.post("http://localhost:5001/api/users/register", registrationData);
      alert("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleRequestReset = async (email) => {
    try {
      const res = await axios.post("http://localhost:5001/api/users/request-reset", { email });
      return res.data.message;
    } catch (err) {
      throw new Error('Error sending reset email.');
    }
  };

  const handleRegisterClick = () => navigate("/registration");
  const handleLoginClick = () => navigate("/login");

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setTenants([]);
    setSelectedTenant(null);
    setMessages({});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/login");
  };

  // -------------------- Sidebar Navigation --------------------
  const sidebarLinks = [
    { label: "Dashboard", onClick: () => navigate("/dashboard") },
    { label: "Properties", onClick: () => navigate("/properties") },
    { label: "Tenants", onClick: () => navigate("/tenants") },
    { label: "Incidents", onClick: () => navigate("/incidents") },
    { label: "Messages", onClick: () => navigate("/messages") },
    { label: "Payments", onClick: () => navigate("/payments") },
    { label: "Settings", onClick: () => navigate("/settings") },
    { label: "My PropertyPal", onClick: () => navigate("/ai") },
    { label: "Local Contractors", onClick: () => navigate("/homeimprovement") },
    { label: "Calendar", onClick: () => navigate("/calendar") },
    { label: "Log out", isLogout: true, onClick: () => setShowLogoutConfirm(true) },
  ];

  const tenantSidebarLinks = [
    { label: "Dashboard", onClick: () => navigate("/tenant-dashboard") },
    { label: "Messages", onClick: () => navigate("/tenant-messages") },
    { label: "Calendar", onClick: () => navigate("/calendar") },
    { label: "My PropertyPal", onClick: () => navigate("/ai") },
    { label: "Settings", onClick: () => navigate("/settings") },
    { label: "Log out", isLogout: true, onClick: () => setShowLogoutConfirm(true) },
  ];

  // -------------------- UI Handlers --------------------
  const handleSelectTenant = (tenant) => {
    setSelectedTenant(tenant);
    setMessageInput('');
  };

  const handleInputChange = (e) => setMessageInput(e.target.value);

  // Send message (landlord)
  const handleSend = () => {
    if (!selectedTenant || !messageInput.trim()) return;
    // Send message
    axios.post("http://localhost:5001/api/messages", {
      fromUserId: user.userId,
      toUserId: selectedTenant.userId,
      content: messageInput
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setMessages(prev => ({
        ...prev,
        [selectedTenant.userId]: [
          ...(prev[selectedTenant.userId] || []),
          res.data
        ]
      }));
      setMessageInput('');
    });
  };

  // Send message (tenant)
  const handleSendTenantMessage = () => {
    if (!landlordUser || !messageInput.trim()) return;
    axios.post("http://localhost:5001/api/messages", {
      fromUserId: user.userId,
      toUserId: landlordUser.userId,
      content: messageInput
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setMessages(prev => ({
        ...prev,
        [landlordUser.userId]: [
          ...(prev[landlordUser.userId] || []),
          res.data
        ]
      }));
      setMessageInput('');
    });
  };

  // -------------------- Property Handlers --------------------
  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/properties", newProperty, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewProperty({ name: '', address: '', rent: '' });
      const res = await axios.get("http://localhost:5001/api/properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(res.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:5001/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.filter(p => p.propertyId !== propertyId));
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleAssignTenant = async (propertyId, tenantId) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/properties/${propertyId}/tenant`,
        { tenantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!tenantId) {
        await axios.patch(
          `http://localhost:5001/api/properties/${propertyId}/lease-end`,
          { leaseEnd: "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      const propRes = await axios.get("http://localhost:5001/api/properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(propRes.data);
      const tenantRes = await axios.get("http://localhost:5001/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(tenantRes.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/users/${tenantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get("http://localhost:5001/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(res.data);
      const propRes = await axios.get("http://localhost:5001/api/properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(propRes.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleUpdateRent = async (propertyId, newRent) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/properties/${propertyId}/rent`,
        { rent: newRent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const propRes = await axios.get("http://localhost:5001/api/properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(propRes.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleUpdateLeaseEnd = async (propertyId, newLeaseEnd) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/properties/${propertyId}/lease-end`,
        { leaseEnd: newLeaseEnd },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const propRes = await axios.get("http://localhost:5001/api/properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(propRes.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // -------------------- Payment Handlers --------------------
  const handleSetupDirectDebit = async ({ propertyId, tenantId, amount, dueDate }) => {
    try {
      await axios.post("http://localhost:5001/api/payments/set-rent", {
        propertyId,
        tenantId,
        rentAmount: amount,
        dueDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get("http://localhost:5001/api/payments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleMarkPaid = async (paymentId) => {
    try {
      await axios.patch(`http://localhost:5001/api/payments/${paymentId}`, { 
        paidDate: new Date(), 
        status: 'paid' 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get("http://localhost:5001/api/payments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await axios.delete(`http://localhost:5001/api/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get("http://localhost:5001/api/payments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // -------------------- Profile/Account Handlers --------------------
  const handleUpdateProfile = async (form) => {
    try {
      const res = await axios.patch(
        `http://localhost:5001/api/users/${user.userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleUpdatePlan = async (plan) => {
    try {
      const res = await axios.patch(
        `http://localhost:5001/api/users/${user.userId}`,
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      alert("Plan updated!");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      await axios.post(
        "http://localhost:5001/api/users/change-password",
        { userId: user.userId, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed!");
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await axios.delete(
        `http://localhost:5001/api/users/${user.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleLogout();
      alert("Account deleted.");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // -------------------- UI: Video Background --------------------
  const showVideo = ["/login", "/registration"].includes(window.location.pathname);

  // -------------------- Render --------------------
  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Video background for login/registration */}
      {showVideo && (
        <>
          <video 
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/LoginBackgorund.mp4"
            autoPlay
            loop
            muted
          />
          <div className="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-30"></div>
        </>
      )}

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Log Out</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Routes */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={
          <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
            <Login 
              onLogin={handleLogin} 
              onRegisterClick={handleRegisterClick}
              onRequestReset={handleRequestReset}
            />
          </div>
        } />
        <Route path="/registration" element={
          <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
            <Registration 
              onRegister={handleRegister} 
              onLoginClick={handleLoginClick} 
            />
          </div>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Landlord routes */}
        {user?.role === 'landlord' && (
          <>
            <Route path="/dashboard" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <LandlordDashboard
                  user={user}
                  tenantCount={tenants.length}
                  recentMessages={Object.values(messages).flat()}
                  incidents={incidents}
                  properties={properties}
                />
              </div>
            } />
            <Route path="/properties" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <LandlordPortfolio
                  properties={properties}
                  tenants={tenants}
                  newProperty={newProperty}
                  onNewPropertyChange={setNewProperty}
                  onAddProperty={handleAddProperty}
                  onRemoveProperty={handleRemoveProperty}
                  assignTenant={assignTenant}
                  onAssignTenantChange={setAssignTenant}
                  onAssignTenant={handleAssignTenant}
                  onUpdateRent={handleUpdateRent}
                  onUpdateLeaseEnd={handleUpdateLeaseEnd}
                />
              </div>
            } />
            <Route path="/tenants" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <LandlordTenants
                  tenants={tenants}
                  properties={properties}
                  landlordId={user?.userId}
                  onDeleteTenant={handleDeleteTenant}
                />
              </div>
            } />
            <Route path="/incidents" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <LandlordIncidentManager
                  incidents={incidents}
                  properties={properties}
                />
              </div>
            } />
            <Route path="/messages" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <LandlordMessages
                  landlord={user}
                  tenants={tenants}
                  selectedTenant={selectedTenant}
                  messages={messages[selectedTenant?.userId] || []}
                  onSelectTenant={handleSelectTenant}
                  input={messageInput}
                  onInputChange={handleInputChange}
                  onSend={handleSend}
                />
              </div>
            } />
            <Route path="/payments" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <LandlordPayments
                  properties={properties}
                  tenants={tenants}
                  payments={payments}
                  onSetupDirectDebit={handleSetupDirectDebit}
                  onMarkPaid={handleMarkPaid}
                  onDeletePayment={handleDeletePayment}
                />
              </div>
            } />
            <Route path="/settings" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <LandlordAccountSettings
                  user={user}
                  onUpdateProfile={handleUpdateProfile}
                  onDeleteAccount={handleDeleteAccount}
                  onUpdatePlan={handleUpdatePlan}
                  onChangePassword={handleChangePassword}
                />
              </div>
            } />
            <Route path="/ai" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <AI userType="landlord" />
              </div>
            } />
            <Route path="/homeimprovement" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={sidebarLinks} />
                <LandlordHomeImprovement />
              </div>
            } />
          </>
        )}

        {/* Tenant routes */}
        {user?.role === 'tenant' && (
          <>
            <Route path="/tenant-dashboard" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={tenantSidebarLinks} />
                <TenantDashboard
                  tenant={user}
                  landlord={landlordUser}
                  property={properties.find(
                    p => String(p.tenantId) === String(user.userId)
                  )}
                  messages={messages[landlordUser?.userId] || []}
                  events={calendarEvents.filter(
                    ev => String(ev.tenantId) === String(user.userId)
                  )}
                />
              </div>
            } />
            <Route path="/tenant-messages" element={
              <div className="min-h-screen bg-white flex">
                <Sidebar sidebarLinks={tenantSidebarLinks} />
                <TenantMessages
                  user={user}
                  landlord={landlordUser}
                  messages={messages[landlordUser?.userId] || []}
                  input={messageInput}
                  onInputChange={handleInputChange}
                  onSend={handleSendTenantMessage}
                />
              </div>
            } />
            {/* You can add more tenant-specific routes here */}
          </>
        )}

        {/* SHARED CALENDAR ROUTE FOR BOTH ROLES */}
        <Route path="/calendar" element={
          <div className="min-h-screen bg-white flex">
            <Sidebar sidebarLinks={user?.role === 'tenant' ? tenantSidebarLinks : sidebarLinks} />
            <CalendarPage 
              user={user}
              events={calendarEvents}
              saveEvent={saveCalendarEvent}
              deleteEvent={deleteCalendarEvent}
              fetchEvents={fetchCalendarEvents}
              fetchTenants={fetchCalendarTenants}
              error={calendarError}
            />
          </div>
        } />

        {/* AI route for both roles */}
        <Route path="/ai" element={
          <div className="min-h-screen bg-white flex">
            <Sidebar sidebarLinks={user?.role === 'tenant' ? tenantSidebarLinks : sidebarLinks} />
            <AI userType={user?.role === 'tenant' ? "tenant" : "landlord"} />
          </div>
        } />
      </Routes>
    </div>
  );
};

// App wrapper with Router
const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;

