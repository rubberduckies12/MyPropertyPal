-- ===== Account Roles =====
CREATE TABLE IF NOT EXISTS account_role (
    id SERIAL PRIMARY KEY,
    role VARCHAR(15) NOT NULL UNIQUE
);

INSERT INTO account_role (role)
VALUES ('landlord'), ('tenant')
ON CONFLICT DO NOTHING;

-- ===== Accounts =====
CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES account_role(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- ===== Tenants =====
CREATE TABLE IF NOT EXISTS tenant (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES account(id) ON DELETE CASCADE
);

-- ===== Payment Plans =====
CREATE TABLE IF NOT EXISTS payment_plan (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    monthly_rate DECIMAL(10, 2) NOT NULL
);

-- ===== Landlords =====
CREATE TABLE IF NOT EXISTS landlord (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    payment_plan_id INT NOT NULL REFERENCES payment_plan(id) ON DELETE CASCADE
);

-- ===== Property Status =====
CREATE TABLE IF NOT EXISTS property_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO property_status (status) VALUES
    ('Available'),
    ('Occupied'),
    ('Under Maintenance'),
    ('Not Available')
ON CONFLICT DO NOTHING;

-- ===== Properties =====
CREATE TABLE IF NOT EXISTS property (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES landlord(id) ON DELETE CASCADE,
    property_status_id INT NOT NULL REFERENCES property_status(id),
    lead_tenant_id INT NULL REFERENCES tenant(id) ON DELETE SET NULL,
    number VARCHAR(10),
    name VARCHAR(50),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    postcode VARCHAR(20) NOT NULL
);

-- ===== Property-Tenant Join Table =====
CREATE TABLE IF NOT EXISTS property_tenant (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    pays_rent BOOLEAN NOT NULL DEFAULT TRUE,
    rent_amount DECIMAL(10, 2),
    rent_due_date SMALLINT,
    UNIQUE (property_id, tenant_id)
);

ALTER TABLE property_tenant
  ADD CONSTRAINT chk_rent_due_date CHECK (rent_due_date BETWEEN 1 AND 31);

-- ===== Rent Payments =====
CREATE TABLE IF NOT EXISTS rent_payment (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    paid_on DATE NOT NULL,
    method VARCHAR(30),
    reference VARCHAR(100)
);

-- ===== Expenses =====
CREATE TABLE IF NOT EXISTS expense (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES landlord(id) ON DELETE CASCADE,
    property_id INT REFERENCES property(id) ON DELETE CASCADE, -- removed NOT NULL
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    incurred_on DATE NOT NULL,
    document_id INT REFERENCES document(id) ON DELETE SET NULL
);

-- ===== Document Types =====
CREATE TABLE IF NOT EXISTS document_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO document_type (type) VALUES
    ('Tenancy Agreement'),
    ('Section 21 Notice'),
    ('Gas Safety Certificate'),
    ('Inventory Report'),
    ('Inspection Report')
ON CONFLICT DO NOTHING;

-- ===== Documents =====
CREATE TABLE IF NOT EXISTS document (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    incident_id INT REFERENCES incident(id) ON DELETE SET NULL,
    document_type_id INT NOT NULL REFERENCES document_type(id) ON DELETE CASCADE,
    document_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== Incident Severity =====
CREATE TABLE IF NOT EXISTS incident_severity (
    id SERIAL PRIMARY KEY,
    severity VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO incident_severity (severity) VALUES
    ('Low'), ('Medium'), ('High'), ('Critical')
ON CONFLICT DO NOTHING;

-- ===== Incidents =====
CREATE TABLE IF NOT EXISTS incident (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    severity_id INT NOT NULL REFERENCES incident_severity(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed BOOLEAN NOT NULL DEFAULT FALSE
);

-- ===== Calendar Event Status =====
CREATE TABLE IF NOT EXISTS calendar_event_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO calendar_event_status (status) VALUES
    ('Scheduled'), ('Completed'), ('Cancelled')
ON CONFLICT DO NOTHING;

-- ===== Calendar Events =====
CREATE TABLE IF NOT EXISTS calendar_event (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES landlord(id) ON DELETE CASCADE,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    status_id INT NOT NULL REFERENCES calendar_event_status(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== Chat =====
CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_tenant (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    UNIQUE (chat_id, tenant_id)
);

CREATE TABLE IF NOT EXISTS chat_message (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    incident_id INT REFERENCES incident(id) ON DELETE SET NULL,
    message_text VARCHAR(512) NOT NULL,
    sent_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_message_status (
    id SERIAL PRIMARY KEY,
    chat_message_id INT NOT NULL REFERENCES chat_message(id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE
);

-- ===== Audit Log =====
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by INT REFERENCES account(id),
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- ===== Views =====
CREATE OR REPLACE VIEW v_property_info AS
SELECT
    p.id AS propertyId,
    p.name AS propertyName,
    p.number AS propertyNumber,
    p.address AS propertyAddress,
    p.city AS propertyCity,
    p.county AS propertyCounty,
    p.postcode AS propertyPostcode,
    p.landlord_id AS landlordId,
    ps.status AS propertyStatus
FROM
    property p
JOIN
    property_status ps ON p.property_status_id = ps.id;

CREATE OR REPLACE VIEW v_tenant_info AS 
SELECT
    a.id AS accountId,
    a.first_name AS firstName,
    a.last_name AS lastName,
    a.email AS email,
    t.id AS tenantId,
    pt.property_id AS propertyId
FROM
    account a
JOIN
    tenant t ON a.id = t.account_id
JOIN
    property_tenant pt ON t.id = pt.tenant_id;
