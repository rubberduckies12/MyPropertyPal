const getRole = require('./getRole');

async function getIncidents(pool, accountId, isRecent = false) {
    try {
        const accountRole = getRole(pool, accountId);

        const query = {
            text: `
                SELECT
                    i.id AS incidentId,
                    i.title AS incidentTitle,
                    i.description AS incidentDescription,
                    i.created_at AS incidentCreatedAt,
                    i.closed AS incidentClosed,
                    p.id AS propertyId,
                    p.number AS propertyNumber,
                    p.address AS propertyAddress,
                    p.postcode AS propertyPostcode,
                    is.severity AS incidentStatus
                FROM
                    indicent i
                JOIN 
                    indicent_severity is ON i.severity_id = is.id
                JOIN
                    property p ON i.property_id = p.id
            `,
            values: [accountId],
        };

        if (accountRole === 'tenant') {
            query.text += `
                JOIN
                    property_tenant pt ON p.id = pt.property_id
                JOIN
                    tenant t ON pt.tenant_id = t.id
                JOIN
                    account a ON t.account_id = a.id
                WHERE
                    a.id = $1
            `;
        }
        // If user is a landlord
        else if (accountRole === 'landlord') {
            query.text += `
                JOIN 
                    landlord l ON p.landlord_id = l.id
                JOIN 
                    account a ON l.account_id = a.id
                WHERE
                    a.id = $1
            `;
        } 
        // If neither, error out
        else {
            throw new Error('Unsupported account role');
        }

        // Add recent functionality
        if (isRecent) {
            query.text += `
                AND i.created_at >= NOW() - INTERVAL '7 days'
            `;
        }

        // Final touches
        query.text += `
            ORDER BY i.created_at DESC
        `;

        const result = await pool.query(query);

        return result.rows.map(incident => {
            return {
                incidentId: incident.incidentid,
                incidentTitle: incident.incidenttitle,
                incidentDescription: incident.incidentdescription,
                incidentCreatedAt: incident.incidentcreatedat,
                incidentClosed: incident.incidentclosed,
                propertyId: incident.propertyid,
                propertyNumber: incident.propertynumber,
                propertyAddress: incident.propertyaddress,
                propertyPostcode: incident.propertypostcode,
                incidentStatus: incident.incidentstatus
            }
        });
    } catch(err) {
        console.error('Error in getIncidents:', err);
        throw new Error('Failed to retrieve incidents');
    }
}

module.exports = getIncidents;