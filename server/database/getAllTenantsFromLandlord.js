async function getTenants(pool, landlordId) {
    try {
        const query = {
            text: `
                SELECT
                    a.first_name AS firstName,
                    a.last_name AS lastName,
                    a.email AS email,
                    
            `,
            values: [landlordId]
        };
    } catch(err) {
        console.error('Error fetching tenants:', err);
        throw new Error('Failed to fetch tenants');
    }
}

module.exports = getAllTenantsFromLandlord;