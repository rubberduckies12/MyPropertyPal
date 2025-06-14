async function numOfProperties(pool, landlordId) {
    try {
        const query = {
            text: `
                SELECT 
                    COUNT(*) AS numOfProperties
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
        console.error('Error in numOfProperties:', err);
        throw err;
    }
}

module.exports = numOfProperties;