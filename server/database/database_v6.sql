-- ===== Account Roles =====
CREATE TABLE IF NOT EXISTS account_role (
    id SERIAL PRIMARY KEY,
    role VARCHAR(15) NOT NULL UNIQUE
);

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
    account_id INT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    is_pending BOOLEAN DEFAULT TRUE,
    invite_token VARCHAR(255),
    stripe_customer_id VARCHAR(64),
    stripe_payment_method_id VARCHAR(64)
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
    payment_plan_id INT NOT NULL REFERENCES payment_plan(id) ON DELETE CASCADE,
    stripe_account_id VARCHAR(64)
);

-- ===== Property Status =====
CREATE TABLE IF NOT EXISTS property_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

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
    rent_due_date DATE,
    rent_schedule_type VARCHAR(30) DEFAULT 'monthly',
    rent_schedule_value SMALLINT,
    stripe_subscription_id VARCHAR(64),
    UNIQUE (property_id, tenant_id)
);

-- ===== Rent Payments =====
CREATE TABLE IF NOT EXISTS rent_payment (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    paid_on DATE NOT NULL,
    method VARCHAR(30),
    reference VARCHAR(100),
    stripe_payment_intent_id VARCHAR(64),
    stripe_subscription_id VARCHAR(64)
);

-- ===== Expenses =====
CREATE TABLE IF NOT EXISTS expense (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES landlord(id) ON DELETE CASCADE,
    property_id INT REFERENCES property(id) ON DELETE CASCADE,
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

-- ===== Incidents =====
CREATE TABLE IF NOT EXISTS public.incident (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    severity_id INT NOT NULL REFERENCES public.incident_severity(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed BOOLEAN NOT NULL DEFAULT false,
    tenant_id INT REFERENCES public.tenant(id) ON DELETE SET NULL,
    progress VARCHAR(20) NOT NULL DEFAULT 'Not Started',
    updated_at TIMESTAMP
);

-- ===== Calendar Event Status =====
CREATE TABLE IF NOT EXISTS calendar_event_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

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

-- ===== General Tasks =====
CREATE TABLE IF NOT EXISTS task_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    date_completed DATE,
    status_id INT REFERENCES task_status(id)
);

-- ===== Compliance Events =====
CREATE TABLE IF NOT EXISTS compliance_event (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    reminder_days INT[] DEFAULT ARRAY[90]
);

CREATE TABLE IF NOT EXISTS compliance_reminder_sent (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES compliance_event(id) ON DELETE CASCADE,
    reminder_days INT NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (event_id, reminder_days)
);

-- ===== Stripe Integration Columns =====
-- Already included above in landlord, tenant, property_tenant, rent_payment

-- ===== Views =====
CREATE OR REPLACE VIEW public.v_property_info AS
SELECT
    p.id AS propertyid,
    p.name AS propertyname,
    p.number AS propertynumber,
    p.address AS propertyaddress,
    p.city AS propertycity,
    p.county AS propertycounty,
    p.postcode AS propertypostcode,
    p.landlord_id AS landlordid,
    ps.status AS propertystatus
FROM
    public.property p
JOIN
    public.property_status ps ON p.property_status_id = ps.id;

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