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
-- Name: public; Type: SCHEMA; Schema: -; Owner: tommyrowe
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO tommyrowe;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.account (
    id integer NOT NULL,
    role_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public.account OWNER TO tommyrowe;

--
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_id_seq OWNER TO tommyrowe;

--
-- Name: account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;


--
-- Name: account_role; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.account_role (
    id integer NOT NULL,
    role character varying(15) NOT NULL
);


ALTER TABLE public.account_role OWNER TO tommyrowe;

--
-- Name: account_role_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.account_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_role_id_seq OWNER TO tommyrowe;

--
-- Name: account_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.account_role_id_seq OWNED BY public.account_role.id;


--
-- Name: calendar_event; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.calendar_event (
    id integer NOT NULL,
    landlord_id integer NOT NULL,
    property_id integer NOT NULL,
    status_id integer NOT NULL,
    title character varying(50) NOT NULL,
    description character varying(255) NOT NULL,
    scheduled_at timestamp without time zone NOT NULL,
    duration interval NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.calendar_event OWNER TO tommyrowe;

--
-- Name: calendar_event_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.calendar_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendar_event_id_seq OWNER TO tommyrowe;

--
-- Name: calendar_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.calendar_event_id_seq OWNED BY public.calendar_event.id;


--
-- Name: calendar_event_status; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.calendar_event_status (
    id integer NOT NULL,
    status character varying(20) NOT NULL
);


ALTER TABLE public.calendar_event_status OWNER TO tommyrowe;

--
-- Name: calendar_event_status_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.calendar_event_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendar_event_status_id_seq OWNER TO tommyrowe;

--
-- Name: calendar_event_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.calendar_event_status_id_seq OWNED BY public.calendar_event_status.id;


--
-- Name: chat; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.chat (
    id integer NOT NULL,
    property_id integer NOT NULL
);


ALTER TABLE public.chat OWNER TO tommyrowe;

--
-- Name: chat_id_seq; Type: SEQUENCE; Schema: public; Owner: tommyrowe
--

CREATE SEQUENCE public.chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_id_seq OWNER TO tommyrowe;

--
-- Name: chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tommyrowe
--

ALTER SEQUENCE public.chat_id_seq OWNED BY public.chat.id;


--
-- Name: chat_message; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.chat_message (
    id integer NOT NULL,
    chat_id integer NOT NULL,
    sender_id integer NOT NULL,
    incident_id integer,
    message_text character varying(512) NOT NULL,
    sent_timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


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
-- Name: incident; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.incident (
    id integer NOT NULL,
    property_id integer NOT NULL,
    severity_id integer NOT NULL,
    title character varying(50) NOT NULL,
    description character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closed boolean DEFAULT false NOT NULL
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
    payment_plan_id integer NOT NULL
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
    rent_due_date smallint
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
-- Name: tenant; Type: TABLE; Schema: public; Owner: tommyrowe
--

CREATE TABLE public.tenant (
    id integer NOT NULL,
    account_id integer NOT NULL
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
-- Name: document id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document ALTER COLUMN id SET DEFAULT nextval('public.document_id_seq'::regclass);


--
-- Name: document_type id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.document_type ALTER COLUMN id SET DEFAULT nextval('public.document_type_id_seq'::regclass);


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
-- Name: tenant id; Type: DEFAULT; Schema: public; Owner: tommyrowe
--

ALTER TABLE ONLY public.tenant ALTER COLUMN id SET DEFAULT nextval('public.tenant_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.account (id, role_id, first_name, last_name, password, email, email_verified) FROM stdin;
136288	1	test	test	$2b$10$NLHMXgJX5Wb8v92ZhNY6vOLwGCCeWg8r8Arsv7Rh1vDHu2EbGBDsO	test@tester.com	f
1	1	tommy	rowe	$2b$10$0G3D0Fn3okdMFXuAD0J33O38huA9/qItELthp4hA9tGMZlxWUmoIe	tommy.rowe.dev@gmail.com	f
3	2	tommy	rowe	$2b$10$IrSd9XYM/fOOP1rxjguzHOOnhrRp0pzZQLOaveBM2l371k.Ao4nla	rowetommy123@gmail.com	f
4	2	tommy	rowe	$2b$10$CXi3OYRbqCfqYTjCTZw65.scXk7iKjOgurEW88ynGzaSn8A0OVSN6	tommy.rowe.dev@moll.co.uk	f
5	2	tommy	rowe	$2b$10$tzhLQ3JgR00xn7cgekEI9ev/BkXC8HxsHim6n5QdNLqTr0ej8G2WS	tommy.rowe.dev@moll.co	f
6	2	tommy	rowe	$2b$10$aQDJQFWuJwefOhZnsvyR3.pzH6l/RmcSVahk2EWXDifCVmHjgmzbC	tommy.rowe.dev@g.co	f
7	2	tommy	rowe	$2b$10$s.j3xQ/giZADOu1wlSrYEuAmbm0R55VZUx0ASgrNVyUH0LPnkN68G	tommy.rowe.dev@ghhggh.c	f
8	2	tommy	rowe	$2b$10$WQGyB4Dnr3w7JA6544Ra2.kbt.jKot/28pkJALSOSY6dBwAJya9cS	tommy.rowe.dev@com.c	f
9	2	tommy	rowe	$2b$10$Ko0C1ekIbe56KaR.3Mt0/OxI31K1JEUy86RvBevBWZysS1kyGEJwa	tommy.rowe.dev@go.go	f
10	2	tommy	rowe	$2b$10$jEOsLOvekcQr6BP.g9.Wve5s9QlAUV8T7zhihwmyFSC1FtXkAlFmO	tommy.rowe.dev@gguguy.jj	f
11	2	tommy	rowe	$2b$10$yjSmZEZLRDduXpunzh6X/OFPyPuIXKJI3Qjc660dr/tEoMi.tzAE2	tommy.rowe.dev@g.g	f
13	2	tommy	rowe	$2b$10$/fzMht16jn5SFXuLt4aLoer5jGXCxtK/kQ82nVzMh5pfbb6lrNxVa	test.test@test.com	f
14	2	tommy	rowe	$2b$10$WIKGNIWItLI.eCbMeSc1FOQ8qQiUSlqEsOuLnXD1qSMmYt.GKeyZW	cthom@gmail.com	f
15	2	chris	tom	$2b$10$UkrUNbsYGwCHBWixD8MaeOkrxyk/7UhRyNIOO9tlhg3eZdSnpX7cq	ct@cr.com	f
17	2	tommy	rowe	$2b$10$LNLUwk6tz1X.wrrfn4MLKu6h48MAHVuKTkmbpmGeRTbkhaX9LEUTa	tommy.rowe.dev@doge.com	f
18	2	tia	rowe	$2b$10$UdPiGbtyAwN/kW/iCFAdhuRZB/I2W.gQhsi27v5/0LgHohZCpwud2	tia.r@icloud.com	f
828929	1	test	test	$2b$10$S3tMUD6eSz8s1WLk2W3tTeBxrdZUYb1Pqc9QsiFApO3cyg12peSuW	tes.t@testy.com	f
\.


--
-- Data for Name: account_role; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.account_role (id, role) FROM stdin;
1	landlord
2	tenant
\.


--
-- Data for Name: calendar_event; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.calendar_event (id, landlord_id, property_id, status_id, title, description, scheduled_at, duration, created_at) FROM stdin;
\.


--
-- Data for Name: calendar_event_status; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.calendar_event_status (id, status) FROM stdin;
1	Scheduled
2	Completed
3	Cancelled
\.


--
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.chat (id, property_id) FROM stdin;
\.


--
-- Data for Name: chat_message; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.chat_message (id, chat_id, sender_id, incident_id, message_text, sent_timestamp) FROM stdin;
\.


--
-- Data for Name: chat_message_status; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.chat_message_status (id, chat_message_id, account_id, is_read) FROM stdin;
\.


--
-- Data for Name: chat_tenant; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.chat_tenant (id, chat_id, tenant_id) FROM stdin;
\.


--
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.document (id, property_id, tenant_id, incident_id, document_type_id, document_path, uploaded_at) FROM stdin;
\.


--
-- Data for Name: document_type; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.document_type (id, type) FROM stdin;
1	Tenancy Agreement
2	Section 21 Notice
3	Gas Safety Certificate
4	Inventory Report
5	Inspection Report
\.


--
-- Data for Name: incident; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.incident (id, property_id, severity_id, title, description, created_at, closed) FROM stdin;
\.


--
-- Data for Name: incident_severity; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.incident_severity (id, severity) FROM stdin;
1	Low
2	Medium
3	High
4	Critical
\.


--
-- Data for Name: landlord; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.landlord (id, account_id, payment_plan_id) FROM stdin;
1	1	1
\.


--
-- Data for Name: payment_plan; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.payment_plan (id, name, description, monthly_rate) FROM stdin;
1	Basic	Temporary plan for dev	0.00
\.


--
-- Data for Name: property; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.property (id, landlord_id, property_status_id, lead_tenant_id, number, name, address, city, county, postcode) FROM stdin;
2	1	1	\N	\N	tommy rowe	6 corsair close	Lee-on-the-Solent	hampshire	PO13 8GF
7	1	1	\N	\N	tommy rowe	6 corsair close	Lee-on-the-Solent	hampshire	PO13 8GF
4	1	2	\N	\N	5	5 corsair close	Lee-on-the-Solent	hampshire	PO13 8GF
5	1	2	\N	\N	tommy rowe	4 corsair close	Lee-on-the-Solent	hampshire	PO13 8GF
\.


--
-- Data for Name: property_status; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.property_status (id, status) FROM stdin;
1	Available
2	Occupied
3	Under Maintenance
4	Not Available
\.


--
-- Data for Name: property_tenant; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.property_tenant (id, property_id, tenant_id, pays_rent, rent_amount, rent_due_date) FROM stdin;
3	4	10	t	2000.00	28
4	5	11	t	2000.00	30
\.


--
-- Data for Name: tenant; Type: TABLE DATA; Schema: public; Owner: tommyrowe
--

COPY public.tenant (id, account_id) FROM stdin;
1	6
2	7
3	8
4	9
5	10
6	11
7	13
10	17
11	18
\.


--
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.account_id_seq', 18, true);


--
-- Name: account_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.account_role_id_seq', 8, true);


--
-- Name: calendar_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.calendar_event_id_seq', 1, false);


--
-- Name: calendar_event_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.calendar_event_status_id_seq', 6, true);


--
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.chat_id_seq', 1, false);


--
-- Name: chat_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.chat_message_id_seq', 1, false);


--
-- Name: chat_message_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.chat_message_status_id_seq', 1, false);


--
-- Name: chat_tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.chat_tenant_id_seq', 1, false);


--
-- Name: document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.document_id_seq', 1, false);


--
-- Name: document_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.document_type_id_seq', 10, true);


--
-- Name: incident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.incident_id_seq', 1, false);


--
-- Name: incident_severity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.incident_severity_id_seq', 8, true);


--
-- Name: landlord_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.landlord_id_seq', 1, true);


--
-- Name: payment_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.payment_plan_id_seq', 1, true);


--
-- Name: property_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.property_id_seq', 7, true);


--
-- Name: property_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.property_status_id_seq', 16, true);


--
-- Name: property_tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.property_tenant_id_seq', 4, true);


--
-- Name: tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tommyrowe
--

SELECT pg_catalog.setval('public.tenant_id_seq', 11, true);


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

