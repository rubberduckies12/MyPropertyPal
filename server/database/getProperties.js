async function getProperties(pool, accountId) {
    try {
        const query = {
            text: `
                SELECT
                    p.id AS propertyId,
                    p.name AS propertyName,
                    p.address AS propertyAddress,
                    p.city AS propertyCity,
                    p.county AS propertyCounty,
                    p.postcode AS propertyPostcode,
                    ps.property_status AS propertyStatus
                FROM 
                    property p
                JOIN
                    property_status ps ON p.status_id = ps.id
                WHERE 
                    p.landlord_id = $1
            `,
            values: [landlordId],
        };

        const result = await pool.query(query);

        return result.rows;
    } catch(err) {
        console.error('Error in getProperties:', err);
        throw new Error('Internal Server Error');
    }    
}

module.exports = getProperties;