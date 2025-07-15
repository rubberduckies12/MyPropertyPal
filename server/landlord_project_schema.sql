-- SCHEMA: public

-- TABLE: account
CREATE TABLE public.account (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES public.account_role(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT false
);

-- TABLE: account_role
CREATE TABLE public.account_role (
    id SERIAL PRIMARY KEY,
    role VARCHAR(15) NOT NULL UNIQUE
);

-- TABLE: audit_log
CREATE TABLE public.audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by INTEGER REFERENCES public.account(id),
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- TABLE: calendar_event_status
CREATE TABLE public.calendar_event_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

-- TABLE: calendar_event
CREATE TABLE public.calendar_event (
    id SERIAL PRIMARY KEY,
    landlord_id INTEGER NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_id INTEGER NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    status_id INTEGER NOT NULL REFERENCES public.calendar_event_status(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: chat
CREATE TABLE public.chat (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.property(id) ON DELETE CASCADE
);

-- TABLE: chat_message
CREATE TABLE public.chat_message (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL REFERENCES public.chat(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    incident_id INTEGER REFERENCES public.incident(id) ON DELETE SET NULL,
    message_text VARCHAR(512) NOT NULL,
    sent_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: chat_message_status
CREATE TABLE public.chat_message_status (
    id SERIAL PRIMARY KEY,
    chat_message_id INTEGER NOT NULL REFERENCES public.chat_message(id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT false
);

-- TABLE: chat_tenant
CREATE TABLE public.chat_tenant (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL REFERENCES public.chat(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    UNIQUE (chat_id, tenant_id)
);

-- TABLE: compliance_event
CREATE TABLE public.compliance_event (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    reminder_days INTEGER[] DEFAULT ARRAY[90]
);

-- TABLE: compliance_reminder_sent
CREATE TABLE public.compliance_reminder_sent (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES public.compliance_event(id) ON DELETE CASCADE,
    reminder_days INTEGER NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (event_id, reminder_days)
);

-- TABLE: document_type
CREATE TABLE public.document_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE
);

-- TABLE: document
CREATE TABLE public.document (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    incident_id INTEGER REFERENCES public.incident(id) ON DELETE SET NULL,
    document_type_id INTEGER NOT NULL REFERENCES public.document_type(id) ON DELETE CASCADE,
    document_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: expense
CREATE TABLE public.expense (
    id SERIAL PRIMARY KEY,
    landlord_id INTEGER NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES public.property(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    incurred_on DATE NOT NULL,
    document_id INTEGER REFERENCES public.document(id) ON DELETE SET NULL
);

-- TABLE: incident_severity
CREATE TABLE public.incident_severity (
    id SERIAL PRIMARY KEY,
    severity VARCHAR(20) NOT NULL UNIQUE
);

-- TABLE: incident
CREATE TABLE public.incident (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    severity_id INTEGER NOT NULL REFERENCES public.incident_severity(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed BOOLEAN NOT NULL DEFAULT false,
    tenant_id INTEGER REFERENCES public.tenant(id) ON DELETE SET NULL,
    progress VARCHAR(20) NOT NULL DEFAULT 'Not Started',
    updated_at TIMESTAMP
);

-- TABLE: landlord
CREATE TABLE public.landlord (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    payment_plan_id INTEGER NOT NULL REFERENCES public.payment_plan(id) ON DELETE CASCADE,
    stripe_account_id VARCHAR(64)
);

-- TABLE: payment_plan
CREATE TABLE public.payment_plan (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    monthly_rate NUMERIC(10,2) NOT NULL
);

-- TABLE: property_status
CREATE TABLE public.property_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

-- TABLE: property
CREATE TABLE public.property (
    id SERIAL PRIMARY KEY,
    landlord_id INTEGER NOT NULL REFERENCES public.landlord(id) ON DELETE CASCADE,
    property_status_id INTEGER NOT NULL REFERENCES public.property_status(id),
    lead_tenant_id INTEGER REFERENCES public.tenant(id) ON DELETE SET NULL,
    number VARCHAR(10),
    name VARCHAR(50),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    postcode VARCHAR(20) NOT NULL
);

-- TABLE: property_tenant
CREATE TABLE public.property_tenant (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    pays_rent BOOLEAN NOT NULL DEFAULT true,
    rent_amount NUMERIC(10,2),
    rent_due_date DATE,
    rent_schedule_type VARCHAR(30) DEFAULT 'monthly',
    rent_schedule_value SMALLINT,
    stripe_subscription_id VARCHAR(64),
    UNIQUE (property_id, tenant_id)
);

-- TABLE: rent_payment
CREATE TABLE public.rent_payment (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES public.tenant(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    paid_on DATE NOT NULL,
    method VARCHAR(30),
    reference VARCHAR(100),
    stripe_payment_intent_id VARCHAR(64),
    stripe_subscription_id VARCHAR(64)
);

-- TABLE: task_status
CREATE TABLE public.task_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

-- TABLE: task
CREATE TABLE public.task (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES public.property(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    date_completed DATE,
    status_id INTEGER REFERENCES public.task_status(id)
);

-- TABLE: tenant
CREATE TABLE public.tenant (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    is_pending BOOLEAN DEFAULT true,
    invite_token VARCHAR(255),
    stripe_customer_id VARCHAR(64),
    stripe_payment_method_id VARCHAR(64)
);

-- VIEW: v_property_info
CREATE VIEW public.v_property_info AS
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
FROM public.property p
JOIN public.property_status ps ON p.property_status_id = ps.id;

-- VIEW: v_tenant_info
CREATE VIEW public.v_tenant_info AS
SELECT
    a.id AS accountid,
    a.first_name AS firstname,
    a.last_name AS lastname,
    a.email,
    t.id AS tenantid,
    pt.property_id AS propertyid
FROM public.account a
JOIN public.tenant t ON a.id = t.account_id
JOIN public.property_tenant pt ON t.id = pt.tenant_id;

ALTER TABLE public.chat_message OWNER TO tommyrowe;

--
-- Name: chat_message_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.chat_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_message_id_seq OWNER TO tommyrowe;

--
-- Name: chat_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.chat_message_id_seq OWNED BY public.chat_message.id;


--
-- Name: chat_message_status; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.chat_message_status (
    id integer NOT NULL,
    chat_message_id integer NOT NULL,
    account_id integer NOT NULL,
    is_read boolean DEFAULT false NOT NULL
);


ALTER TABLE public.chat_message_status OWNER TO tommyrowe;

--
-- Name: chat_message_status_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.chat_message_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_message_status_id_seq OWNER TO tommyrowe;

--
-- Name: chat_message_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.chat_message_status_id_seq OWNED BY public.chat_message_status.id;


--
-- Name: chat_tenant; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.chat_tenant (
    id integer NOT NULL,
    chat_id integer NOT NULL,
    tenant_id integer NOT NULL
);


ALTER TABLE public.chat_tenant OWNER TO tommyrowe;

--
-- Name: chat_tenant_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.chat_tenant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_tenant_id_seq OWNER TO tommyrowe;

--
-- Name: chat_tenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.chat_tenant_id_seq OWNED BY public.chat_tenant.id;


--
-- Name: compliance_event; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.compliance_event (
    id integer NOT NULL,
    property_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    due_date date NOT NULL,
    reminder_days integer[] DEFAULT ARRAY[90]
);


ALTER TABLE public.compliance_event OWNER TO tommyrowe;

--
-- Name: compliance_event_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.compliance_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compliance_event_id_seq OWNER TO tommyrowe;

--
-- Name: compliance_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.compliance_event_id_seq OWNED BY public.compliance_event.id;


--
-- Name: compliance_reminder_sent; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.compliance_reminder_sent (
    id integer NOT NULL,
    event_id integer NOT NULL,
    reminder_days integer NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.compliance_reminder_sent OWNER TO tommyrowe;

--
-- Name: compliance_reminder_sent_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.compliance_reminder_sent_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compliance_reminder_sent_id_seq OWNER TO tommyrowe;

--
-- Name: compliance_reminder_sent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.compliance_reminder_sent_id_seq OWNED BY public.compliance_reminder_sent.id;


--
-- Name: document; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.document (
    id integer NOT NULL,
    property_id integer NOT NULL,
    tenant_id integer NOT NULL,
    incident_id integer,
    document_type_id integer NOT NULL,
    document_path character varying(255) NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.document OWNER TO tommyrowe;

--
-- Name: document_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.document_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_id_seq OWNER TO tommyrowe;

--
-- Name: document_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.document_id_seq OWNED BY public.document.id;


--
-- Name: document_type; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.document_type (
    id integer NOT NULL,
    type character varying(50) NOT NULL
);


ALTER TABLE public.document_type OWNER TO tommyrowe;

--
-- Name: document_type_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.document_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_type_id_seq OWNER TO tommyrowe;

--
-- Name: document_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.document_type_id_seq OWNED BY public.document_type.id;


--
-- Name: expense; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.expense (
    id integer NOT NULL,
    landlord_id integer NOT NULL,
    property_id integer,
    amount numeric(10,2) NOT NULL,
    category character varying(50) NOT NULL,
    description text,
    incurred_on date NOT NULL,
    document_id integer
);


ALTER TABLE public.expense OWNER TO tommyrowe;

--
-- Name: expense_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expense_id_seq OWNER TO tommyrowe;

--
-- Name: expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.expense_id_seq OWNED BY public.expense.id;


--
-- Name: incident; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.incident (
    id integer NOT NULL,
    property_id integer NOT NULL,
    severity_id integer NOT NULL,
    title character varying(50) NOT NULL,
    description character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closed boolean DEFAULT false NOT NULL,
    tenant_id integer,
    progress character varying(20) DEFAULT 'Not Started'::character varying NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.incident OWNER TO tommyrowe;

--
-- Name: incident_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.incident_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incident_id_seq OWNER TO tommyrowe;

--
-- Name: incident_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.incident_id_seq OWNED BY public.incident.id;


--
-- Name: incident_severity; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.incident_severity (
    id integer NOT NULL,
    severity character varying(20) NOT NULL
);


ALTER TABLE public.incident_severity OWNER TO tommyrowe;

--
-- Name: incident_severity_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.incident_severity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incident_severity_id_seq OWNER TO tommyrowe;

--
-- Name: incident_severity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.incident_severity_id_seq OWNED BY public.incident_severity.id;


--
-- Name: landlord; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.landlord (
    id integer NOT NULL,
    account_id integer NOT NULL,
    payment_plan_id integer NOT NULL,
    stripe_account_id character varying(64)
);


ALTER TABLE public.landlord OWNER TO tommyrowe;

--
-- Name: landlord_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.landlord_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.landlord_id_seq OWNER TO tommyrowe;

--
-- Name: landlord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.landlord_id_seq OWNED BY public.landlord.id;


--
-- Name: payment_plan; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.payment_plan (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text NOT NULL,
    monthly_rate numeric(10,2) NOT NULL
);


ALTER TABLE public.payment_plan OWNER TO tommyrowe;

--
-- Name: payment_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.payment_plan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_plan_id_seq OWNER TO tommyrowe;

--
-- Name: payment_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.payment_plan_id_seq OWNED BY public.payment_plan.id;


--
-- Name: property; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.property (
    id integer NOT NULL,
    landlord_id integer NOT NULL,
    property_status_id integer NOT NULL,
    lead_tenant_id integer,
    number character varying(10),
    name character varying(50),
    address character varying(255) NOT NULL,
    city character varying(50) NOT NULL,
    county character varying(50) NOT NULL,
    postcode character varying(20) NOT NULL
);


ALTER TABLE public.property OWNER TO tommyrowe;

--
-- Name: property_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.property_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_id_seq OWNER TO tommyrowe;

--
-- Name: property_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.property_id_seq OWNED BY public.property.id;


--
-- Name: property_status; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.property_status (
    id integer NOT NULL,
    status character varying(20) NOT NULL
);


ALTER TABLE public.property_status OWNER TO tommyrowe;

--
-- Name: property_status_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.property_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_status_id_seq OWNER TO tommyrowe;

--
-- Name: property_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.property_status_id_seq OWNED BY public.property_status.id;


--
-- Name: property_tenant; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.property_tenant (
    id integer NOT NULL,
    property_id integer NOT NULL,
    tenant_id integer NOT NULL,
    pays_rent boolean DEFAULT true NOT NULL,
    rent_amount numeric(10,2),
    rent_due_date date,
    rent_schedule_type character varying(30) DEFAULT 'monthly'::character varying,
    rent_schedule_value smallint,
    stripe_subscription_id character varying(64)
);


ALTER TABLE public.property_tenant OWNER TO tommyrowe;

--
-- Name: property_tenant_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.property_tenant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_tenant_id_seq OWNER TO tommyrowe;

--
-- Name: property_tenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.property_tenant_id_seq OWNED BY public.property_tenant.id;


--
-- Name: rent_payment; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.rent_payment (
    id integer NOT NULL,
    property_id integer NOT NULL,
    tenant_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    paid_on date NOT NULL,
    method character varying(30),
    reference character varying(100),
    stripe_payment_intent_id character varying(64),
    stripe_subscription_id character varying(64)
);


ALTER TABLE public.rent_payment OWNER TO tommyrowe;

--
-- Name: rent_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.rent_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rent_payment_id_seq OWNER TO tommyrowe;

--
-- Name: rent_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.rent_payment_id_seq OWNED BY public.rent_payment.id;


--
-- Name: task; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.task (
    id integer NOT NULL,
    property_id integer,
    name character varying(100) NOT NULL,
    description text,
    due_date date,
    date_completed date,
    status_id integer
);


ALTER TABLE public.task OWNER TO tommyrowe;

--
-- Name: task_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_id_seq OWNER TO tommyrowe;

--
-- Name: task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.task_id_seq OWNED BY public.task.id;


--
-- Name: task_status; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.task_status (
    id integer NOT NULL,
    status character varying(20) NOT NULL
);


ALTER TABLE public.task_status OWNER TO tommyrowe;

--
-- Name: task_status_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.task_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_status_id_seq OWNER TO tommyrowe;

--
-- Name: task_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.task_status_id_seq OWNED BY public.task_status.id;


--
-- Name: tenant; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.tenant (
    id integer NOT NULL,
    account_id integer NOT NULL,
    is_pending boolean DEFAULT true,
    invite_token character varying(255),
    stripe_customer_id character varying(64),
    stripe_payment_method_id character varying(64)
);


ALTER TABLE public.tenant OWNER TO tommyrowe;

--
-- Name: tenant_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.tenant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenant_id_seq OWNER TO tommyrowe;

--
-- Name: tenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.tenant_id_seq OWNED BY public.tenant.id;


--
-- Name: v_property_info; Type: VIEW; Schema: public; Owner: tommyrowe
--

CREATE VIEW public.v_property_info AS
 SELECT p.id AS propertyid,
    p.name AS propertyname,
    p.number AS propertynumber,
    p.address AS propertyaddress,
    p.city AS propertycity,
    p.county AS propertycounty,
    p.postcode AS propertypostcode,
    p.landlord_id AS landlordid,
    ps.status AS propertystatus
   FROM (public.property p
     JOIN public.property_status ps ON ((p.property_status_id = ps.id)));


ALTER VIEW public.v_property_info OWNER TO tommyrowe;

--
-- Name: v_tenant_info; Type: VIEW; Schema: public; Owner: tommyrowe
--

CREATE VIEW public.v_tenant_info AS
 SELECT a.id AS accountid,
    a.first_name AS firstname,
    a.last_name AS lastname,
    a.email,
    t.id AS tenantid,
    pt.property_id AS propertyid
   FROM ((public.account a
     JOIN public.tenant t ON ((a.id = t.account_id)))
     JOIN public.property_tenant pt ON ((t.id = pt.tenant_id)));


ALTER VIEW public.v_tenant_info OWNER TO tommyrowe;

--
-- Name: account id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


--
-- Name: account_role id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.account_role ALTER COLUMN id SET DEFAULT nextval('public.account_role_id_seq'::regclass);


--
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- Name: calendar_event id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.calendar_event ALTER COLUMN id SET DEFAULT nextval('public.calendar_event_id_seq'::regclass);


--
-- Name: calendar_event_status id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.calendar_event_status ALTER COLUMN id SET DEFAULT nextval('public.calendar_event_status_id_seq'::regclass);


--
-- Name: chat id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat ALTER COLUMN id SET DEFAULT nextval('public.chat_id_seq'::regclass);


--
-- Name: chat_message id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message ALTER COLUMN id SET DEFAULT nextval('public.chat_message_id_seq'::regclass);


--
-- Name: chat_message_status id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message_status ALTER COLUMN id SET DEFAULT nextval('public.chat_message_status_id_seq'::regclass);


--
-- Name: chat_tenant id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_tenant ALTER COLUMN id SET DEFAULT nextval('public.chat_tenant_id_seq'::regclass);


--
-- Name: compliance_event id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.compliance_event ALTER COLUMN id SET DEFAULT nextval('public.compliance_event_id_seq'::regclass);


--
-- Name: compliance_reminder_sent id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.compliance_reminder_sent ALTER COLUMN id SET DEFAULT nextval('public.compliance_reminder_sent_id_seq'::regclass);


--
-- Name: document id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document ALTER COLUMN id SET DEFAULT nextval('public.document_id_seq'::regclass);


--
-- Name: document_type id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document_type ALTER COLUMN id SET DEFAULT nextval('public.document_type_id_seq'::regclass);


--
-- Name: expense id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.expense ALTER COLUMN id SET DEFAULT nextval('public.expense_id_seq'::regclass);


--
-- Name: incident id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.incident ALTER COLUMN id SET DEFAULT nextval('public.incident_id_seq'::regclass);


--
-- Name: incident_severity id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.incident_severity ALTER COLUMN id SET DEFAULT nextval('public.incident_severity_id_seq'::regclass);


--
-- Name: landlord id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.landlord ALTER COLUMN id SET DEFAULT nextval('public.landlord_id_seq'::regclass);


--
-- Name: payment_plan id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.payment_plan ALTER COLUMN id SET DEFAULT nextval('public.payment_plan_id_seq'::regclass);


--
-- Name: property id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property ALTER COLUMN id SET DEFAULT nextval('public.property_id_seq'::regclass);


--
-- Name: property_status id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property_status ALTER COLUMN id SET DEFAULT nextval('public.property_status_id_seq'::regclass);


--
-- Name: property_tenant id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property_tenant ALTER COLUMN id SET DEFAULT nextval('public.property_tenant_id_seq'::regclass);


--
-- Name: rent_payment id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.rent_payment ALTER COLUMN id SET DEFAULT nextval('public.rent_payment_id_seq'::regclass);


--
-- Name: task id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);


--
-- Name: task_status id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.task_status ALTER COLUMN id SET DEFAULT nextval('public.task_status_id_seq'::regclass);


--
-- Name: tenant id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.tenant ALTER COLUMN id SET DEFAULT nextval('public.tenant_id_seq'::regclass);


--
-- Name: account account_email_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: account_role account_role_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.account_role
    ADD CONSTRAINT account_role_pkey PRIMARY KEY (id);


--
-- Name: account_role account_role_role_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.account_role
    ADD CONSTRAINT account_role_role_key UNIQUE (role);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: calendar_event calendar_event_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_pkey PRIMARY KEY (id);


--
-- Name: calendar_event_status calendar_event_status_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.calendar_event_status
    ADD CONSTRAINT calendar_event_status_pkey PRIMARY KEY (id);


--
-- Name: calendar_event_status calendar_event_status_status_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.calendar_event_status
    ADD CONSTRAINT calendar_event_status_status_key UNIQUE (status);


--
-- Name: chat_message chat_message_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_pkey PRIMARY KEY (id);


--
-- Name: chat_message_status chat_message_status_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message_status
    ADD CONSTRAINT chat_message_status_pkey PRIMARY KEY (id);


--
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- Name: chat_tenant chat_tenant_chat_id_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_tenant
    ADD CONSTRAINT chat_tenant_chat_id_tenant_id_key UNIQUE (chat_id, tenant_id);


--
-- Name: chat_tenant chat_tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_tenant
    ADD CONSTRAINT chat_tenant_pkey PRIMARY KEY (id);


--
-- Name: compliance_event compliance_event_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.compliance_event
    ADD CONSTRAINT compliance_event_pkey PRIMARY KEY (id);


--
-- Name: compliance_reminder_sent compliance_reminder_sent_event_id_reminder_days_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.compliance_reminder_sent
    ADD CONSTRAINT compliance_reminder_sent_event_id_reminder_days_key UNIQUE (event_id, reminder_days);


--
-- Name: compliance_reminder_sent compliance_reminder_sent_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.compliance_reminder_sent
    ADD CONSTRAINT compliance_reminder_sent_pkey PRIMARY KEY (id);


--
-- Name: document document_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


--
-- Name: document_type document_type_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT document_type_pkey PRIMARY KEY (id);


--
-- Name: document_type document_type_type_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT document_type_type_key UNIQUE (type);


--
-- Name: expense expense_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_pkey PRIMARY KEY (id);


--
-- Name: incident incident_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_pkey PRIMARY KEY (id);


--
-- Name: incident_severity incident_severity_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.incident_severity
    ADD CONSTRAINT incident_severity_pkey PRIMARY KEY (id);


--
-- Name: incident_severity incident_severity_severity_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.incident_severity
    ADD CONSTRAINT incident_severity_severity_key UNIQUE (severity);


--
-- Name: landlord landlord_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.landlord
    ADD CONSTRAINT landlord_pkey PRIMARY KEY (id);


--
-- Name: payment_plan payment_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.payment_plan
    ADD CONSTRAINT payment_plan_pkey PRIMARY KEY (id);


--
-- Name: property property_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_pkey PRIMARY KEY (id);


--
-- Name: property_status property_status_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property_status
    ADD CONSTRAINT property_status_pkey PRIMARY KEY (id);


--
-- Name: property_status property_status_status_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property_status
    ADD CONSTRAINT property_status_status_key UNIQUE (status);


--
-- Name: property_tenant property_tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property_tenant
    ADD CONSTRAINT property_tenant_pkey PRIMARY KEY (id);


--
-- Name: property_tenant property_tenant_property_id_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property_tenant
    ADD CONSTRAINT property_tenant_property_id_tenant_id_key UNIQUE (property_id, tenant_id);


--
-- Name: rent_payment rent_payment_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.rent_payment
    ADD CONSTRAINT rent_payment_pkey PRIMARY KEY (id);


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- Name: task_status task_status_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.task_status
    ADD CONSTRAINT task_status_pkey PRIMARY KEY (id);


--
-- Name: task_status task_status_status_key; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.task_status
    ADD CONSTRAINT task_status_status_key UNIQUE (status);


--
-- Name: tenant tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_pkey PRIMARY KEY (id);


--
-- Name: account account_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.account_role(id);


--
-- Name: audit_log audit_log_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.account(id);


--
-- Name: calendar_event calendar_event_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.landlord(id) ON DELETE CASCADE;


--
-- Name: calendar_event calendar_event_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: calendar_event calendar_event_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.calendar_event_status(id) ON DELETE CASCADE;


--
-- Name: chat_message chat_message_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(id) ON DELETE CASCADE;


--
-- Name: chat_message chat_message_incident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_incident_id_fkey FOREIGN KEY (incident_id) REFERENCES public.incident(id) ON DELETE SET NULL;


--
-- Name: chat_message chat_message_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: chat_message_status chat_message_status_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message_status
    ADD CONSTRAINT chat_message_status_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: chat_message_status chat_message_status_chat_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_message_status
    ADD CONSTRAINT chat_message_status_chat_message_id_fkey FOREIGN KEY (chat_message_id) REFERENCES public.chat_message(id) ON DELETE CASCADE;


--
-- Name: chat chat_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: chat_tenant chat_tenant_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_tenant
    ADD CONSTRAINT chat_tenant_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(id) ON DELETE CASCADE;


--
-- Name: chat_tenant chat_tenant_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.chat_tenant
    ADD CONSTRAINT chat_tenant_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: compliance_event compliance_event_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.compliance_event
    ADD CONSTRAINT compliance_event_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: compliance_reminder_sent compliance_reminder_sent_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.compliance_reminder_sent
    ADD CONSTRAINT compliance_reminder_sent_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.compliance_event(id) ON DELETE CASCADE;


--
-- Name: document document_document_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_type(id) ON DELETE CASCADE;


--
-- Name: document document_incident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_incident_id_fkey FOREIGN KEY (incident_id) REFERENCES public.incident(id) ON DELETE SET NULL;


--
-- Name: document document_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: document document_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: expense expense_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.document(id) ON DELETE SET NULL;


--
-- Name: expense expense_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.landlord(id) ON DELETE CASCADE;


--
-- Name: expense expense_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: incident incident_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: incident incident_severity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_severity_id_fkey FOREIGN KEY (severity_id) REFERENCES public.incident_severity(id) ON DELETE CASCADE;


--
-- Name: incident incident_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE SET NULL;


--
-- Name: landlord landlord_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.landlord
    ADD CONSTRAINT landlord_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: landlord landlord_payment_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.landlord
    ADD CONSTRAINT landlord_payment_plan_id_fkey FOREIGN KEY (payment_plan_id) REFERENCES public.payment_plan(id) ON DELETE CASCADE;


--
-- Name: property property_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.landlord(id) ON DELETE CASCADE;


--
-- Name: property property_lead_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_lead_tenant_id_fkey FOREIGN KEY (lead_tenant_id) REFERENCES public.tenant(id) ON DELETE SET NULL;


--
-- Name: property property_property_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_property_status_id_fkey FOREIGN KEY (property_status_id) REFERENCES public.property_status(id);


--
-- Name: property_tenant property_tenant_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property_tenant
    ADD CONSTRAINT property_tenant_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: property_tenant property_tenant_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.property_tenant
    ADD CONSTRAINT property_tenant_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: rent_payment rent_payment_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.rent_payment
    ADD CONSTRAINT rent_payment_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: rent_payment rent_payment_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.rent_payment
    ADD CONSTRAINT rent_payment_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: task task_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: task task_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.task_status(id);


--
-- Name: tenant tenant_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: tommyrowe
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

