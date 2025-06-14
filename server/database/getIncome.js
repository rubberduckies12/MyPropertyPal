async function getIncome(pool, landlordId) {
    try {
        const query = {
            text: `
                SELECT
                    SUM(pt.rent_amount) AS total_income
                FROM
                    property_tenants pt
                JOIN
                    property p ON pt.property_id = p.id
                WHERE
                    p.landlord_id = $1
                    AND pt.pays_rent = true
            `,
            values: [landlordId],
        };

        const result = await pool.query(query);

        return result.rows[0].total_income || 0;
    } catch (err) {
        console.error('Error in getIncome:', err);
        throw new Error('Internal Server Error');
    }
}

module.exports = getIncome;