-- PostgreSQL Database Schema
-- Updated Version

-- ===== Account Roles =====
CREATE TABLE public.account_role (
    id SERIAL PRIMARY KEY,
    role VARCHAR(15) NOT NULL UNIQUE
);

-- ===== Accounts =====
CREATE TABLE public.account (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES public.account_role(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL
);

-- ===== Admin Accounts =====
CREATE TABLE public.admin_account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    pin_number CHAR(4) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ===== Audit Log =====
CREATE TABLE public.audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by INT REFERENCES public.account(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    details TEXT
);

-- ===== Calendar Events =====
CREATE TABLE public.calendar_event (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    status_id INT NOT NULL REFERENCES public.calendar_event_status(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.calendar_event_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

-- ===== Chat =====
CREATE TABLE public.chat (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    recipient_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE
);

CREATE TABLE public.chat_message (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES public.chat(id) ON DELETE CASCADE,
    sender_id INT NOT
    incident_id INT REFERENCES public.incident(id) ON DELETE SET NULL,
    message_text VARCHAR(512) NOT NULL,
    sent_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.chat_message_status (
    id SERIAL PRIMARY KEY,
    chat_message_id INT NOT NULL REFERENCES public.chat_message(id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE public.chat_tenant (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES public.chat(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    UNIQUE (chat_id, tenant_id)
);

-- ===== Compliance Events =====
CREATE TABLE public.compliance_event (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    reminder_days INT[] DEFAULT ARRAY[90]
);

CREATE TABLE public.compliance_reminder_sent (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES public.compliance_event(id) ON DELETE CASCADE,
    reminder_days INT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (event_id, reminder_days)
);

-- ===== Documents =====
CREATE TABLE public.document_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE public.document (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    incident_id INT REFERENCES public.incident(id) ON DELETE SET NULL,
    document_type_id INT NOT NULL REFERENCES public.document_type(id) ON DELETE CASCADE,
    document_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ===== Expenses =====
CREATE TABLE public.expense (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_id INT REFERENCES public.property(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    incurred_on DATE NOT NULL,
    document_id INT REFERENCES public.document(id) ON DELETE SET NULL
);

-- ===== Incidents =====
CREATE TABLE public.incident_severity (
    id SERIAL PRIMARY KEY,
    severity VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE public.incident (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    severity_id INT NOT NULL REFERENCES public.incident_severity(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closed BOOLEAN DEFAULT FALSE NOT NULL,
    tenant_id INT REFERENCES public.tenant(id) ON DELETE SET NULL,
    progress VARCHAR(20) DEFAULT 'Not Started' NOT NULL,
    updated_at TIMESTAMP
);

-- ===== Landlords =====
CREATE TABLE public.landlord (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    payment_plan_id INT NOT NULL REFERENCES public.payment_plan(id) ON DELETE CASCADE,
    stripe_account_id VARCHAR(64)
);

-- ===== Payment Plans =====
CREATE TABLE public.payment_plan (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    monthly_rate NUMERIC(10, 2) NOT NULL,
    yearly_rate NUMERIC(10, 2),
    max_properties INT,
    max_tenants_per_property INT
);

-- ===== Properties =====
CREATE TABLE public.property_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE public.property (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_status_id INT NOT NULL REFERENCES public.property_status(id),
    lead_tenant_id INT REFERENCES public.tenant(id) ON DELETE SET NULL,
    number VARCHAR(10),
    name VARCHAR(50),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    postcode VARCHAR(20) NOT NULL
);

CREATE TABLE public.property_tenant (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    pays_rent BOOLEAN DEFAULT TRUE NOT NULL,
    rent_amount NUMERIC(10, 2),
    rent_due_date DATE,
    rent_schedule_type VARCHAR(30) DEFAULT 'monthly',
    rent_schedule_value SMALLINT,
    stripe_subscription_id VARCHAR(64),
    UNIQUE (property_id, tenant_id)
);

-- ===== Rent Payments =====
CREATE TABLE public.rent_payment (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    paid_on DATE NOT NULL,
    method VARCHAR(30),
    reference VARCHAR(100),
    stripe_payment_intent_id VARCHAR(64),
    stripe_subscription_id VARCHAR(64),
    due_date DATE
);

-- ===== Subscriptions =====
CREATE TABLE public.subscription (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    plan_id INT NOT NULL REFERENCES public.payment_plan(id),
    stripe_subscription_id VARCHAR(64),
    stripe_customer_id VARCHAR(64),
    status VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    billing_cycle_end TIMESTAMP,
    last_payment_date TIMESTAMP,
    next_payment_due TIMESTAMP,
    paused_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    canceled_at TIMESTAMP
);

-- ===== Tasks =====
CREATE TABLE public.task_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE public.task (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES public.property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    date_completed DATE,
    status_id INT REFERENCES public.task_status(id)
);

-- ===== Tenants =====
CREATE TABLE public.tenant (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    is_pending BOOLEAN DEFAULT TRUE,
    invite_token VARCHAR(255),
    stripe_customer_id VARCHAR(64),
    stripe_payment_method_id VARCHAR(64)
);

-- ===== Financial Budgets =====
CREATE TABLE public.financial (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES public.admin_account(id) ON DELETE CASCADE,
    budget_name VARCHAR(100) NOT NULL,
    budget_amount NUMERIC(10, 2) NOT NULL,
    budget_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ===== Productivity Tasks =====
CREATE TABLE public.productivity_task (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES public.admin_account(id) ON DELETE CASCADE,
    task_name VARCHAR(100) NOT NULL,
    importance VARCHAR(20) NOT NULL CHECK (importance IN ('Not Important', 'Important')),
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('Not Urgent', 'Urgent')),
    date_needed DATE NOT NULL,
    date_to_start DATE,
    progress VARCHAR(20) DEFAULT 'Not Started' CHECK (progress IN ('In Progress', 'Not Started', 'Completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.productivity_subtask (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES public.productivity_task(id) ON DELETE CASCADE,
    subtask_name VARCHAR(100) NOT NULL,
    description TEXT,
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('Not Urgent', 'Urgent')),
    importance VARCHAR(20) NOT NULL CHECK (importance IN ('Not Important', 'Important')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ===== Leads =====
CREATE TABLE public.lead (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES public.admin_account(id) ON DELETE CASCADE,
    lead_name VARCHAR(100) NOT NULL,
    contact_method VARCHAR(50),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    linkedin VARCHAR(255),
    facebook VARCHAR(255),
    contact_information TEXT,
    contacted BOOLEAN DEFAULT FALSE NOT NULL,
    responded BOOLEAN DEFAULT FALSE NOT NULL,
    follow_up BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

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

CREATE OR REPLACE VIEW public.v_tenant_info AS
SELECT
    a.id AS accountid,
    a.first_name AS firstname,
    a.last_name AS lastname,
    a.email,
    t.id AS tenantid,
    pt.property_id AS propertyid
FROM
    public.account a
JOIN
    public.tenant t ON a.id = t.account_id
JOIN
    public.property_tenant pt ON t.id = pt.tenant_id;

CREATE TABLE public.job (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES public.admin_account(id) ON DELETE CASCADE,
    job_name VARCHAR(100) NOT NULL,
    person_responsible VARCHAR(100),
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('Not Urgent', 'Urgent')),
    importance VARCHAR(20) NOT NULL CHECK (importance IN ('Not Important', 'Important')),
    date_to_be_completed DATE NOT NULL,
    additional_details TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Marketing', 'Software', 'Customer Service', 'Outreach', 'Finances', 'HR')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);