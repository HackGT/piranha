# Migration `20201024005705-change-to-funding-source`

This migration has been generated by Ayush Goyal at 10/23/2020, 8:57:05 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201023235034-add-session-store..20201024005705-change-to-funding-source
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
@@ -153,9 +153,9 @@
   budgetId             Int?
   purchaseDate         String?
   budget               Budget?           @relation(fields: [budgetId], references: [id])
   createdBy            User              @relation(fields: [createdById], references: [id])
-  paymentMethod        PaymentMethod?    @relation(fields: [fundingSourceId], references: [id])
+  fundingSource        PaymentMethod?    @relation(fields: [fundingSourceId], references: [id])
   project              Project           @relation(fields: [projectId], references: [id])
   vendor               Vendor?           @relation(fields: [vendorId], references: [id])
   approvals            Approval[]
   files                File[]
```

