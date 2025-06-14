const getRole = require('./getRole');

async function getEvents(pool, accountId, isRecent = false) {
    try {
        const accountRole = await getRole(pool, accountId);

        const query = {
            text: `
                SELECT
                    e.id AS eventId,
                    e.title AS eventTitle,
                    e.description AS eventDescription,
                    e.scheduled_at AS eventScheduledAt,
                    e.duration AS eventDuration,
                    e.created_at AS eventCreatedAt,
                    p.id AS propertyId,
                    p.number AS propertyNumber,
                    p.address AS propertyAddress,
                    p.postcode AS propertyPostcode,
                    s.status AS eventStatus
                FROM
                    calendar_event e
                JOIN
                    property p ON e.property_id = p.id
                JOIN
                    status s ON e.status_id = s.id
            `,
            values: [accountId],
        };

        // If user is a tenant
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
                    landlord l ON e.landlord_id = l.id
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
                AND e.scheduled_at <= NOW() + INTERVAL '1 month'
                AND e.scheduled_at >= NOW()
            `;
        }

        // Final touches
        query.text += `
            
        `;


        const result = await pool.query(query);

        return result.rows.map(event => {
            return {
                eventId: event.eventId,
                eventTitle: event.eventTitle,
                eventDescription: event.eventDescription,
                eventScheduledAt: event.eventScheduledAt,
                eventDuration: event.eventDuration,
                eventCreatedAt: event.eventCreatedAt,
                propertyId: event.propertyId,
                propertyNumber: event.propertyNumber,
                propertyAddress: event.propertyAddress,
                propertyPostcode: event.propertyPostcode,
                eventStatus: event.eventStatus
            };
        });
        
    } catch(err) {
        console.error('Error in getEvents:', err);
        throw new Error('Failed to retrieve events');
    } 
}

module.exports = getEvents;