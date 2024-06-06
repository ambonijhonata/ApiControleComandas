--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-06-05 23:51:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16431)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16430)
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_id_seq OWNER TO postgres;

--
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 215
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- TOC entry 221 (class 1259 OID 16475)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nome text NOT NULL
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16474)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 220
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 224 (class 1259 OID 16485)
-- Name: comandas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comandas (
    id integer NOT NULL,
    id_cliente integer NOT NULL,
    active integer NOT NULL,
    id_mesa integer NOT NULL
);


ALTER TABLE public.comandas OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16484)
-- Name: comanda_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comanda_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comanda_id_cliente_seq OWNER TO postgres;

--
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 223
-- Name: comanda_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comanda_id_cliente_seq OWNED BY public.comandas.id_cliente;


--
-- TOC entry 222 (class 1259 OID 16483)
-- Name: comanda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comanda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comanda_id_seq OWNER TO postgres;

--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 222
-- Name: comanda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comanda_id_seq OWNED BY public.comandas.id;


--
-- TOC entry 227 (class 1259 OID 16499)
-- Name: comandas_produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comandas_produtos (
    id_comanda integer NOT NULL,
    id_produto integer NOT NULL,
    qtd_produto integer NOT NULL
);


ALTER TABLE public.comandas_produtos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16497)
-- Name: comandas_produtos_id_comanda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comandas_produtos_id_comanda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comandas_produtos_id_comanda_seq OWNER TO postgres;

--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 225
-- Name: comandas_produtos_id_comanda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comandas_produtos_id_comanda_seq OWNED BY public.comandas_produtos.id_comanda;


--
-- TOC entry 226 (class 1259 OID 16498)
-- Name: comandas_produtos_id_produto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comandas_produtos_id_produto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comandas_produtos_id_produto_seq OWNER TO postgres;

--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 226
-- Name: comandas_produtos_id_produto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comandas_produtos_id_produto_seq OWNED BY public.comandas_produtos.id_produto;


--
-- TOC entry 219 (class 1259 OID 16460)
-- Name: mesas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesas (
    id numeric NOT NULL,
    descricao text NOT NULL
);


ALTER TABLE public.mesas OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16442)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    decription text,
    price numeric(10,2) NOT NULL,
    currency character varying(5) DEFAULT 'USD'::character varying NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    category_id integer NOT NULL,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16441)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_id_seq OWNER TO postgres;

--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 217
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- TOC entry 4660 (class 2604 OID 16434)
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- TOC entry 4669 (class 2604 OID 16478)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 4670 (class 2604 OID 16488)
-- Name: comandas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas ALTER COLUMN id SET DEFAULT nextval('public.comanda_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 16489)
-- Name: comandas id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas ALTER COLUMN id_cliente SET DEFAULT nextval('public.comanda_id_cliente_seq'::regclass);


--
-- TOC entry 4672 (class 2604 OID 16502)
-- Name: comandas_produtos id_comanda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas_produtos ALTER COLUMN id_comanda SET DEFAULT nextval('public.comandas_produtos_id_comanda_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 16503)
-- Name: comandas_produtos id_produto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas_produtos ALTER COLUMN id_produto SET DEFAULT nextval('public.comandas_produtos_id_produto_seq'::regclass);


--
-- TOC entry 4663 (class 2604 OID 16445)
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- TOC entry 4837 (class 0 OID 16431)
-- Dependencies: 216
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name, created_date, update_date) FROM stdin;
1	Comidas	2024-06-05 22:42:34.581967	2024-06-05 22:42:34.581967
2	Bebidas	2024-06-05 22:42:49.39652	2024-06-05 22:42:49.39652
\.


--
-- TOC entry 4842 (class 0 OID 16475)
-- Dependencies: 221
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, nome) FROM stdin;
4	jhonata
6	mario
7	Vitor
\.


--
-- TOC entry 4845 (class 0 OID 16485)
-- Dependencies: 224
-- Data for Name: comandas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comandas (id, id_cliente, active, id_mesa) FROM stdin;
24	6	1	8
25	4	1	7
27	7	0	8
\.


--
-- TOC entry 4848 (class 0 OID 16499)
-- Dependencies: 227
-- Data for Name: comandas_produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comandas_produtos (id_comanda, id_produto, qtd_produto) FROM stdin;
25	13	2
27	13	2
24	11	2
24	13	3
\.


--
-- TOC entry 4840 (class 0 OID 16460)
-- Dependencies: 219
-- Data for Name: mesas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mesas (id, descricao) FROM stdin;
1	Prox a porta
2	Prox ao balcao
3	Corredor direito
4	Corredor direito
6	Corredor direito
5	Corredor do meio
7	Corredor do meio
8	Corredor do meio
\.


--
-- TOC entry 4839 (class 0 OID 16442)
-- Dependencies: 218
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, decription, price, currency, quantity, active, category_id, created_date, updated_date) FROM stdin;
11	Pizza	\N	45.50	USD	0	t	1	2024-06-05 22:44:10.003222	2024-06-05 22:44:10.003222
13	Refrigerante	\N	8.50	USD	0	t	2	2024-06-05 23:24:19.034754	2024-06-05 23:24:19.034754
\.


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 215
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 7, true);


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 220
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 7, true);


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 223
-- Name: comanda_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comanda_id_cliente_seq', 1, false);


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 222
-- Name: comanda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comanda_id_seq', 27, true);


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 225
-- Name: comandas_produtos_id_comanda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comandas_produtos_id_comanda_seq', 1, false);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 226
-- Name: comandas_produtos_id_produto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comandas_produtos_id_produto_seq', 1, false);


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 217
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 13, true);


--
-- TOC entry 4675 (class 2606 OID 16440)
-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- TOC entry 4677 (class 2606 OID 16438)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- TOC entry 4683 (class 2606 OID 16482)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 4685 (class 2606 OID 16491)
-- Name: comandas comanda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT comanda_pkey PRIMARY KEY (id);


--
-- TOC entry 4687 (class 2606 OID 16505)
-- Name: comandas_produtos comandas_produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas_produtos
    ADD CONSTRAINT comandas_produtos_pkey PRIMARY KEY (id_comanda, id_produto);


--
-- TOC entry 4681 (class 2606 OID 16466)
-- Name: mesas pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesas
    ADD CONSTRAINT pk PRIMARY KEY (id);


--
-- TOC entry 4679 (class 2606 OID 16454)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 4691 (class 2606 OID 16511)
-- Name: comandas_produtos fk_comanda; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas_produtos
    ADD CONSTRAINT fk_comanda FOREIGN KEY (id_comanda) REFERENCES public.comandas(id) NOT VALID;


--
-- TOC entry 4689 (class 2606 OID 16492)
-- Name: comandas fk_comandas_clientes; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT fk_comandas_clientes FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);


--
-- TOC entry 4690 (class 2606 OID 16521)
-- Name: comandas fk_comandas_mesas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT fk_comandas_mesas FOREIGN KEY (id_mesa) REFERENCES public.mesas(id) NOT VALID;


--
-- TOC entry 4692 (class 2606 OID 16516)
-- Name: comandas_produtos fk_produto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comandas_produtos
    ADD CONSTRAINT fk_produto FOREIGN KEY (id_produto) REFERENCES public.product(id) NOT VALID;


--
-- TOC entry 4688 (class 2606 OID 16455)
-- Name: product product_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id);


-- Completed on 2024-06-05 23:51:44

--
-- PostgreSQL database dump complete
--

