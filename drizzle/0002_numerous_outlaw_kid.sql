CREATE TABLE "sys_role" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"key" varchar(255) NOT NULL,
	"data_scope" integer NOT NULL,
	"status" integer NOT NULL,
	"create_time" timestamp with time zone NOT NULL,
	"create_by" integer NOT NULL,
	"update_time" timestamp with time zone NOT NULL,
	"update_by" integer NOT NULL,
	"del_flag" varchar(1) DEFAULT '0'
);
