async function getRole(pool, accountId) {
    try {
        const query = {
            text: `
                SELECT
                    r.role AS accountRole
                FROM
                    account_role r
                JOIN
                    account a ON r.id = a.role_id
                WHERE
                    a.id = $1
            `,
            values: [accountId],
        };

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            throw new Error('Role not found for the given account ID');
        }

        return result.rows[0].accountRole;
    } catch(err) {
        console.error('Error in getRole:', err);
        throw new Error('Failed to retrieve role');
    }
} 

module.exports = getRole;