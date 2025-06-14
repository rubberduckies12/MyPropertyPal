const numOfTenants = require('../database/numOfTenants');
const getIncome = require('../database/getIncome');
const numOfProperties = require('../database/numOfProperties');
const getEvents = require('../database/getEvents');
const getMessages = require('../database/getMessages');
const getIncidents = require('../database/getIncidents');

// Fix the ids
async function dashboardOverview(req, res, pool) {
    try {
        // Function that calls lots of other functions

        // Num of tenants
        const tenantCount = await numOfTenants(pool, req.user.id);

        // Income
        const income = await getIncome(pool, req.user.id);

        // Num of properties
        const propertyCount = await numOfProperties(pool, req.user.id);

        // Events
        const recentEvents = await getEvents(pool, req.user.id, isRecent=true);
        
        // Messages
        const recentMessages = await getMessages(pool, req.user.id, isRecent=true);

        // Recent incidents
        const recentIncidents = await getIncidents(pool, req.user.id, isRecent=true);
    } catch (err) {
        console.error('Error in dashboardOverview:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = dashboardOverview;