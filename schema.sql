--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.account (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES public.account_role(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE
);


--
-- Name: account_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.account_role (
    id SERIAL PRIMARY KEY,
    role VARCHAR(15) NOT NULL UNIQUE
);


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by INT REFERENCES public.account(id),
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);


--
-- Name: calendar_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.calendar_event (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    status_id INT NOT NULL REFERENCES public.calendar_event_status(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: calendar_event_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.calendar_event_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);


--
-- Name: chat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.chat (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE
);


--
-- Name: chat_message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.chat_message (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES public.chat(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    incident_id INT REFERENCES public.incident(id) ON DELETE SET NULL,
    message_text VARCHAR(512) NOT NULL,
    sent_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: chat_message_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.chat_message_status (
    id SERIAL PRIMARY KEY,
    chat_message_id INT NOT NULL REFERENCES public.chat_message(id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE
);


--
-- Name: chat_tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.chat_tenant (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES public.chat(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    UNIQUE (chat_id, tenant_id)
);


--
-- Name: compliance_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.compliance_event (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    reminder_days INT[] DEFAULT ARRAY[90]
);


--
-- Name: compliance_reminder_sent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.compliance_reminder_sent (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES public.compliance_event(id) ON DELETE CASCADE,
    reminder_days INT NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (event_id, reminder_days)
);


--
-- Name: document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.document (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    tenant_id INT NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    incident_id INT REFERENCES public.incident(id) ON DELETE SET NULL,
    document_type_id INT NOT NULL REFERENCES public.document_type(id) ON DELETE CASCADE,
    document_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: document_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.document_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE
);


--
-- Name: expense; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.expense (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_id INT REFERENCES public.property(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    incurred_on DATE NOT NULL,
    document_id INT REFERENCES public.document(id) ON DELETE SET NULL
);


--
-- Name: incident; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.incident (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    severity_id INT NOT NULL REFERENCES public.incident_severity(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed BOOLEAN NOT NULL DEFAULT FALSE
);


--
-- Name: incident_severity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.incident_severity (
    id SERIAL PRIMARY KEY,
    severity VARCHAR(20) NOT NULL UNIQUE
);


--
-- Name: property; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.property (
    id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_status_id INT NOT NULL REFERENCES public.property_status(id),
    lead_tenant_id INT NULL REFERENCES public.tenant(id) ON DELETE SET NULL,
    number VARCHAR(10),
    name VARCHAR(50),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    postcode VARCHAR(20) NOT NULL
);


--
-- Name: property_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.property_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);


--
-- Name: task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.task (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES public.property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    date_completed DATE,
    status_id INT REFERENCES public.task_status(id)
);


--
-- Name: task_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.task_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);


--
-- Name: v_property_info; Type: VIEW; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.v_property_info AS
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
    public.property p
JOIN
    public.property_status ps ON p.property_status_id = ps.id;


--
-- Name: v_tenant_info; Type: VIEW; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.v_tenant_info AS 
SELECT
    a.id AS accountId,
    a.first_name AS firstName,
    a.last_name AS lastName,
    a.email AS email,
    t.id AS tenantId,
    pt.property_id AS propertyId
FROM
    public.account a
JOIN
    public.tenant t ON a.id = t.account_id
JOIN
    public.property_tenant pt ON t.id = pt.tenant_id;


--
-- PostgreSQL database dump complete
--

