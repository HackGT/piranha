# Migration `20201028032805-change-array-names-to-plural`

This migration has been generated by Ayush Goyal at 10/27/2020, 11:28:05 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201027213231-move-vendor-to-requisition-item..20201028032805-change-array-names-to-plural
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
@@ -59,15 +59,15 @@
   lineItems LineItem[]
 }
 model LineItem {
-  id              Int               @id @default(autoincrement())
-  name            String
-  quantity        Int
-  unitCost        Float
-  categoryId      Int
-  category        Category          @relation(fields: [categoryId], references: [id])
-  requisitionItem RequisitionItem[]
+  id               Int               @id @default(autoincrement())
+  name             String
+  quantity         Int
+  unitCost         Float
+  categoryId       Int
+  category         Category          @relation(fields: [categoryId], references: [id])
+  requisitionItems RequisitionItem[]
 }
 model OperatingBudget {
   id                 Int                 @id @default(autoincrement())
@@ -120,10 +120,10 @@
   name                      String        @unique
   isActive                  Boolean       @default(true)
   reimbursementInstructions String?
   isDirectPayment           Boolean       @default(false)
-  payment                   Payment[]
-  expenses_requisition      Requisition[]
+  payments                  Payment[]
+  requisitions              Requisition[]
 }
 model Project {
   id           Int           @id @default(autoincrement())
```

