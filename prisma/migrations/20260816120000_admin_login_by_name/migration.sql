-- Admin logs in with a name instead of an email
ALTER TABLE "AdminUser" RENAME COLUMN "email" TO "name";
