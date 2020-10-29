# Migration `20201024221308-change-date-to-default-on-approval`

This migration has been generated by Ayush Goyal at 10/24/2020, 6:13:08 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Approval" DROP COLUMN "date",
ADD COLUMN "date" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201024005705-change-to-funding-source..20201024221308-change-date-to-default-on-approval
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 enum AccessLevel {
   NONE
@@ -87,9 +87,9 @@
 model Approval {
   id            Int         @id @default(autoincrement())
   isApproving   Boolean
   notes         String?
-  date          String
+  date          DateTime    @default(now())
   approverId    Int
   requisitionId Int
   approver      User        @relation(fields: [approverId], references: [id])
   requisition   Requisition @relation(fields: [requisitionId], references: [id])
```

