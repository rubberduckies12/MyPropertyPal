async function numOfTenants(pool, landlordId) {
    try {
        const query = {
            text: `
                SELECT 
                    COUNT(*) AS numOfTenants
                FROM 
                    property
                WHERE 
                    landlord_id = $1
            `,
            values: [landlordId],
        };

        const result = await pool.query(query);

        return result.rows[0] || 0;
    } catch(err) {
        console.error('Error in numOfTenants:', err);
        throw err;
    }
}

module.exports = numOfTenants;