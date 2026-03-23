-- ClawGeeks Customer Portal Schema
-- Run: psql -U clawgeeks -d clawgeeks -f drizzle/0000_initial.sql

CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "email_verified" timestamp,
  "image" text,
  "stripe_customer_id" text UNIQUE,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "provider_account_id" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  PRIMARY KEY ("provider", "provider_account_id")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "session_token" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "stripe_subscription_id" text NOT NULL UNIQUE,
  "stripe_price_id" text NOT NULL,
  "tier" text NOT NULL,
  "status" text NOT NULL,
  "billing_period" text NOT NULL,
  "current_period_end" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "sub_user_idx" ON "subscriptions" ("user_id");

CREATE TABLE IF NOT EXISTS "agents" (
  "id" text PRIMARY KEY NOT NULL,
  "subscription_id" text REFERENCES "subscriptions"("id") ON DELETE SET NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "coolify_uuid" text,
  "status" text NOT NULL DEFAULT 'pending',
  "domain" text,
  "telegram_bot_username" text,
  "gateway_token" text,
  "provision_error" text,
  "provisioned_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "agent_user_idx" ON "agents" ("user_id");
CREATE INDEX IF NOT EXISTS "agent_sub_idx" ON "agents" ("subscription_id");

CREATE TABLE IF NOT EXISTS "pending_checkouts" (
  "id" text PRIMARY KEY NOT NULL,
  "stripe_session_id" text NOT NULL UNIQUE,
  "stripe_customer_id" text,
  "email" text,
  "tier" text NOT NULL,
  "billing_period" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "pending_email_idx" ON "pending_checkouts" ("email");

CREATE TABLE IF NOT EXISTS "telegram_bot_pool" (
  "id" text PRIMARY KEY NOT NULL,
  "bot_token" text NOT NULL UNIQUE,
  "bot_username" text NOT NULL UNIQUE,
  "allocated_to_agent_id" text REFERENCES "agents"("id") ON DELETE SET NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);
