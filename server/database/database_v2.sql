-- Might need to consider encrypting all the data depending on what our hosting provider provides
-- User Names first and last

CREATE TABLE IF NOT EXISTS account_role (
    id SERIAL PRIMARY KEY,
    role VARCHAR(15) NOT NULL UNIQUE
);

-- Needs confirming
INSERT INTO account_role 
    (role)
VALUES
    ('landlord'),
    ('tenant');

-- [password] data type will depend on the hashing algorithm used, bcrypt is okay for passwords
CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES account_role(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- [landlord_id] might be worth adding their respective landlord
-- although can be found going through properties table
CREATE TABLE IF NOT EXISTS tenant (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES account(id) ON DELETE CASCADE
);


-- Might be worth adding more columns for payment etc
-- i think logging past payments is a good idea to create rent payment receipts
-- adding a tax columnn for zoho accounting integration
-- landlord bank info using SHA-256 hashing
CREATE TABLE IF NOT EXISTS payment_plan (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    monthly_rate DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS landlord (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    payment_plan_id INT NOT NULL REFERENCES payment_plan(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

-- Needs confirming, looks fine starndard as available i think
INSERT INTO property_status (status) VALUES
    ('Available'),
    ('Occupied'),
    ('Under Maintenance'),
    ('Not Available');

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

-- Modified to include rent stuff
CREATE TABLE IF NOT EXISTS property_tenant (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    pays_rent BOOLEAN NOT NULL DEFAULT TRUE,
    rent_amount DECIMAL(10, 2)L,
    rent_due_date SMALLINT,
    UNIQUE (property_id, tenant_id)
);

-- Slightly different to ERD
CREATE TABLE IF NOT EXISTS document_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE
);

-- Insert statement for document_type

-- Slightly different to ERD
CREATE TABLE IF NOT EXISTS document (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    incident_id INT REFERENCES incident(id) ON DELETE SET NULL,
    document_type_id INT NOT NULL REFERENCES document_type(id) ON DELETE CASCADE,
    document_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calendar_event_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

-- Insert statement for calendar_event_status

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

CREATE TABLE IF NOT EXISTS incident_severity (
    id SERIAL PRIMARY KEY,
    severity VARCHAR(20) NOT NULL UNIQUE
);

-- Insert statement for incident_severity

CREATE TABLE IF NOT EXISTS incident (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    severity_id INT NOT NULL REFERENCES incident_severity(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed BOOLEAN NOT NULL DEFAULT FALSE
);


-- Views
CREATE OR REPLACE VIEW v_property_info AS
SELECT
    p.id AS propertyId,
    p.