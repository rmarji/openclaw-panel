import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── Users ───────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── NextAuth Accounts (OAuth) ───────────────────────────
export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

// ─── NextAuth Sessions (not used with JWT, but keep for adapter compat) ──
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ─── NextAuth Verification Tokens ────────────────────────
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ─── Subscriptions ───────────────────────────────────────
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeSubscriptionId: text("stripe_subscription_id").unique().notNull(),
    stripePriceId: text("stripe_price_id").notNull(),
    tier: text("tier").notNull(), // starter | pro | team
    status: text("status").notNull(), // active | past_due | canceled | trialing
    billingPeriod: text("billing_period").notNull(), // monthly | yearly
    currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [index("sub_user_idx").on(t.userId)]
);

// ─── Agents (deployed OpenClaw instances) ────────────────
export const agents = pgTable(
  "agents",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    subscriptionId: text("subscription_id").references(() => subscriptions.id, {
      onDelete: "set null",
    }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    coolifyUuid: text("coolify_uuid"),
    status: text("status").notNull().default("pending"), // pending | provisioning | ready | error | stopped
    domain: text("domain"),
    telegramBotUsername: text("telegram_bot_username"),
    gatewayToken: text("gateway_token"),
    provisionError: text("provision_error"),
    provisionedAt: timestamp("provisioned_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("agent_user_idx").on(t.userId),
    index("agent_sub_idx").on(t.subscriptionId),
  ]
);

// ─── Pending Checkouts (pre-auth purchase tracking) ──────
export const pendingCheckouts = pgTable(
  "pending_checkouts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    stripeSessionId: text("stripe_session_id").unique().notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    email: text("email"),
    tier: text("tier").notNull(),
    billingPeriod: text("billing_period").notNull(),
    status: text("status").notNull().default("pending"), // pending | completed | expired
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("pending_email_idx").on(t.email),
    uniqueIndex("pending_session_idx").on(t.stripeSessionId),
  ]
);

// ─── Telegram Bot Pool ───────────────────────────────────
export const telegramBotPool = pgTable("telegram_bot_pool", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  botToken: text("bot_token").unique().notNull(),
  botUsername: text("bot_username").unique().notNull(),
  allocatedToAgentId: text("allocated_to_agent_id").references(
    () => agents.id,
    { onDelete: "set null" }
  ),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
