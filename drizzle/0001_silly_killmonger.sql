CREATE TABLE "sys_menu" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"path" varchar(255) NOT NULL,
	"type" varchar(1) NOT NULL,
	"parent_id" bigint,
	"sorting" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"label" varchar(255) NOT NULL,
	"perms" varchar(255),
	"status" integer NOT NULL,
	"hiding" integer NOT NULL,
	"create_time" timestamp with time zone NOT NULL,
	"create_by" integer NOT NULL,
	"update_time" timestamp with time zone NOT NULL,
	"update_by" integer NOT NULL,
	"del_flag" varchar(1)
);
comment on table "sys_menu" is 'menu table';
comment on column "sys_menu"."id" is 'menu_id';
comment on column "sys_menu"."path" is 'file_path';
comment on column "sys_menu"."type" is 'menu_type: D:dir, M:menu, B:button, F:file';
comment on column "sys_menu"."parent_id" is 'parent_id';
comment on column "sys_menu"."sorting" is 'sorting';
comment on column "sys_menu"."name" is 'menu_name';
comment on column "sys_menu"."label" is 'menu_label';
comment on column "sys_menu"."perms" is 'menu_permissions';
comment on column "sys_menu"."status" is 'menu_status';
comment on column "sys_menu"."hiding" is 'menu_hiding';
comment on column "sys_menu"."create_time" is 'create_time';
comment on column "sys_menu"."create_by" is 'create_by';
comment on column "sys_menu"."update_time" is 'update_time';
comment on column "sys_menu"."update_by" is 'update_by';
comment on column "sys_menu"."del_flag" is 'del_flag';



CREATE TABLE "sys_user" (
	"user_id" bigserial PRIMARY KEY NOT NULL,
	"dept_id" integer,
	"user_name" varchar(20) NOT NULL,
	"nick_name" varchar(20) NOT NULL,
	"email" varchar(50),
	"phonenumber" varchar(20),
	"sex" varchar(1),
	"avatar" varchar(255),
	"password" varchar(255) NOT NULL,
	"status" varchar(1),
	"del_flag" varchar(1),
	"login_ip" varchar(50),
	"login_date" timestamp with time zone,
	"create_dept" integer NOT NULL,
	"create_by" integer NOT NULL,
	"create_time" timestamp with time zone NOT NULL,
	"update_by" integer NOT NULL,
	"update_time" timestamp with time zone NOT NULL,
	"remark" varchar(255),
	CONSTRAINT "sys_user_email_unique" UNIQUE("email")
);
