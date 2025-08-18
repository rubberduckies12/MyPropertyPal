--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: landlord_project_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO landlord_project_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.account (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES public.account_role(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL
);


ALTER TABLE public.account OWNER TO landlord_project_user;

--
-- Name: account_role; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.account_role (
    id SERIAL PRIMARY KEY,
    role VARCHAR(15) NOT NULL UNIQUE
);


ALTER TABLE public.account_role OWNER TO landlord_project_user;

--
-- Name: admin_account; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.admin_account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    pin_number CHAR(4) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE NOT NULL
);


ALTER TABLE public.admin_account OWNER TO landlord_project_user;

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by INT REFERENCES public.account(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    details TEXT
);


ALTER TABLE public.audit_log OWNER TO landlord_project_user;

--
-- Name: calendar_event; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.calendar_event OWNER TO landlord_project_user;

--
-- Name: calendar_event_status; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.calendar_event_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);


ALTER TABLE public.calendar_event_status OWNER TO landlord_project_user;

--
-- Name: chat; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.chat (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    recipient_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE
);


ALTER TABLE public.chat OWNER TO landlord_project_user;

--
-- Name: chat_message; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.chat_message (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES public.chat(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    incident_id INT REFERENCES public.incident(id) ON DELETE SET NULL,
    message_text VARCHAR(512) NOT NULL,
    sent_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chat_message OWNER TO landlord_project_user;

--
-- Name: chat_message_status; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.chat_message_status (
    id SERIAL PRIMARY KEY,
    chat_message_id INT NOT NULL REFERENCES public.chat_message(id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE NOT NULL
);


ALTER TABLE public.chat_message_status OWNER TO landlord_project_user;

--
-- Name: chat_tenant; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.chat_tenant (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES public.chat(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    UNIQUE (chat_id, tenant_id)
);


ALTER TABLE public.chat_tenant OWNER TO landlord_project_user;

--
-- Name: compliance_event; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.compliance_event (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    reminder_days INT[] DEFAULT ARRAY[90]
);


ALTER TABLE public.compliance_event OWNER TO landlord_project_user;

--
-- Name: compliance_reminder_sent; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.compliance_reminder_sent (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES public.compliance_event(id) ON DELETE CASCADE,
    reminder_days INT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (event_id, reminder_days)
);


ALTER TABLE public.compliance_reminder_sent OWNER TO landlord_project_user;

--
-- Name: document; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.document OWNER TO landlord_project_user;

--
-- Name: expense; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.expense OWNER TO landlord_project_user;

--
-- Name: financial; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.financial (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES public.admin_account(id) ON DELETE CASCADE,
    budget_name VARCHAR(100) NOT NULL,
    budget_amount NUMERIC(10, 2) NOT NULL,
    budget_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.financial OWNER TO landlord_project_user;

--
-- Name: incident; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.incident OWNER TO landlord_project_user;

--
-- Name: job; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.job OWNER TO landlord_project_user;

--
-- Name: landlord; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.landlord (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    payment_plan_id INT NOT NULL REFERENCES public.payment_plan(id) ON DELETE CASCADE,
    stripe_account_id VARCHAR(64)
);


ALTER TABLE public.landlord OWNER TO landlord_project_user;

--
-- Name: leads; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.leads (
    id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
    email VARCHAR(255) NOT NULL, -- Email address (not unique)
    first_name VARCHAR(50) NOT NULL, -- First name
    last_name VARCHAR(50) NOT NULL, -- Last name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL -- Timestamp of when the info was added
);


ALTER TABLE public.leads OWNER TO landlord_project_user;

--
-- Name: payment_plan; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.payment_plan (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2),
    frequency VARCHAR(10),
    max_properties INT,
    max_tenants_per_property INT,
    stripe_price_id VARCHAR(255)
);


ALTER TABLE public.payment_plan OWNER to landlord_project_user;

--
-- Name: property; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.property OWNER to landlord_project_user;

--
-- Name: property_tenant; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.property_tenant OWNER to landlord_project_user;

--
-- Name: rent_payment; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.rent_payment OWNER to landlord_project_user;

--
-- Name: subscription; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.subscription OWNER to landlord_project_user;

--
-- Name: task; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.task OWNER to landlord_project_user;

--
-- Name: tenant; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.tenant (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    is_pending BOOLEAN DEFAULT TRUE,
    invite_token VARCHAR(255),
    stripe_customer_id VARCHAR(64),
    stripe_payment_method_id VARCHAR(64)
);


ALTER TABLE public.tenant OWNER to landlord_project_user;

--
-- Name: financial; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.financial (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES public.admin_account(id) ON DELETE CASCADE,
    budget_name VARCHAR(100) NOT NULL,
    budget_amount NUMERIC(10, 2) NOT NULL,
    budget_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.financial OWNER to landlord_project_user;

--
-- Name: productivity_task; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.productivity_task OWNER to landlord_project_user;

--
-- Name: productivity_subtask; Type: TABLE; Schema: public; Owner: landlord_project_user
--

CREATE TABLE public.productivity_subtask (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES public.productivity_task(id) ON DELETE CASCADE,
    subtask_name VARCHAR(100) NOT NULL,
    description TEXT,
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('Not Urgent', 'Urgent')),
    importance VARCHAR(20) NOT NULL CHECK (importance IN ('Not Important', 'Important')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.productivity_subtask OWNER to landlord_project_user;

--
-- Name: lead; Type: TABLE; Schema: public; Owner: landlord_project_user
--

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


ALTER TABLE public.lead OWNER to landlord_project_user;

--
-- Name: v_property_info; Type: VIEW; Schema: public; Owner: landlord_project_user
--

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


ALTER VIEW public.v_property_info OWNER TO landlord_project_user;

--
-- Name: v_tenant_info; Type: VIEW; Schema: public; Owner: landlord_project_user
--

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


ALTER VIEW public.v_tenant_info OWNER TO landlord_project_user;

--
-- Name: account id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


--
-- Name: account_role id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.account_role ALTER COLUMN id SET DEFAULT nextval('public.account_role_id_seq'::regclass);


--
-- Name: admin_account id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.admin_account ALTER COLUMN id SET DEFAULT nextval('public.admin_account_id_seq'::regclass);


--
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- Name: calendar_event id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.calendar_event ALTER COLUMN id SET DEFAULT nextval('public.calendar_event_id_seq'::regclass);


--
-- Name: calendar_event_status id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.calendar_event_status ALTER COLUMN id SET DEFAULT nextval('public.calendar_event_status_id_seq'::regclass);


--
-- Name: chat id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat ALTER COLUMN id SET DEFAULT nextval('public.chat_id_seq'::regclass);


--
-- Name: chat_message id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message ALTER COLUMN id SET DEFAULT nextval('public.chat_message_id_seq'::regclass);


--
-- Name: chat_message_status id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message_status ALTER COLUMN id SET DEFAULT nextval('public.chat_message_status_id_seq'::regclass);


--
-- Name: chat_tenant id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_tenant ALTER COLUMN id SET DEFAULT nextval('public.chat_tenant_id_seq'::regclass);


--
-- Name: compliance_event id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.compliance_event ALTER COLUMN id SET DEFAULT nextval('public.compliance_event_id_seq'::regclass);


--
-- Name: compliance_reminder_sent id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.compliance_reminder_sent ALTER COLUMN id SET DEFAULT nextval('public.compliance_reminder_sent_id_seq'::regclass);


--
-- Name: document id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document ALTER COLUMN id SET DEFAULT nextval('public.document_id_seq'::regclass);


--
-- Name: document_type id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document_type ALTER COLUMN id SET DEFAULT nextval('public.document_type_id_seq'::regclass);


--
-- Name: expense id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.expense ALTER COLUMN id SET DEFAULT nextval('public.expense_id_seq'::regclass);


--
-- Name: financial id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.financial ALTER COLUMN id SET DEFAULT nextval('public.financial_id_seq'::regclass);


--
-- Name: incident id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.incident ALTER COLUMN id SET DEFAULT nextval('public.incident_id_seq'::regclass);


--
-- Name: incident_severity id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.incident_severity ALTER COLUMN id SET DEFAULT nextval('public.incident_severity_id_seq'::regclass);


--
-- Name: job id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.job ALTER COLUMN id SET DEFAULT nextval('public.job_id_seq'::regclass);


--
-- Name: landlord id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.landlord ALTER COLUMN id SET DEFAULT nextval('public.landlord_id_seq'::regclass);


--
-- Name: lead id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.lead ALTER COLUMN id SET DEFAULT nextval('public.lead_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: payment_plan id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.payment_plan ALTER COLUMN id SET DEFAULT nextval('public.payment_plan_id_seq'::regclass);


--
-- Name: productivity_subtask id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.productivity_subtask ALTER COLUMN id SET DEFAULT nextval('public.productivity_subtask_id_seq'::regclass);


--
-- Name: productivity_task id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.productivity_task ALTER COLUMN id SET DEFAULT nextval('public.productivity_task_id_seq'::regclass);


--
-- Name: property id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property ALTER COLUMN id SET DEFAULT nextval('public.property_id_seq'::regclass);


--
-- Name: property_status id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property_status ALTER COLUMN id SET DEFAULT nextval('public.property_status_id_seq'::regclass);


--
-- Name: property_tenant id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property_tenant ALTER COLUMN id SET DEFAULT nextval('public.property_tenant_id_seq'::regclass);


--
-- Name: rent_payment id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.rent_payment ALTER COLUMN id SET DEFAULT nextval('public.rent_payment_id_seq'::regclass);


--
-- Name: subscription id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.subscription ALTER COLUMN id SET DEFAULT nextval('public.subscription_id_seq'::regclass);


--
-- Name: task id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);


--
-- Name: task_status id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.task_status ALTER COLUMN id SET DEFAULT nextval('public.task_status_id_seq'::regclass);


--
-- Name: tenant id; Type: DEFAULT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.tenant ALTER COLUMN id SET DEFAULT nextval('public.tenant_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.account (id, role_id, first_name, last_name, password, email, email_verified) FROM stdin;
812741	1	Tony	Love	$2b$10$JqY2WkmOSgZ8zTyQ5aScluzWeYA/9cxhWP5une6qL/HcPTrbyP1jm	tlove@cuzons.com	f
808574	1	Matt	Britton	$2b$10$1x3tOBME5WmW/5wJhtqI9unZsXBiTfcdUlmgCxTT7.J8IYJH1vriK	Matton4@gmail.com	f
162195	1	tommy	rowe	$2b$10$sRqjc9KTRE27dr3gI4fl/exGVVF6DgSU4jSwmL8B.FmqKqr4iahui	tommy.rowe.dev@gmail.com	f
122787	1	Chris	Thomson	$2b$10$ctFreSwrLGCYMw/529FQWOxgFZPs83OWPLnHIcLNQKotikFfA7PTe	Christopher.thomson434@gmail.com	f
97	2	rowan	anstee	$2b$10$abtDQmVRoEP5OiHNeWw0RuXY6Z5PIEVQENw7W2.WneXXwb2m3VUQa	rowan@theanstees.co.uk	f
99	2	Stephen	Dillen	$2b$10$HFeEQqw4N4tcHKMDrozmT.dlZOPK1F8drMXUPMyouB0BwE7r6BRtq	kerrypoole@live.co.uk	f
\.


--
-- Data for Name: account_role; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.account_role (id, role) FROM stdin;
1	landlord
2	tenant
\.


--
-- Data for Name: admin_account; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.admin_account (id, email, password_hash, pin_number, first_name, last_name, created_at, is_approved) FROM stdin;
3	tommy.rowe@mypropertypal.com	$2b$10$LC0sqTTQust0FszwB1TlM.uBBftvgD/tpTs7mwjhCMQx.0a2IslOW	2602	tommy	rowe	2025-08-11 21:13:17.486906	t
4	christopher.thomson434@gmail.com	$2b$10$eVs3snw4fBR6xBjkjGNJteLNAPq6NH35eGdGK1vDPu9QQ9oyqBpf2	3296	chris	thomson	2025-08-12 16:05:49.961502	t
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.audit_log (id, table_name, record_id, action, changed_by, changed_at, details) FROM stdin;
\.


--
-- Data for Name: calendar_event; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.calendar_event (id, landlord_id, property_id, status_id, title, description, scheduled_at, duration, created_at) FROM stdin;
\.


--
-- Data for Name: calendar_event_status; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.calendar_event_status (id, status) FROM stdin;
1	Scheduled
2	Completed
3	Cancelled
\.


--
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.chat (id, sender_id, recipient_id) FROM stdin;
12	162195	97
\.


--
-- Data for Name: chat_message; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.chat_message (id, chat_id, sender_id, incident_id, message_text, sent_timestamp) FROM stdin;
52	12	162195	\N	heloo	2025-08-13 07:34:15.053804
\.


--
-- Data for Name: chat_message_status; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.chat_message_status (id, chat_message_id, account_id, is_read) FROM stdin;
55	52	97	t
\.


--
-- Data for Name: chat_tenant; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.chat_tenant (id, chat_id, tenant_id) FROM stdin;
\.


--
-- Data for Name: compliance_event; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.compliance_event (id, property_id, name, description, due_date, reminder_days) FROM stdin;
18	60	EPC	Elec Performance Certificate	2025-08-24	{90}
19	61	Gas Safety 	Certification	2026-03-11	{30}
\.


--
-- Data for Name: compliance_reminder_sent; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.compliance_reminder_sent (id, event_id, reminder_days, sent_at) FROM stdin;
\.


--
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.document (id, property_id, tenant_id, incident_id, document_type_id, document_path, uploaded_at) FROM stdin;
\.


--
-- Data for Name: document_type; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.document_type (id, type) FROM stdin;
1	Tenancy Agreement
2	Section 21 Notice
3	Gas Safety Certificate
4	Inventory Report
5	Inspection Report
\.


--
-- Data for Name: expense; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.expense (id, landlord_id, property_id, amount, category, description, incurred_on, document_id) FROM stdin;
44	40	60	1200.00	mortgage	monthly payments	2025-07-13	\N
45	40	60	1300.00	Mortgage	mP	2025-08-13	\N
\.


--
-- Data for Name: financial; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.financial (id, admin_id, budget_name, budget_amount, budget_description, created_at) FROM stdin;
\.


--
-- Data for Name: incident; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.incident (id, property_id, severity_id, title, description, created_at, closed, tenant_id, progress, updated_at) FROM stdin;
20	60	4	Broken Pipe	Pipe has burst and leaking	2025-08-13 13:00:00.558432	f	68	Not Started	\N
\.


--
-- Data for Name: incident_severity; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.incident_severity (id, severity) FROM stdin;
1	Low
2	Medium
3	High
4	Critical
\.


--
-- Data for Name: job; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.job (id, admin_id, job_name, person_responsible, urgency, importance, date_to_be_completed, additional_details, category, created_at) FROM stdin;
\.


--
-- Data for Name: landlord; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.landlord (id, account_id, payment_plan_id, stripe_account_id) FROM stdin;
38	812741	16	\N
39	808574	11	\N
40	162195	13	\N
41	122787	15	\N
\.


--
-- Data for Name: lead; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.lead (id, admin_id, lead_name, contact_method, phone_number, email, linkedin, facebook, contact_information, contacted, responded, follow_up, created_at) FROM stdin;
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.password_reset_tokens (id, user_id, token, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: payment_plan; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.payment_plan (id, name, description, max_properties, max_tenants_per_property, stripe_price_id, price, frequency) FROM stdin;
11	Basic	Basic plan with limited features	5	4	price_1RmJrgJCX1yAMZFQIEwLcvyP	30.00	monthly
12	Basic	Basic plan with limited features	5	4	price_1RmJsPJCX1yAMZFQEegTu9Rp	306.00	yearly
13	Pro	Pro plan with advanced features	10	8	price_1RmJtHJCX1yAMZFQh1bbTw8o	50.00	monthly
14	Pro	Pro plan with advanced features	10	8	price_1RmJtsJCX1yAMZFQFjVqCspY	510.00	yearly
15	Organisation	Organisation plan for large-scale landlords	\N	\N	price_1RmJuXJCX1yAMZFQaQ0hIyCj	250.00	monthly
16	Organisation	Organisation plan for large-scale landlords	\N	\N	price_1RmJupJCX1yAMZFQnXwDbBwr	2550.00	yearly
17	Test	Test plan with no limits	\N	\N	\N	0.00	monthly
\.


--
-- Data for Name: productivity_subtask; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.productivity_subtask (id, task_id, subtask_name, description, urgency, importance, created_at) FROM stdin;
\.


--
-- Data for Name: productivity_task; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.productivity_task (id, admin_id, task_name, importance, urgency, date_needed, date_to_start, progress, created_at) FROM stdin;
\.


--
-- Data for Name: property; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.property (id, landlord_id, property_status_id, lead_tenant_id, number, name, address, city, county, postcode) FROM stdin;
60	40	2	\N	\N	7	goldfinch lane	portsmouth	hampshire	po138ln
61	38	2	\N	\N	2	Bourne Rd	GRAVESEND	Kent	DA12 4EB
\.


--
-- Data for Name: property_status; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.property_status (id, status) FROM stdin;
1	Available
2	Occupied
3	Under Maintenance
4	Not Available
\.


--
-- Data for Name: property_tenant; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.property_tenant (id, property_id, tenant_id, pays_rent, rent_amount, rent_due_date, rent_schedule_type, rent_schedule_value, stripe_subscription_id) FROM stdin;
60	60	68	t	10000.00	2025-09-14	monthly	\N	\N
61	61	69	t	1150.00	2025-08-29	last_friday	\N	\N
\.


--
-- Data for Name: rent_payment; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.rent_payment (id, property_id, tenant_id, amount, paid_on, method, reference, stripe_payment_intent_id, stripe_subscription_id, due_date) FROM stdin;
63	60	68	10000.00	2025-08-14	BT	Transfered	\N	\N	2025-08-14
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.subscription (id, landlord_id, plan_id, stripe_subscription_id, stripe_customer_id, status, is_active, billing_cycle_end, last_payment_date, next_payment_due, paused_at, deleted_at, created_at, updated_at, canceled_at) FROM stdin;
39	38	17	\N	\N	active	t	\N	\N	\N	\N	\N	2025-08-12 19:53:07.378239	2025-08-12 19:53:07.378239	\N
40	39	17	\N	\N	active	t	\N	\N	\N	\N	\N	2025-08-12 20:01:49.494371	2025-08-12 20:01:49.494371	\N
41	40	17	\N	\N	active	t	\N	\N	\N	\N	\N	2025-08-13 06:12:59.605619	2025-08-13 06:12:59.605619	\N
42	41	17	\N	\N	active	t	\N	\N	\N	\N	\N	2025-08-13 06:14:04.616276	2025-08-13 06:14:04.616276	\N
\.


--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.task (id, property_id, name, description, due_date, date_completed, status_id) FROM stdin;
\.


--
-- Data for Name: task_status; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.task_status (id, status) FROM stdin;
1	Not Started
2	In Progress
3	Complete
\.


--
-- Data for Name: tenant; Type: TABLE DATA; Schema: public; Owner: landlord_project_user
--

COPY public.tenant (id, account_id, is_pending, invite_token, stripe_customer_id, stripe_payment_method_id) FROM stdin;
68	97	f	\N	\N	\N
69	99	t	11df4fc6fc78de0d9ae95660a8ccb21ae8360da68f4f7320a436d3c42f6b244e	\N	\N
\.


--
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.account_id_seq', 100, true);


--
-- Name: account_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.account_role_id_seq', 16, true);


--
-- Name: admin_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.admin_account_id_seq', 4, true);


--
-- Name: audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.audit_log_id_seq', 1, false);


--
-- Name: calendar_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.calendar_event_id_seq', 1, false);


--
-- Name: calendar_event_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.calendar_event_status_id_seq', 18, true);


--
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.chat_id_seq', 12, true);


--
-- Name: chat_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.chat_message_id_seq', 52, true);


--
-- Name: chat_message_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.chat_message_status_id_seq', 55, true);


--
-- Name: chat_tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.chat_tenant_id_seq', 1, false);


--
-- Name: compliance_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.compliance_event_id_seq', 19, true);


--
-- Name: compliance_reminder_sent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.compliance_reminder_sent_id_seq', 1, true);


--
-- Name: document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.document_id_seq', 1, false);


--
-- Name: document_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.document_type_id_seq', 30, true);


--
-- Name: expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.expense_id_seq', 45, true);


--
-- Name: financial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.financial_id_seq', 1, false);


--
-- Name: incident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.incident_id_seq', 20, true);


--
-- Name: incident_severity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.incident_severity_id_seq', 24, true);


--
-- Name: job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.job_id_seq', 1, false);


--
-- Name: landlord_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.landlord_id_seq', 45, true);


--
-- Name: lead_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.lead_id_seq', 1, false);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 5, true);


--
-- Name: payment_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.payment_plan_id_seq', 16, true);


--
-- Name: productivity_subtask_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.productivity_subtask_id_seq', 1, false);


--
-- Name: productivity_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.productivity_task_id_seq', 1, false);


--
-- Name: property_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.property_id_seq', 61, true);


--
-- Name: property_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.property_status_id_seq', 32, true);


--
-- Name: property_tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.property_tenant_id_seq', 61, true);


--
-- Name: rent_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.rent_payment_id_seq', 63, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.subscription_id_seq', 46, true);


--
-- Name: task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.task_id_seq', 1, false);


--
-- Name: task_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.task_status_id_seq', 9, true);


--
-- Name: tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: landlord_project_user
--

SELECT pg_catalog.setval('public.tenant_id_seq', 69, true);


--
-- Name: account account_email_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: account_role account_role_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.account_role
    ADD CONSTRAINT account_role_pkey PRIMARY KEY (id);


--
-- Name: account_role account_role_role_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.account_role
    ADD CONSTRAINT account_role_role_key UNIQUE (role);


--
-- Name: admin_account admin_account_email_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.admin_account
    ADD CONSTRAINT admin_account_email_key UNIQUE (email);


--
-- Name: admin_account admin_account_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.admin_account
    ADD CONSTRAINT admin_account_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: calendar_event calendar_event_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_pkey PRIMARY KEY (id);


--
-- Name: calendar_event_status calendar_event_status_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.calendar_event_status
    ADD CONSTRAINT calendar_event_status_pkey PRIMARY KEY (id);


--
-- Name: calendar_event_status calendar_event_status_status_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.calendar_event_status
    ADD CONSTRAINT calendar_event_status_status_key UNIQUE (status);


--
-- Name: chat_message chat_message_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_pkey PRIMARY KEY (id);


--
-- Name: chat_message_status chat_message_status_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message_status
    ADD CONSTRAINT chat_message_status_pkey PRIMARY KEY (id);


--
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- Name: chat_tenant chat_tenant_chat_id_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_tenant
    ADD CONSTRAINT chat_tenant_chat_id_tenant_id_key UNIQUE (chat_id, tenant_id);


--
-- Name: chat_tenant chat_tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_tenant
    ADD CONSTRAINT chat_tenant_pkey PRIMARY KEY (id);


--
-- Name: compliance_event compliance_event_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.compliance_event
    ADD CONSTRAINT compliance_event_pkey PRIMARY KEY (id);


--
-- Name: compliance_reminder_sent compliance_reminder_sent_event_id_reminder_days_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.compliance_reminder_sent
    ADD CONSTRAINT compliance_reminder_sent_event_id_reminder_days_key UNIQUE (event_id, reminder_days);


--
-- Name: compliance_reminder_sent compliance_reminder_sent_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.compliance_reminder_sent
    ADD CONSTRAINT compliance_reminder_sent_pkey PRIMARY KEY (id);


--
-- Name: document document_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


--
-- Name: document_type document_type_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT document_type_pkey PRIMARY KEY (id);


--
-- Name: document_type document_type_type_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT document_type_type_key UNIQUE (type);


--
-- Name: expense expense_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_pkey PRIMARY KEY (id);


--
-- Name: financial financial_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.financial
    ADD CONSTRAINT financial_pkey PRIMARY KEY (id);


--
-- Name: incident incident_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_pkey PRIMARY KEY (id);


--
-- Name: incident_severity incident_severity_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.incident_severity
    ADD CONSTRAINT incident_severity_pkey PRIMARY KEY (id);


--
-- Name: incident_severity incident_severity_severity_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.incident_severity
    ADD CONSTRAINT incident_severity_severity_key UNIQUE (severity);


--
-- Name: job job_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);


--
-- Name: landlord landlord_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.landlord
    ADD CONSTRAINT landlord_pkey PRIMARY KEY (id);


--
-- Name: lead lead_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.lead
    ADD CONSTRAINT lead_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: payment_plan payment_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.payment_plan
    ADD CONSTRAINT payment_plan_pkey PRIMARY KEY (id);


--
-- Name: productivity_subtask productivity_subtask_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.productivity_subtask
    ADD CONSTRAINT productivity_subtask_pkey PRIMARY KEY (id);


--
-- Name: productivity_task productivity_task_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.productivity_task
    ADD CONSTRAINT productivity_task_pkey PRIMARY KEY (id);


--
-- Name: property property_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_pkey PRIMARY KEY (id);


--
-- Name: property_status property_status_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property_status
    ADD CONSTRAINT property_status_pkey PRIMARY KEY (id);


--
-- Name: property_status property_status_status_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property_status
    ADD CONSTRAINT property_status_status_key UNIQUE (status);


--
-- Name: property_tenant property_tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property_tenant
    ADD CONSTRAINT property_tenant_pkey PRIMARY KEY (id);


--
-- Name: property_tenant property_tenant_property_id_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property_tenant
    ADD CONSTRAINT property_tenant_property_id_tenant_id_key UNIQUE (property_id, tenant_id);


--
-- Name: rent_payment rent_payment_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.rent_payment
    ADD CONSTRAINT rent_payment_pkey PRIMARY KEY (id);


--
-- Name: subscription subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT subscription_pkey PRIMARY KEY (id);


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- Name: task_status task_status_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.task_status
    ADD CONSTRAINT task_status_pkey PRIMARY KEY (id);


--
-- Name: task_status task_status_status_key; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.task_status
    ADD CONSTRAINT task_status_status_key UNIQUE (status);


--
-- Name: tenant tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_pkey PRIMARY KEY (id);


--
-- Name: subscription unique_landlord_id; Type: CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT unique_landlord_id UNIQUE (landlord_id);


--
-- Name: account account_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.account_role(id);


--
-- Name: audit_log audit_log_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.account(id);


--
-- Name: calendar_event calendar_event_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.landlord(id) ON DELETE CASCADE;


--
-- Name: calendar_event calendar_event_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: calendar_event calendar_event_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.calendar_event_status(id) ON DELETE CASCADE;


--
-- Name: chat_message chat_message_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(id) ON DELETE CASCADE;


--
-- Name: chat_message chat_message_incident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_incident_id_fkey FOREIGN KEY (incident_id) REFERENCES public.incident(id) ON DELETE SET NULL;


--
-- Name: chat_message chat_message_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: chat_message_status chat_message_status_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message_status
    ADD CONSTRAINT chat_message_status_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: chat_message_status chat_message_status_chat_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_message_status
    ADD CONSTRAINT chat_message_status_chat_message_id_fkey FOREIGN KEY (chat_message_id) REFERENCES public.chat_message(id) ON DELETE CASCADE;


--
-- Name: chat chat_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: chat chat_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: chat_tenant chat_tenant_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_tenant
    ADD CONSTRAINT chat_tenant_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(id) ON DELETE CASCADE;


--
-- Name: chat_tenant chat_tenant_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.chat_tenant
    ADD CONSTRAINT chat_tenant_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: compliance_event compliance_event_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.compliance_event
    ADD CONSTRAINT compliance_event_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: compliance_reminder_sent compliance_reminder_sent_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.compliance_reminder_sent
    ADD CONSTRAINT compliance_reminder_sent_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.compliance_event(id) ON DELETE CASCADE;


--
-- Name: document document_document_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_type(id) ON DELETE CASCADE;


--
-- Name: document document_incident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_incident_id_fkey FOREIGN KEY (incident_id) REFERENCES public.incident(id) ON DELETE SET NULL;


--
-- Name: document document_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: document document_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: expense expense_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.document(id) ON DELETE SET NULL;


--
-- Name: expense expense_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.landlord(id) ON DELETE CASCADE;


--
-- Name: expense expense_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: financial financial_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.financial
    ADD CONSTRAINT financial_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin_account(id) ON DELETE CASCADE;


--
-- Name: incident incident_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: incident incident_severity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_severity_id_fkey FOREIGN KEY (severity_id) REFERENCES public.incident_severity(id) ON DELETE CASCADE;


--
-- Name: incident incident_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE SET NULL;


--
-- Name: job job_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin_account(id) ON DELETE CASCADE;


--
-- Name: landlord landlord_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.landlord
    ADD CONSTRAINT landlord_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: landlord landlord_payment_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.landlord
    ADD CONSTRAINT landlord_payment_plan_id_fkey FOREIGN KEY (payment_plan_id) REFERENCES public.payment_plan(id) ON DELETE CASCADE;


--
-- Name: lead lead_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.lead
    ADD CONSTRAINT lead_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin_account(id) ON DELETE CASCADE;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: productivity_subtask productivity_subtask_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.productivity_subtask
    ADD CONSTRAINT productivity_subtask_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.productivity_task(id) ON DELETE CASCADE;


--
-- Name: productivity_task productivity_task_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.productivity_task
    ADD CONSTRAINT productivity_task_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin_account(id) ON DELETE CASCADE;


--
-- Name: property property_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.landlord(id) ON DELETE CASCADE;


--
-- Name: property property_lead_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_lead_tenant_id_fkey FOREIGN KEY (lead_tenant_id) REFERENCES public.tenant(id) ON DELETE SET NULL;


--
-- Name: property property_property_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_property_status_id_fkey FOREIGN KEY (property_status_id) REFERENCES public.property_status(id);


--
-- Name: property_tenant property_tenant_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property_tenant
    ADD CONSTRAINT property_tenant_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: property_tenant property_tenant_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.property_tenant
    ADD CONSTRAINT property_tenant_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: rent_payment rent_payment_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.rent_payment
    ADD CONSTRAINT rent_payment_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: rent_payment rent_payment_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.rent_payment
    ADD CONSTRAINT rent_payment_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: subscription subscription_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT subscription_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.landlord(id) ON DELETE CASCADE;


--
-- Name: subscription subscription_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT subscription_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.payment_plan(id) ON DELETE CASCADE;


--
-- Name: task task_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: task task_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.task_status(id);


--
-- Name: tenant tenant_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: landlord_project_user
--

ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: landlord_project_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO landlord_project_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO landlord_project_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO landlord_project_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO landlord_project_user;


--
-- PostgreSQL database dump complete
--

