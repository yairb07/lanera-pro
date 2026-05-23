create extension if not exists pgcrypto;

create type user_role as enum ('admin', 'employee');
create type order_status as enum ('quote', 'confirmed', 'in_production', 'ready_to_ship', 'shipped', 'delivered', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'cancelled');
create type inventory_movement_type as enum ('entry', 'exit', 'adjustment');

create table app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  full_name text not null,
  role user_role not null default 'employee',
  employee_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  job_role text not null,
  shift text,
  payment_type text not null check (payment_type in ('salary', 'piecework')),
  base_amount numeric(12,2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table app_users
  add constraint app_users_employee_id_fkey
  foreign key (employee_id) references employees(id);

create table garments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  program_file_name text,
  stitch_count integer,
  grams_per_unit numeric(12,3) not null default 0,
  tension text,
  yarn text,
  needle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table yarn_cones (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  brand text,
  color text not null,
  material text,
  weight_grams numeric(12,3) not null,
  stock_cones numeric(12,3) not null default 0 check (stock_cones >= 0),
  min_stock_cones numeric(12,3) not null default 0,
  supplier text,
  unit_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  destination_country text,
  total_value numeric(12,2) not null default 0,
  advance_percent numeric(5,2) not null default 50 check (advance_percent >= 0 and advance_percent <= 100),
  status order_status not null default 'quote',
  assigned_employee_id uuid references employees(id),
  deadline date,
  notes text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  previous_status order_status,
  new_status order_status not null,
  note text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table production_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id),
  garment_id uuid not null references garments(id),
  cone_id uuid not null references yarn_cones(id),
  order_id uuid references orders(id),
  quantity integer not null check (quantity > 0),
  grams_per_unit numeric(12,3) not null check (grams_per_unit >= 0),
  total_grams numeric(12,3) not null check (total_grams >= 0),
  cones_used numeric(12,3) not null check (cones_used >= 0),
  registered_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  cone_id uuid not null references yarn_cones(id),
  production_record_id uuid references production_records(id),
  movement_type inventory_movement_type not null,
  quantity_cones numeric(12,3) not null,
  stock_before numeric(12,3) not null,
  stock_after numeric(12,3) not null check (stock_after >= 0),
  reason text not null,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table financial_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  employee_id uuid references employees(id),
  transaction_type text not null check (transaction_type in ('income', 'expense')),
  concept text not null,
  amount numeric(12,2) not null check (amount >= 0),
  status payment_status not null default 'pending',
  transaction_date date not null default current_date,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table security_cameras (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  stream_url text,
  status text not null default 'offline',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id),
  action text not null,
  entity_name text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_orders_status on orders(status);
create index idx_orders_assigned_employee on orders(assigned_employee_id);
create index idx_order_events_order on order_events(order_id, created_at desc);
create index idx_production_created_at on production_records(created_at desc);
create index idx_production_employee on production_records(employee_id);
create index idx_inventory_cone_created_at on inventory_movements(cone_id, created_at desc);
create index idx_financial_status on financial_transactions(status);
create index idx_audit_logs_entity on audit_logs(entity_name, entity_id);
